import { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      onLogin({
        id: 'demo-user-123',
        email: email || 'demo@habitflow.app',
        name: name || 'Demo User',
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <div className="login-logo-icon">🌊</div>
          <h1 className="login-title">HabitFlow</h1>
          <p className="login-subtitle">Build better habits with AI-powered insights</p>
        </div>

        <div className="login-card">
          <h2 className="login-card-title">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="form-input"
                />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="login-switch">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="login-switch-btn"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          <div className="demo-note">
            <p>📝 Demo Mode: Click Sign In to explore the app with sample data</p>
          </div>
        </div>

        <p className="login-footer">
          Powered by Node.js + Supabase + OpenAI RAG
        </p>
      </div>
    </div>
  );
}
