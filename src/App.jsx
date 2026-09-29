import { useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import HabitList from './components/HabitList.jsx';
import Statistics from './components/Statistics.jsx';
import AIAssistant from './components/AIAssistant.jsx';
import LoginPage from './components/LoginPage.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'habits', label: 'My Habits', icon: '✅' },
    { id: 'statistics', label: 'Statistics', icon: '📈' },
    { id: 'ai', label: 'AI Assistant', icon: '🤖' },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'habits': return <HabitList user={user} />;
      case 'statistics': return <Statistics user={user} />;
      case 'ai': return <AIAssistant user={user} />;
      default: return <Dashboard user={user} />;
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">🌊</div>
          <div className="logo-text">
            <h1>HabitFlow</h1>
            <p>Smart Habit Tracker</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-name">{user.name || 'User'}</div>
              <div className="user-email">{user.email}</div>
            </div>
          </div>
          <button onClick={() => setUser(null)} className="logout-btn">
            <span>🚪</span>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}
