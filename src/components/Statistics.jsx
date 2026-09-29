import { useState, useEffect } from 'react';
import { API_URL } from '../lib/supabase.js';

export default function Statistics({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!stats || stats.totalHabits === 0) {
    return (
      <div>
        <div className="page-header">
          <h2 className="page-title">Statistics</h2>
          <p className="page-subtitle">Create some habits to see your statistics</p>
        </div>
      </div>
    );
  }

  const totalCompletions = stats.weeklyData.reduce((acc, day) => acc + day.completed, 0);

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Statistics</h2>
        <p className="page-subtitle">Track your progress and patterns</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon green">🎯</div>
            <span className="stat-label">Completion Rate</span>
          </div>
          <p className="stat-value">{stats.completionRate}%</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon orange">🏆</div>
            <span className="stat-label">Best Streak</span>
          </div>
          <p className="stat-value">{stats.longestStreak} days</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon indigo">📅</div>
            <span className="stat-label">Weekly Check-ins</span>
          </div>
          <p className="stat-value">{totalCompletions}</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon purple">🎯</div>
            <span className="stat-label">Active Habits</span>
          </div>
          <p className="stat-value">{stats.totalHabits}</p>
        </div>
      </div>

      <div className="content-grid">
        <div className="chart-card">
          <h3 className="chart-title">Weekly Completion</h3>
          <div className="bar-chart">
            {stats.weeklyData.map((day) => {
              const height = day.total > 0 ? (day.completed / day.total) * 100 : 0;
              return (
                <div key={day.day} className="bar-item">
                  <span className="bar-value">{day.completed}</span>
                  <div className="bar" style={{ height: `${height}%` }} />
                  <span className="bar-label">{day.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Habit Streaks 🔥</h3>
          {stats.habits && stats.habits.map((habit) => (
            <div key={habit.id} className="streak-item">
              <span className="streak-name">{habit.name}</span>
              <div className="streak-bar">
                <div
                  className={`streak-fill ${habit.streak === stats.longestStreak && habit.streak > 0 ? 'best' : ''}`}
                  style={{ width: `${stats.longestStreak > 0 ? (habit.streak / stats.longestStreak) * 100 : 0}%` }}
                />
              </div>
              <span className="streak-count">
                {habit.streak}d
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
