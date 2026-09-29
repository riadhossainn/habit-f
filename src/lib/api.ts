import { API_BASE_URL } from './supabase';
import type { Habit, HabitLog, AIMessage, UserStats } from '../types';

// Habit API calls
export async function fetchHabits(userId: string): Promise<Habit[]> {
  const response = await fetch(`${API_BASE_URL}/api/habits?user_id=${userId}`);
  if (!response.ok) throw new Error('Failed to fetch habits');
  return response.json();
}

export async function createHabit(habit: Partial<Habit>): Promise<Habit> {
  const response = await fetch(`${API_BASE_URL}/api/habits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(habit),
  });
  if (!response.ok) throw new Error('Failed to create habit');
  return response.json();
}

export async function updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
  const response = await fetch(`${API_BASE_URL}/api/habits/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update habit');
  return response.json();
}

export async function deleteHabit(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/habits/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete habit');
}

// Habit Log API calls
export async function logHabitCompletion(habitId: string, userId: string, date: string): Promise<HabitLog> {
  const response = await fetch(`${API_BASE_URL}/api/habit-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ habit_id: habitId, user_id: userId, completed_date: date }),
  });
  if (!response.ok) throw new Error('Failed to log habit');
  return response.json();
}

export async function fetchHabitLogs(userId: string, startDate: string, endDate: string): Promise<HabitLog[]> {
  const response = await fetch(`${API_BASE_URL}/api/habit-logs?user_id=${userId}&start=${startDate}&end=${endDate}`);
  if (!response.ok) throw new Error('Failed to fetch logs');
  return response.json();
}

// AI / RAG API calls
export async function sendAIMessage(messages: AIMessage[], userId: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, user_id: userId }),
  });
  if (!response.ok) throw new Error('Failed to get AI response');
  const data = await response.json();
  return data.response;
}

export async function fetchUserStats(userId: string): Promise<UserStats> {
  const response = await fetch(`${API_BASE_URL}/api/stats?user_id=${userId}`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
}
