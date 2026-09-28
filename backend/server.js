/**
 * HabitFlow Backend Server
 * ========================
 * Pure Node.js HTTP server (no Express or other frameworks)
 * Uses Supabase for database (PostgreSQL)
 * Implements RAG (Retrieval Augmented Generation) with OpenAI API
 * 
 * To run: node server.js
 * Requires: .env file with SUPABASE_URL, SUPABASE_SERVICE_KEY, OPENAI_API_KEY
 */

const http = require('http');
const { createClient } = require('@supabase/supabase-js');
const https = require('https');

// Load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'your-service-key';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-openai-api-key';
const PORT = process.env.PORT || 3001;

// Initialize Supabase admin client (with service key for RLS bypass)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================
// HELPER FUNCTIONS
// ============================================

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

function parseURL(url) {
  const [path, queryString] = url.split('?');
  const params = {};
  if (queryString) {
    queryString.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
  }
  return { path, params };
}

// ============================================
// RAG (Retrieval Augmented Generation) MODULE
// ============================================

/**
 * RAG Implementation:
 * 1. RETRIEVE: Fetch relevant user data from Supabase (habits, logs, stats)
 * 2. AUGMENT: Build a context-rich prompt with the retrieved data
 * 3. GENERATE: Send to OpenAI API for personalized response
 */

async function retrieveUserContext(userId) {
  // Step 1: Retrieve user's habits
  const { data: habits, error: habitsError } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (habitsError) {
    console.error('Error fetching habits:', habitsError);
    return null;
  }

  // Step 2: Retrieve recent habit logs (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: logs, error: logsError } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('completed_date', thirtyDaysAgo.toISOString().split('T')[0]);

  if (logsError) {
    console.error('Error fetching logs:', logsError);
    return null;
  }

  // Step 3: Calculate statistics
  const stats = calculateStats(habits || [], logs || []);

  // Step 4: Build context document
  const context = {
    habits: (habits || []).map(h => ({
      name: h.name,
      category: h.category,
      frequency: h.frequency,
      created_at: h.created_at,
      streak: stats.streaks[h.id] || 0,
    })),
    recentLogs: (logs || []).slice(-50),
    statistics: stats,
    totalHabits: (habits || []).length,
    totalCompletions: (logs || []).length,
  };

  return context;
}

function calculateStats(habits, logs) {
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.completed_date === today);
  
  // Calculate streaks for each habit
  const streaks = {};
  habits.forEach(habit => {
    const habitLogs = logs
      .filter(l => l.habit_id === habit.id)
      .map(l => l.completed_date)
      .sort()
      .reverse();
    
    let streak = 0;
    const date = new Date();
    for (let i = 0; i < 365; i++) {
      const dateStr = date.toISOString().split('T')[0];
      if (habitLogs.includes(dateStr)) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }
    streaks[habit.id] = streak;
  });

  // Completion rate (last 7 days)
  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push(d.toISOString().split('T')[0]);
  }
  const recentLogs = logs.filter(l => last7Days.includes(l.completed_date));
  const expectedCompletions = habits.length * 7;
  const completionRate = expectedCompletions > 0 
    ? Math.round((recentLogs.length / expectedCompletions) * 100) 
    : 0;

  // Best day of week
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];
  logs.forEach(l => {
    const day = new Date(l.completed_date).getDay();
    dayCounts[day]++;
  });
  const bestDay = dayCounts.indexOf(Math.max(...dayCounts));
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return {
    completedToday: todayLogs.length,
    totalHabits: habits.length,
    completionRate,
    streaks,
    bestDay: dayNames[bestDay],
    longestStreak: Math.max(0, ...Object.values(streaks)),
  };
}

function buildRAGPrompt(userContext, conversationHistory) {
  const contextStr = `
USER'S HABIT DATA (Retrieved from Database):
============================================
Total Active Habits: ${userContext.totalHabits}
Total Completions (30 days): ${userContext.totalCompletions}
Completion Rate (7 days): ${userContext.statistics.completionRate}%
Best Day: ${userContext.statistics.bestDay}
Longest Current Streak: ${userContext.statistics.longestStreak} days

Habits:
${userContext.habits.map(h => `- ${h.name} (${h.category}, ${h.frequency}) - Current streak: ${h.streak} days`).join('\n')}

Recent Activity:
- Completed today: ${userContext.statistics.completedToday}/${userContext.totalHabits} habits
- Last 7 days completion: ${userContext.statistics.completionRate}%
`;

  const systemPrompt = `You are an AI habit coach assistant for the HabitFlow application. You have access to the user's personal habit tracking data retrieved from their database.

IMPORTANT: Use the retrieved data to provide PERSONALIZED advice. Reference specific habits, streaks, and patterns from the data. Be encouraging but honest.

${contextStr}

When responding:
1. Reference the user's actual data when possible
2. Provide actionable, specific advice
3. Be encouraging and motivating
4. Use the user's habit names and categories
5. Suggest improvements based on patterns you see in the data
6. Keep responses concise but informative
7. Use emojis sparingly for visual appeal`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
  ];

  return messages;
}

async function callOpenAI(messages) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => { responseData += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.choices && parsed.choices[0]) {
            resolve(parsed.choices[0].message.content);
          } else {
            reject(new Error('Invalid OpenAI response'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Fallback response when API is not available
function getFallbackResponse(userMessage, userContext) {
  const lowerMsg = userMessage.toLowerCase();
  const stats = userContext.statistics;
  const habitNames = userContext.habits.map(h => h.name).join(', ');

  if (lowerMsg.includes('streak') || lowerMsg.includes('consistency')) {
    return `Based on your data, your longest current streak is ${stats.longestStreak} days! Your habits (${habitNames}) show good consistency. Keep going!`;
  }
  if (lowerMsg.includes('improve') || lowerMsg.includes('tips')) {
    return `Your completion rate is ${stats.completionRate}% this week. Your best day is ${stats.bestDay}. Try scheduling harder habits on your weaker days for better balance.`;
  }
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    return `Hello! I can see you have ${stats.totalHabits} active habits: ${habitNames}. You've completed ${stats.completedToday} today. How can I help you improve?`;
  }
  return `Looking at your data: You have ${stats.totalHabits} habits (${habitNames}), ${stats.completionRate}% completion rate this week, and a best streak of ${stats.longestStreak} days. What would you like to know?`;
}

// ============================================
// ROUTE HANDLERS
// ============================================

async function handleHabits(req, res, method, params, body) {
  if (method === 'GET') {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', params.user_id)
      .order('created_at', { ascending: false });

    if (error) return sendJSON(res, 500, { error: error.message });
    return sendJSON(res, 200, data || []);
  }

  if (method === 'POST') {
    const { data, error } = await supabase
      .from('habits')
      .insert([body])
      .select()
      .single();

    if (error) return sendJSON(res, 500, { error: error.message });
    return sendJSON(res, 201, data);
  }
}

async function handleHabitById(req, res, method, habitId, body) {
  if (method === 'PUT') {
    const { data, error } = await supabase
      .from('habits')
      .update(body)
      .eq('id', habitId)
      .select()
      .single();

    if (error) return sendJSON(res, 500, { error: error.message });
    return sendJSON(res, 200, data);
  }

  if (method === 'DELETE') {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId);

    if (error) return sendJSON(res, 500, { error: error.message });
    return sendJSON(res, 200, { success: true });
  }
}

async function handleHabitLogs(req, res, method, params, body) {
  if (method === 'GET') {
    let query = supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', params.user_id);

    if (params.start) query = query.gte('completed_date', params.start);
    if (params.end) query = query.lte('completed_date', params.end);

    const { data, error } = await query.order('completed_date', { ascending: false });
    if (error) return sendJSON(res, 500, { error: error.message });
    return sendJSON(res, 200, data || []);
  }

  if (method === 'POST') {
    const { data, error } = await supabase
      .from('habit_logs')
      .insert([body])
      .select()
      .single();

    if (error) return sendJSON(res, 500, { error: error.message });
    return sendJSON(res, 201, data);
  }
}

async function handleAIChat(req, res, body) {
  const { messages, user_id } = body;

  if (!user_id) {
    return sendJSON(res, 400, { error: 'user_id is required' });
  }

  try {
    // RAG Step 1: RETRIEVE user context from database
    const userContext = await retrieveUserContext(user_id);

    if (!userContext) {
      return sendJSON(res, 500, { error: 'Failed to retrieve user data' });
    }

    // RAG Step 2: AUGMENT - Build context-rich prompt
    const ragMessages = buildRAGPrompt(userContext, messages);

    // RAG Step 3: GENERATE - Call OpenAI API
    let response;
    try {
      response = await callOpenAI(ragMessages);
    } catch (apiError) {
      console.error('OpenAI API error, using fallback:', apiError.message);
      // Fallback: use local logic when API is unavailable
      const lastUserMsg = messages.filter(m => m.role === 'user').pop();
      response = getFallbackResponse(lastUserMsg?.content || '', userContext);
    }

    // Save conversation to database
    await supabase.from('ai_conversations').insert([{
      user_id,
      messages: JSON.stringify(messages),
      response,
      created_at: new Date().toISOString(),
    }]);

    return sendJSON(res, 200, { response });

  } catch (error) {
    console.error('AI Chat error:', error);
    return sendJSON(res, 500, { error: 'Internal server error' });
  }
}

async function handleStats(req, res, params) {
  const { user_id } = params;
  if (!user_id) return sendJSON(res, 400, { error: 'user_id required' });

  const userContext = await retrieveUserContext(user_id);
  if (!userContext) return sendJSON(res, 500, { error: 'Failed to fetch stats' });

  // Generate weekly data
  const weeklyData = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const completed = userContext.recentLogs.filter(l => l.completed_date === dateStr).length;
    weeklyData.push({
      day: dayNames[d.getDay()],
      completed,
      total: userContext.totalHabits,
    });
  }

  return sendJSON(res, 200, {
    totalHabits: userContext.totalHabits,
    completedToday: userContext.statistics.completedToday,
    currentStreak: userContext.statistics.longestStreak,
    longestStreak: userContext.statistics.longestStreak,
    completionRate: userContext.statistics.completionRate,
    weeklyData,
  });
}

// ============================================
// MAIN SERVER
// ============================================

const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  const { path, params } = parseURL(req.url);
  const method = req.method;

  try {
    // Health check
    if (path === '/api/health') {
      return sendJSON(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
    }

    // Habits routes
    if (path === '/api/habits') {
      const body = method === 'POST' ? await parseBody(req) : {};
      return await handleHabits(req, res, method, params, body);
    }

    // Single habit routes
    const habitMatch = path.match(/^\/api\/habits\/(.+)$/);
    if (habitMatch) {
      const body = method === 'PUT' ? await parseBody(req) : {};
      return await handleHabitById(req, res, method, habitMatch[1], body);
    }

    // Habit logs routes
    if (path === '/api/habit-logs') {
      const body = method === 'POST' ? await parseBody(req) : {};
      return await handleHabitLogs(req, res, method, params, body);
    }

    // AI Chat route (RAG)
    if (path === '/api/ai/chat') {
      const body = await parseBody(req);
      return await handleAIChat(req, res, body);
    }

    // Stats route
    if (path === '/api/stats') {
      return await handleStats(req, res, params);
    }

    // 404
    sendJSON(res, 404, { error: 'Route not found' });

  } catch (error) {
    console.error('Server error:', error);
    sendJSON(res, 500, { error: 'Internal server error' });
  }
});

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║         HabitFlow Backend Server             ║
║                                              ║
║  Server running on port ${PORT}                ║
║  Supabase: ${SUPABASE_URL.substring(0, 30)}...  ║
║  RAG: OpenAI API                             ║
║                                              ║
║  Endpoints:                                  ║
║  GET    /api/health                          ║
║  GET    /api/habits?user_id=...              ║
║  POST   /api/habits                          ║
║  PUT    /api/habits/:id                      ║
║  DELETE /api/habits/:id                      ║
║  GET    /api/habit-logs?user_id=...          ║
║  POST   /api/habit-logs                      ║
║  POST   /api/ai/chat  (RAG)                  ║
║  GET    /api/stats?user_id=...               ║
╚══════════════════════════════════════════════╝
  `);
});
