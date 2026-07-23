import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
const rawUrl = metaEnv.VITE_SUPABASE_URL || 'https://nzboklccdeytymhbjyiu.supabase.co';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56Ym9rbGNjZGV5dHltaGJqeWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3ODk4NTgsImV4cCI6MjEwMDM2NTg1OH0.WT8cDakA3KIEAEMM8mONm62RnNIiq04MpzB5KyQrnEU';

export const isSupabaseConfigured = (): boolean => {
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    !supabaseUrl.includes('placeholder.supabase.co') &&
    supabaseAnonKey !== 'placeholder-key'
  );
};

if (!isSupabaseConfigured()) {
  console.warn(
    '⚠️ Supabase URL or Anon Key is missing or using placeholders. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

// Client instance initialized safely
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

