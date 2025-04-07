import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://pmdlojumeqawffmpdrez.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZGxvanVtZXFhd2ZmbXBkcmV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MjE0ODcsImV4cCI6MjA1OTQ5NzQ4N30.q5KTgnQRfNO0RFlL5Tfai8_IqhtKad0z93pcsRdz1yQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
