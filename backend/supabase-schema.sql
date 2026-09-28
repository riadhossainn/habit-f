-- ============================================
-- HabitFlow Database Schema for Supabase
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- This uses simple PostgreSQL (no complex PL/SQL)
-- ============================================

-- 1. Habits Table
-- Stores all user habits
CREATE TABLE IF NOT EXISTS habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'Other',
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'custom')),
  target_days INTEGER[] DEFAULT '{0,1,2,3,4,5,6}',
  color TEXT DEFAULT '#6366f1',
  icon TEXT DEFAULT '🎯',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habit Logs Table
-- Records when a habit is completed
CREATE TABLE IF NOT EXISTS habit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, completed_date)
);

-- 3. AI Conversations Table
-- Stores RAG-powered AI chat history
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Indexes for better query performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_id ON habit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON habit_logs(completed_date);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);

-- ============================================
-- Enable Row Level Security (RLS)
-- This ensures users can only access their own data
-- ============================================
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- Policies for habits table
CREATE POLICY "Users can view own habits" ON habits
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create own habits" ON habits
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own habits" ON habits
  FOR UPDATE USING (user_id = auth.uid()::text);

CREATE POLICY "Users can delete own habits" ON habits
  FOR DELETE USING (user_id = auth.uid()::text);

-- Policies for habit_logs table
CREATE POLICY "Users can view own logs" ON habit_logs
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create own logs" ON habit_logs
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- Policies for ai_conversations table
CREATE POLICY "Users can view own conversations" ON ai_conversations
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create own conversations" ON ai_conversations
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- ============================================
-- NOTE: The backend uses the service_role key
-- which bypasses RLS. The RLS policies above
-- are for when the frontend connects directly
-- to Supabase for authentication.
-- ============================================
