import { createClient } from '@supabase/supabase-js';

// These are placeholder values - replace with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API base URL for backend
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
