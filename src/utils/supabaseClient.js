import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eohgdldppvrrcfutiiwd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvaGdkbGRwcHZycmNmdXRpaXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4Mzg1NDIsImV4cCI6MjA4MDQxNDU0Mn0.Afypeodo0TEdXklDzcEY98MSdqUp7M8H9Ai8Lv3SH04";;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables. Please check your .env file');
}

// Validate URL format
if (!SUPABASE_URL.startsWith('https://')) {
  throw new Error('Invalid Supabase URL. Must start with https://');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase client initialized for production');