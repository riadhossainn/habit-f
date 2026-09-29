import { useState, useEffect } from 'react';
import { API_URL } from '../lib/supabase.js';

export default function Dashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stats?user_id=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (habitId) => {
    const today = new Date().toISOString().split('T')[0];
    const isCompleted = completedIds.has(habitId);

    try {
      if (isCompleted) {
        // Remove completion
        await fetch(`${API_URL}/api/habit-logs?habit_id=${habitId}&date=${today}`, {
          method: 'DELETE',
        });
        setCompletedIds(prev => {
          const next = new Set(prev);
          next.delete(habitId);
          return next;
        });
      } else {
        // Add completion
        await fetch(`${API_URL}/api/habit-logs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            habit_id: habitId,
            user_id: user.id,
            completed_date: today,
          }),
        });
        setCompletedIds(prev => new Set([...prev, habitId]));
      }
      fetchStats();
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!stats) {
    return (
      <div>
        <div className="page-header">
          <h2 className="page-title">Welcome! 👋</h2>
          <p className="page-subtitle">Start by creating your first habit</p>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">{greeting} 👋</h2>
        <p className="page-subtitle">{today}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon indigo">🎯</div>
            <span className="stat-label">Active Habits</span>
          </div>
          <p className="stat-value">{stats.totalHabits}</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon green">✅</div>
            <span className="stat-label">Done Today</span>
          </div>
          <p className="stat-value">{stats.completedToday}/{stats.totalHabits}</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon orange">🔥</div>
            <span className="stat-label">Current Streak</span>
          </div>
          <p className="stat-value">{stats.currentStreak} days</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon purple">📈</div>
            <span className="stat-label">Completion</span>
          </div>
          <p className="stat-value">{stats.completionRate}%</p>
        </div>
      </div>

      <div className="content-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📅 Today's Habits</h3>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              {stats.completedToday} of {stats.totalHabits} completed
            </span>
          </div>
          <div className="card-body">
            {stats.habits && stats.habits.length > 0 ? (
              stats.habits.map((habit) => {
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
              })
            ) : (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
                No habits yet. Create your first habit!
              </p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">⚡ Weekly Progress</h3>
          </div>
          <div className="card-body">
            {stats.weeklyData && stats.weeklyData.map((day) => {
              const percentage = day.total > 0 ? (day.completed / day.total) * 100 : 0;
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
                {stats.completionRate >= 80 
                  ? 'Great job! You\'re maintaining excellent consistency.'
                  : stats.completionRate >= 50
                  ? 'Good progress! Try to complete more habits consistently.'
                  : 'Focus on building momentum. Start with smaller, easier habits.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
