import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Target, 
  TrendingUp, 
  CheckCircle2,
  Calendar,
  Zap
} from 'lucide-react';
import type { User, Habit } from '../types';

interface Props {
  user: User;
}

// Demo data for the frontend (in production, fetched from backend)
const demoHabits: Habit[] = [
  { id: '1', user_id: '1', name: 'Morning Meditation', description: '10 minutes of mindfulness', category: 'Health', frequency: 'daily', target_days: [0,1,2,3,4,5,6], color: '#6366f1', icon: '🧘', created_at: '2024-01-01', is_active: true },
  { id: '2', user_id: '1', name: 'Read 30 Pages', description: 'Read a book daily', category: 'Learning', frequency: 'daily', target_days: [0,1,2,3,4,5,6], color: '#8b5cf6', icon: '📚', created_at: '2024-01-05', is_active: true },
  { id: '3', user_id: '1', name: 'Exercise', description: '30 min workout', category: 'Fitness', frequency: 'daily', target_days: [0,1,2,3,4], color: '#ec4899', icon: '💪', created_at: '2024-01-10', is_active: true },
  { id: '4', user_id: '1', name: 'Drink Water', description: '8 glasses of water', category: 'Health', frequency: 'daily', target_days: [0,1,2,3,4,5,6], color: '#06b6d4', icon: '💧', created_at: '2024-01-15', is_active: true },
  { id: '5', user_id: '1', name: 'Journal', description: 'Write daily reflections', category: 'Mindfulness', frequency: 'daily', target_days: [0,1,2,3,4,5,6], color: '#f59e0b', icon: '📝', created_at: '2024-02-01', is_active: true },
  { id: '6', user_id: '1', name: 'No Social Media', description: 'Limit social media to 30min', category: 'Productivity', frequency: 'daily', target_days: [0,1,2,3,4,5], color: '#10b981', icon: '📵', created_at: '2024-02-10', is_active: true },
];

const getCompletedToday = () => {
  const today = new Date().getDay();
  return Math.floor(Math.random() * 3) + 2;
};

export default function Dashboard({ user }: Props) {
  const [habits, setHabits] = useState<Habit[]>(demoHabits);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set(['1', '4']));
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const toggleComplete = (id: string) => {
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {greeting}, {user.name?.split(' ')[0] || 'there'} 👋
        </h2>
        <p className="text-gray-500 mt-1">{today}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Target size={20} className="text-indigo-600" />
            </div>
            <span className="text-sm text-gray-500">Active Habits</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{habits.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={20} className="text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Done Today</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{completedIds.size}/{habits.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Flame size={20} className="text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">Current Streak</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">12 days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Completion</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Habits */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar size={18} className="text-indigo-600" />
              Today's Habits
            </h3>
            <span className="text-sm text-gray-500">{completedIds.size} of {habits.length} completed</span>
          </div>
          <div className="p-4 space-y-2">
            {habits.map((habit, index) => {
              const isCompleted = completedIds.has(habit.id);
              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                  }`}
                  onClick={() => toggleComplete(habit.id)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    isCompleted ? 'bg-green-200' : 'bg-gray-100'
                  }`}>
                    {habit.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isCompleted ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                      {habit.name}
                    </p>
                    <p className="text-xs text-gray-500">{habit.description}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}>
                    {isCompleted && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Zap size={18} className="text-amber-500" />
              Weekly Progress
            </h3>
          </div>
          <div className="p-5 space-y-3">
            {weeklyData.map((day, index) => {
              const percentage = (day.completed / day.total) * 100;
              return (
                <div key={day.day} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-8">{day.day}</span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className={`h-full rounded-full ${
                        percentage === 100 ? 'bg-green-500' : percentage >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                      }`}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{day.completed}/{day.total}</span>
                </div>
              );
            })}
          </div>

          {/* AI Insight */}
          <div className="p-5 border-t border-gray-100">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">🤖</span>
                <span className="text-xs font-medium text-indigo-700">AI Insight</span>
              </div>
              <p className="text-xs text-gray-600">
                You're most consistent with morning habits! Try scheduling "Exercise" earlier in the day for better results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
