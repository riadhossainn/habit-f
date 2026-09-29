/**
 * HabitFlow Backend Server
 * Pure Node.js HTTP server with Supabase integration
 */

const http = require('http');
const { createClient } = require('@supabase/supabase-js');
const { handleRAGChat } = require('./rag');

// Load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const PORT = process.env.PORT || 3001;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Helper functions
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

// Route handlers
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

  if (method === 'DELETE') {
    const { error } = await supabase
      .from('habit_logs')
      .delete()
      .eq('habit_id', params.habit_id)
      .eq('completed_date', params.date);

    if (error) return sendJSON(res, 500, { error: error.message });
    return sendJSON(res, 200, { success: true });
  }
}

async function handleStats(req, res, params) {
  const { user_id } = params;
  if (!user_id) return sendJSON(res, 400, { error: 'user_id required' });

  // Get all habits
  const { data: habits, error: habitsError } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user_id)
    .eq('is_active', true);

  if (habitsError) return sendJSON(res, 500, { error: habitsError.message });

  // Get logs for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: logs, error: logsError } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', user_id)
    .gte('completed_date', thirtyDaysAgo.toISOString().split('T')[0]);

  if (logsError) return sendJSON(res, 500, { error: logsError.message });

  // Calculate stats
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.completed_date === today);

  // Calculate streaks
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

  // Weekly data
  const weeklyData = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const completed = logs.filter(l => l.completed_date === dateStr).length;
    weeklyData.push({
      day: dayNames[d.getDay()],
      completed,
      total: habits.length,
    });
  }

  return sendJSON(res, 200, {
    totalHabits: habits.length,
    completedToday: todayLogs.length,
    currentStreak: Math.max(0, ...Object.values(streaks)),
    longestStreak: Math.max(0, ...Object.values(streaks)),
    completionRate,
    weeklyData,
    habits: habits.map(h => ({ ...h, streak: streaks[h.id] || 0 })),
  });
}

// Main server
const server = http.createServer(async (req, res) => {
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
    if (path === '/api/health') {
      return sendJSON(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
    }

    if (path === '/api/habits') {
      const body = method === 'POST' ? await parseBody(req) : {};
      return await handleHabits(req, res, method, params, body);
    }

    const habitMatch = path.match(/^\/api\/habits\/(.+)$/);
    if (habitMatch) {
      const body = method === 'PUT' ? await parseBody(req) : {};
      return await handleHabitById(req, res, method, habitMatch[1], body);
    }

    if (path === '/api/habit-logs') {
      const body = method === 'POST' ? await parseBody(req) : {};
      return await handleHabitLogs(req, res, method, params, body);
    }

    if (path === '/api/ai/chat') {
      const body = await parseBody(req);
      return await handleRAGChat(req, res, body, supabase);
    }

    if (path === '/api/stats') {
      return await handleStats(req, res, params);
    }

    sendJSON(res, 404, { error: 'Route not found' });

  } catch (error) {
    console.error('Server error:', error);
    sendJSON(res, 500, { error: 'Internal server error' });
  }
});

server.listen(PORT, () => {
  console.log(`HabitFlow Backend running on port ${PORT}`);
  console.log(`Supabase: ${SUPABASE_URL}`);
});
