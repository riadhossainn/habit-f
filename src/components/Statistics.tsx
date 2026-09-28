import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, Calendar, Target } from 'lucide-react';
import type { User } from '../types';

interface Props {
  user: User;
}

const weeklyData = [
  { day: 'Mon', meditation: 1, reading: 1, exercise: 1, water: 1, journal: 1, nosocial: 1 },
  { day: 'Tue', meditation: 1, reading: 1, exercise: 0, water: 1, journal: 1, nosocial: 0 },
  { day: 'Wed', meditation: 1, reading: 1, exercise: 1, water: 1, journal: 1, nosocial: 1 },
  { day: 'Thu', meditation: 1, reading: 0, exercise: 1, water: 1, journal: 0, nosocial: 0 },
  { day: 'Fri', meditation: 1, reading: 1, exercise: 1, water: 1, journal: 1, nosocial: 1 },
  { day: 'Sat', meditation: 0, reading: 1, exercise: 1, water: 1, journal: 1, nosocial: 0 },
  { day: 'Sun', meditation: 1, reading: 1, exercise: 0, water: 1, journal: 1, nosocial: 1 },
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

export default function Statistics({ user }: Props) {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  const totalCompletions = weeklyData.reduce((acc, day) => {
    return acc + Object.values(day).filter(v => typeof v === 'number' && v === 1).length;
  }, 0);

  const totalPossible = weeklyData.length * 6;
  const overallRate = Math.round((totalCompletions / totalPossible) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Statistics</h2>
          <p className="text-gray-500 mt-1">Track your progress and patterns</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              timeRange === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              timeRange === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
              <Target size={18} className="text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Completion Rate</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{overallRate}%</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
              <Award size={18} className="text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">Best Streak</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">30 days</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar size={18} className="text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Total Check-ins</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalCompletions}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={18} className="text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Improvement</span>
          </div>
          <p className="text-2xl font-bold text-green-600">+12%</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Completion Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Weekly Completion</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData.map(d => ({
              day: d.day,
              completed: Object.values(d).filter(v => typeof v === 'number' && v === 1).length,
              total: 6
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="completed" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
              />
              <Line type="monotone" dataKey="completion" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Time by Category</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {categoryData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Streaks */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Habit Streaks 🔥</h3>
          <div className="space-y-3">
            {streaksData.map((item, index) => (
              <motion.div
                key={item.habit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <span className="text-sm text-gray-600 w-24 truncate">{item.habit}</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.streak / item.best) * 100}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    className={`h-full rounded-full ${
                      item.streak === item.best ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-indigo-400 to-purple-500'
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-16 text-right">
                  {item.streak}d <span className="text-gray-400">/ {item.best}d</span>
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
