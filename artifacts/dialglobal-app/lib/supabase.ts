import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kcsldwhpwakeszbxjoaq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjc2xkd2hwd2FrZXN6Ynhqb2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjEzMDQsImV4cCI6MjA4OTU5NzMwNH0._nqBEexVDH24fyHTGq3omNgQmMvaHCVqf5LX_wIRS9E";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
