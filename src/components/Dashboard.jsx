import { useState, useEffect } from 'react';

const demoHabits = [
  { id: '1', name: 'Morning Meditation', description: '10 minutes of mindfulness', category: 'Health', icon: '🧘', color: '#6366f1' },
  { id: '2', name: 'Read 30 Pages', description: 'Read a book daily', category: 'Learning', icon: '📚', color: '#8b5cf6' },
  { id: '3', name: 'Exercise', description: '30 min workout', category: 'Fitness', icon: '💪', color: '#ec4899' },
  { id: '4', name: 'Drink Water', description: '8 glasses of water', category: 'Health', icon: '💧', color: '#06b6d4' },
  { id: '5', name: 'Journal', description: 'Write daily reflections', category: 'Mindfulness', icon: '📝', color: '#f59e0b' },
  { id: '6', name: 'No Social Media', description: 'Limit social media to 30min', category: 'Productivity', icon: '📵', color: '#10b981' },
];

export default function Dashboard({ user }) {
  const [habits] = useState(demoHabits);
  const [completedIds, setCompletedIds] = useState(new Set(['1', '4']));
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const toggleComplete = (id) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const completionRate = Math.round((completedIds.size / habits.length) * 100);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const weeklyData = [
    { day: 'Mon', completed: 5, total: 6 },
    { day: 'Tue', completed: 4, total: 6 },
    { day: 'Wed', completed: 6, total: 6 },
    { day: 'Thu', completed: 3, total: 6 },
    { day: 'Fri', completed: 5, total: 6 },
    { day: 'Sat', completed: 4, total: 6 },
    { day: 'Sun', completed: completedIds.size, total: 6 },
  ];

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">{greeting}, {user.name?.split(' ')[0] || 'there'} 👋</h2>
        <p className="page-subtitle">{today}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon indigo">🎯</div>
            <span className="stat-label">Active Habits</span>
          </div>
          <p className="stat-value">{habits.length}</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon green">✅</div>
            <span className="stat-label">Done Today</span>
          </div>
          <p className="stat-value">{completedIds.size}/{habits.length}</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon orange">🔥</div>
            <span className="stat-label">Current Streak</span>
          </div>
          <p className="stat-value">12 days</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon purple">📈</div>
            <span className="stat-label">Completion</span>
          </div>
          <p className="stat-value">{completionRate}%</p>
        </div>
      </div>

      <div className="content-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📅 Today's Habits</h3>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              {completedIds.size} of {habits.length} completed
            </span>
          </div>
          <div className="card-body">
            {habits.map((habit) => {
              const isCompleted = completedIds.has(habit.id);
              return (
                <div
                  key={habit.id}
                  className={`habit-item ${isCompleted ? 'completed' : ''}`}
                  onClick={() => toggleComplete(habit.id)}
                >
                  <div className="habit-icon">{habit.icon}</div>
                  <div className="habit-info">
                    <div className="habit-name">{habit.name}</div>
                    <div className="habit-desc">{habit.description}</div>
                  </div>
                  <div className="habit-check">
                    {isCompleted && <span className="check-mark">✓</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">⚡ Weekly Progress</h3>
          </div>
          <div className="card-body">
            {weeklyData.map((day) => {
              const percentage = (day.completed / day.total) * 100;
              const fillClass = percentage === 100 ? 'complete' : percentage >= 50 ? 'good' : 'low';
              return (
                <div key={day.day} className="progress-item">
                  <span className="progress-day">{day.day}</span>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${fillClass}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="progress-count">{day.completed}/{day.total}</span>
                </div>
              );
            })}

            <div className="ai-insight">
              <div className="ai-insight-header">
                <span>🤖</span>
                <span className="ai-insight-label">AI Insight</span>
              </div>
              <p className="ai-insight-text">
                You're most consistent with morning habits! Try scheduling "Exercise" earlier in the day for better results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
