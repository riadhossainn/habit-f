import { useState, useEffect } from 'react';
import { API_URL } from '../lib/supabase.js';

const categories = ['Health', 'Fitness', 'Learning', 'Mindfulness', 'Productivity', 'Social', 'Finance', 'Other'];
const icons = ['🧘', '📚', '💪', '💧', '📝', '📵', '🏃', '🎯', '💤', '🥗', '🎨', '🎵', '💻', '🌱', '❤️', '⭐'];
const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#f97316'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HabitList({ user }) {
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '', description: '', category: 'Health', frequency: 'daily',
    color: colors[0], icon: icons[0], target_days: [0,1,2,3,4,5,6],
  });

  useEffect(() => {
    fetchHabits();
  }, [user]);

  const fetchHabits = async () => {
    try {
      const response = await fetch(`${API_URL}/api/habits?user_id=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setHabits(data);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHabits = habits.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || h.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const openCreateForm = () => {
    setEditingHabit(null);
    setFormData({ name: '', description: '', category: 'Health', frequency: 'daily', color: colors[0], icon: icons[0], target_days: [0,1,2,3,4,5,6] });
    setShowForm(true);
  };

  const openEditForm = (habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name, description: habit.description, category: habit.category,
      frequency: habit.frequency, color: habit.color, icon: habit.icon, target_days: habit.target_days,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    
    try {
      if (editingHabit) {
        await fetch(`${API_URL}/api/habits/${editingHabit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch(`${API_URL}/api/habits`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            ...formData,
          }),
        });
      }
      setShowForm(false);
      fetchHabits();
    } catch (error) {
      console.error('Error saving habit:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this habit?')) return;
    
    try {
      await fetch(`${API_URL}/api/habits/${id}`, {
        method: 'DELETE',
      });
      fetchHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      target_days: prev.target_days.includes(day)
        ? prev.target_days.filter(d => d !== day)
        : [...prev.target_days, day].sort()
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">My Habits</h2>
          <p className="page-subtitle">Manage and track your daily habits</p>
        </div>
        <button onClick={openCreateForm} className="btn-primary">
          <span>➕</span> New Habit
        </button>
      </div>

      <div className="filters-row">
        <input
          type="text"
          placeholder="Search habits..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {filteredHabits.length > 0 ? (
        <div className="habits-grid">
          {filteredHabits.map((habit) => (
            <div key={habit.id} className="habit-card">
              <div className="habit-card-header">
                <div className="habit-card-icon" style={{ backgroundColor: habit.color + '20' }}>
                  {habit.icon}
                </div>
                <div className="habit-card-actions">
                  <button onClick={() => openEditForm(habit)} className="icon-btn">✏️</button>
                  <button onClick={() => handleDelete(habit.id)} className="icon-btn delete">🗑️</button>
                </div>
              </div>
              <h3 className="habit-card-name">{habit.name}</h3>
              <p className="habit-card-desc">{habit.description}</p>
              <div className="habit-card-footer">
                <span className="category-badge">{habit.category}</span>
                <div className="day-dots">
                  {dayNames.map((day, i) => (
                    <div
                      key={i}
                      className={`day-dot ${habit.target_days.includes(i) ? 'active' : ''}`}
                      style={habit.target_days.includes(i) ? { backgroundColor: habit.color } : {}}
                    >
                      {day[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</p>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>No habits yet</p>
          <p style={{ fontSize: '14px' }}>Click "New Habit" to create your first habit</p>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingHabit ? 'Edit Habit' : 'Create New Habit'}</h3>
              <button onClick={() => setShowForm(false)} className="modal-close">×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Habit Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g., Morning Meditation"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                placeholder="Brief description"
                className="form-input"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                  className="form-select"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData(p => ({ ...p, frequency: e.target.value }))}
                  className="form-select"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Icon</label>
              <div className="icon-picker">
                {icons.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setFormData(p => ({ ...p, icon }))}
                    className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Color</label>
              <div className="color-picker">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setFormData(p => ({ ...p, color }))}
                    className={`color-option ${formData.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Active Days</label>
              <div className="day-picker">
                {dayNames.map((day, i) => (
                  <button
                    key={i}
                    onClick={() => toggleDay(i)}
                    className={`day-option ${formData.target_days.includes(i) ? 'selected' : ''}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSave} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
              {editingHabit ? 'Update Habit' : 'Create Habit'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
