import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ilbjqxznqaqshwsrxwxx.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsYmpxeHpucWFxc2h3c3J4d3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDMzOTAsImV4cCI6MjA2MTA3OTM5MH0.UTh4Rd9HQ4Oh_5qi_tLzJya8TENUMktW9sAzVhnxcSU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
