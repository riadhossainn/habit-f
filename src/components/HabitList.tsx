import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import type { User, Habit } from '../types';

interface Props {
  user: User;
}

const categories = ['Health', 'Fitness', 'Learning', 'Mindfulness', 'Productivity', 'Social', 'Finance', 'Other'];
const icons = ['🧘', '📚', '💪', '💧', '📝', '📵', '🏃', '🎯', '💤', '🥗', '🎨', '🎵', '💻', '🌱', '❤️', '⭐'];
const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#f97316'];

const initialHabits: Habit[] = [
  { id: '1', user_id: '1', name: 'Morning Meditation', description: '10 minutes of mindfulness', category: 'Health', frequency: 'daily', target_days: [0,1,2,3,4,5,6], color: '#6366f1', icon: '🧘', created_at: '2024-01-01', is_active: true },
  { id: '2', user_id: '1', name: 'Read 30 Pages', description: 'Read a book daily', category: 'Learning', frequency: 'daily', target_days: [0,1,2,3,4,5,6], color: '#8b5cf6', icon: '📚', created_at: '2024-01-05', is_active: true },
  { id: '3', user_id: '1', name: 'Exercise', description: '30 min workout', category: 'Fitness', frequency: 'daily', target_days: [0,1,2,3,4], color: '#ec4899', icon: '💪', created_at: '2024-01-10', is_active: true },
  { id: '4', user_id: '1', name: 'Drink Water', description: '8 glasses of water', category: 'Health', frequency: 'daily', target_days: [0,1,2,3,4,5,6], color: '#06b6d4', icon: '💧', created_at: '2024-01-15', is_active: true },
  { id: '5', user_id: '1', name: 'Journal', description: 'Write daily reflections', category: 'Mindfulness', frequency: 'daily', target_days: [0,1,2,3,4,5,6], color: '#f59e0b', icon: '📝', created_at: '2024-02-01', is_active: true },
  { id: '6', user_id: '1', name: 'No Social Media', description: 'Limit social media to 30min', category: 'Productivity', frequency: 'daily', target_days: [0,1,2,3,4,5], color: '#10b981', icon: '📵', created_at: '2024-02-10', is_active: true },
];

export default function HabitList({ user }: Props) {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const [formData, setFormData] = useState<{
    name: string; description: string; category: string; frequency: 'daily' | 'weekly' | 'custom';
    color: string; icon: string; target_days: number[];
  }>({
    name: '', description: '', category: 'Health', frequency: 'daily',
    color: colors[0], icon: icons[0], target_days: [0,1,2,3,4,5,6],
  });

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

  const openEditForm = (habit: Habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name, description: habit.description, category: habit.category,
      frequency: habit.frequency, color: habit.color, icon: habit.icon, target_days: habit.target_days,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    
    if (editingHabit) {
      setHabits(prev => prev.map(h => h.id === editingHabit.id ? { ...h, ...formData } : h));
    } else {
      const newHabit: Habit = {
        id: Date.now().toString(),
        user_id: user.id,
        ...formData,
        created_at: new Date().toISOString(),
        is_active: true,
      };
      setHabits(prev => [...prev, newHabit]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const toggleDay = (day: number) => {
    setFormData(prev => ({
      ...prev,
      target_days: prev.target_days.includes(day)
        ? prev.target_days.filter(d => d !== day)
        : [...prev.target_days, day].sort()
    }));
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Habits</h2>
          <p className="text-gray-500 mt-1">Manage and track your daily habits</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={18} />
          New Habit
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search habits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none bg-white"
        >
          <option value="All">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Habits Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHabits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: habit.color + '20' }}>
                {habit.icon}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditForm(habit)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <Edit2 size={14} className="text-gray-500" />
                </button>
                <button onClick={() => handleDelete(habit.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{habit.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{habit.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{habit.category}</span>
              <div className="flex gap-0.5">
                {dayNames.map((day, i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-medium ${
                      habit.target_days.includes(i) ? 'text-white' : 'bg-gray-100 text-gray-400'
                    }`}
                    style={habit.target_days.includes(i) ? { backgroundColor: habit.color } : {}}
                  >
                    {day[0]}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingHabit ? 'Edit Habit' : 'Create New Habit'}
                </h3>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Habit Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g., Morning Meditation"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="Brief description"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none bg-white"
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData(p => ({ ...p, frequency: e.target.value as any }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none bg-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {icons.map(icon => (
                      <button
                        key={icon}
                        onClick={() => setFormData(p => ({ ...p, icon }))}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                          formData.icon === icon ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <div className="flex gap-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setFormData(p => ({ ...p, color }))}
                        className={`w-8 h-8 rounded-full transition-all ${
                          formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Active Days</label>
                  <div className="flex gap-2">
                    {dayNames.map((day, i) => (
                      <button
                        key={i}
                        onClick={() => toggleDay(i)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-medium transition-all ${
                          formData.target_days.includes(i)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  {editingHabit ? 'Update Habit' : 'Create Habit'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
