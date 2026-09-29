import { useState } from 'react';

const weeklyData = [
  { day: 'Mon', completed: 5, total: 6 },
  { day: 'Tue', completed: 4, total: 6 },
  { day: 'Wed', completed: 6, total: 6 },
  { day: 'Thu', completed: 3, total: 6 },
  { day: 'Fri', completed: 5, total: 6 },
  { day: 'Sat', completed: 4, total: 6 },
  { day: 'Sun', completed: 4, total: 6 },
];

const monthlyData = [
  { week: 'Week 1', completion: 78 },
  { week: 'Week 2', completion: 82 },
  { week: 'Week 3', completion: 71 },
  { week: 'Week 4', completion: 88 },
];

const categoryData = [
  { name: 'Health', value: 35, color: '#6366f1' },
  { name: 'Fitness', value: 25, color: '#ec4899' },
  { name: 'Learning', value: 20, color: '#8b5cf6' },
  { name: 'Mindfulness', value: 12, color: '#f59e0b' },
  { name: 'Productivity', value: 8, color: '#10b981' },
];

const streaksData = [
  { habit: 'Meditation', streak: 24, best: 30 },
  { habit: 'Reading', streak: 18, best: 22 },
  { habit: 'Exercise', streak: 12, best: 15 },
  { habit: 'Water', streak: 30, best: 30 },
  { habit: 'Journal', streak: 15, best: 20 },
  { habit: 'No Social', streak: 8, best: 14 },
];

export default function Statistics() {
  const [timeRange, setTimeRange] = useState('week');

  const totalCompletions = weeklyData.reduce((acc, day) => acc + day.completed, 0);
  const totalPossible = weeklyData.length * 6;
  const overallRate = Math.round((totalCompletions / totalPossible) * 100);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Statistics</h2>
          <p className="page-subtitle">Track your progress and patterns</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setTimeRange('week')}
            className={`btn-secondary ${timeRange === 'week' ? 'active' : ''}`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`btn-secondary ${timeRange === 'month' ? 'active' : ''}`}
          >
            This Month
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon green">🎯</div>
            <span className="stat-label">Completion Rate</span>
          </div>
          <p className="stat-value">{overallRate}%</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon orange">🏆</div>
            <span className="stat-label">Best Streak</span>
          </div>
          <p className="stat-value">30 days</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon indigo">📅</div>
            <span className="stat-label">Total Check-ins</span>
          </div>
          <p className="stat-value">{totalCompletions}</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon purple">📈</div>
            <span className="stat-label">Improvement</span>
          </div>
          <p className="stat-value" style={{ color: '#16a34a' }}>+12%</p>
        </div>
      </div>

      <div className="content-grid">
        {/* Weekly Completion Bar Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Weekly Completion</h3>
          <div className="bar-chart">
            {weeklyData.map((day) => {
              const height = (day.completed / day.total) * 100;
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

        {/* Monthly Trend */}
        <div className="chart-card">
          <h3 className="chart-title">Monthly Trend</h3>
          <div className="bar-chart">
            {monthlyData.map((week) => (
              <div key={week.week} className="bar-item">
                <span className="bar-value">{week.completion}%</span>
                <div className="bar" style={{ height: `${week.completion}%`, background: 'linear-gradient(to top, #8b5cf6, #a78bfa)' }} />
                <span className="bar-label">{week.week}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="chart-card">
          <h3 className="chart-title">Time by Category</h3>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              {categoryData.map(item => (
                <div key={item.name} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', color: '#475569' }}>{item.name}</span>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#1e293b' }}>{item.value}%</span>
                  </div>
                  <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.value}%`, background: item.color, borderRadius: '4px', transition: 'width 0.5s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Streaks */}
        <div className="chart-card">
          <h3 className="chart-title">Habit Streaks 🔥</h3>
          {streaksData.map((item) => (
            <div key={item.habit} className="streak-item">
              <span className="streak-name">{item.habit}</span>
              <div className="streak-bar">
                <div
                  className={`streak-fill ${item.streak === item.best ? 'best' : ''}`}
                  style={{ width: `${(item.streak / item.best) * 100}%` }}
                />
              </div>
              <span className="streak-count">
                {item.streak}d <span className="streak-best">/ {item.best}d</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
