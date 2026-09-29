/**
 * RAG (Retrieval Augmented Generation) Module
 * Handles AI chat with user context from Supabase
 */

const https = require('https');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

async function retrieveUserContext(userId, supabase) {
  // Get user's habits
  const { data: habits, error: habitsError } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (habitsError) {
    console.error('Error fetching habits:', habitsError);
    return null;
  }

  // Get recent logs (last 30 days)
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

  // Calculate statistics
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.completed_date === today);

  const streaks = {};
  (habits || []).forEach(habit => {
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

  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push(d.toISOString().split('T')[0]);
  }
  const recentLogs = logs.filter(l => last7Days.includes(l.completed_date));
  const expectedCompletions = (habits || []).length * 7;
  const completionRate = expectedCompletions > 0 
    ? Math.round((recentLogs.length / expectedCompletions) * 100) 
    : 0;

  return {
    habits: (habits || []).map(h => ({
      name: h.name,
      category: h.category,
      frequency: h.frequency,
      streak: streaks[h.id] || 0,
    })),
    totalHabits: (habits || []).length,
    completedToday: todayLogs.length,
    completionRate,
    longestStreak: Math.max(0, ...Object.values(streaks)),
    totalCompletions: (logs || []).length,
  };
}

function buildRAGPrompt(userContext, conversationHistory) {
  const contextStr = `
USER'S HABIT DATA:
- Total Active Habits: ${userContext.totalHabits}
- Total Completions (30 days): ${userContext.totalCompletions}
- Completion Rate (7 days): ${userContext.completionRate}%
- Longest Current Streak: ${userContext.longestStreak} days
- Completed Today: ${userContext.completedToday}/${userContext.totalHabits}

Habits:
${userContext.habits.map(h => `- ${h.name} (${h.category}) - Streak: ${h.streak} days`).join('\n')}
`;

  const systemPrompt = `You are an AI habit coach for HabitFlow. You have access to the user's habit data.

${contextStr}

Provide personalized advice based on their actual data. Be encouraging and specific. Reference their habits by name.`;

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

async function handleRAGChat(req, res, body, supabase) {
  const { messages, user_id } = body;

  if (!user_id) {
    return sendJSON(res, 400, { error: 'user_id is required' });
  }

  try {
    // Step 1: Retrieve user context
    const userContext = await retrieveUserContext(user_id, supabase);

    if (!userContext) {
      return sendJSON(res, 500, { error: 'Failed to retrieve user data' });
    }

    // Step 2: Build augmented prompt
    const ragMessages = buildRAGPrompt(userContext, messages);

    // Step 3: Generate response
    let response;
    try {
      response = await callOpenAI(ragMessages);
    } catch (apiError) {
      console.error('OpenAI API error:', apiError.message);
      response = `I can see you have ${userContext.totalHabits} active habits with a ${userContext.completionRate}% completion rate this week. Your longest streak is ${userContext.longestStreak} days. Keep going!`;
    }

    // Save conversation
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

module.exports = { handleRAGChat };
