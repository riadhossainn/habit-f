export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'custom';
  target_days: number[];
  color: string;
  icon: string;
  created_at: string;
  is_active: boolean;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string;
  notes: string;
  created_at: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface UserStats {
  totalHabits: number;
  completedToday: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  weeklyData: { day: string; completed: number; total: number }[];
}

export interface User {
  id: string;
  email: string;
  name: string;
}
