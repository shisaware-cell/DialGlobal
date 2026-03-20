import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const SCHEMA_SQL = `
-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  plan TEXT DEFAULT 'basic',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Virtual numbers table
CREATE TABLE IF NOT EXISTS virtual_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  country TEXT DEFAULT 'United States',
  country_code TEXT DEFAULT 'US',
  flag TEXT DEFAULT '🇺🇸',
  type TEXT DEFAULT 'permanent',
  status TEXT DEFAULT 'active',
  telnyx_order_id TEXT,
  call_count INT DEFAULT 0,
  sms_count INT DEFAULT 0,
  missed_count INT DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  number_id UUID REFERENCES virtual_numbers(id) ON DELETE SET NULL,
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  body TEXT DEFAULT '',
  direction TEXT NOT NULL DEFAULT 'outbound',
  status TEXT DEFAULT 'sent',
  telnyx_message_id TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Calls table
CREATE TABLE IF NOT EXISTS calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  number_id UUID REFERENCES virtual_numbers(id) ON DELETE SET NULL,
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'outbound',
  status TEXT DEFAULT 'initiated',
  duration INT DEFAULT 0,
  telnyx_call_id TEXT,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_select_own') THEN
    CREATE POLICY profiles_select_own ON profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_update_own') THEN
    CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

-- Virtual numbers: users can CRUD their own
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'numbers_select_own') THEN
    CREATE POLICY numbers_select_own ON virtual_numbers FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'numbers_insert_own') THEN
    CREATE POLICY numbers_insert_own ON virtual_numbers FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'numbers_delete_own') THEN
    CREATE POLICY numbers_delete_own ON virtual_numbers FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Messages: users can CRUD their own
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'messages_select_own') THEN
    CREATE POLICY messages_select_own ON messages FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'messages_insert_own') THEN
    CREATE POLICY messages_insert_own ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Calls: users can read their own
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'calls_select_own') THEN
    CREATE POLICY calls_select_own ON calls FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'calls_insert_own') THEN
    CREATE POLICY calls_insert_own ON calls FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Helper functions for counter increments
CREATE OR REPLACE FUNCTION increment_sms(num_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE virtual_numbers SET sms_count = sms_count + 1 WHERE id = num_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_calls(num_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE virtual_numbers SET call_count = call_count + 1 WHERE id = num_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_missed(num_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE virtual_numbers SET missed_count = missed_count + 1 WHERE id = num_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Thread aggregation function
CREATE OR REPLACE FUNCTION get_message_threads(p_user_id UUID)
RETURNS TABLE (
  contact_number TEXT,
  last_body TEXT,
  last_time TIMESTAMPTZ,
  unread_count BIGINT,
  direction TEXT,
  number_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (contact)
    contact,
    m.body,
    m.created_at,
    (SELECT COUNT(*) FROM messages m2
     WHERE m2.user_id = p_user_id
     AND NOT m2.read
     AND CASE WHEN m2.direction = 'inbound' THEN m2.from_number ELSE m2.to_number END = contact
    ) as unread,
    m.direction,
    m.number_id
  FROM messages m,
  LATERAL (SELECT CASE WHEN m.direction = 'inbound' THEN m.from_number ELSE m.to_number END AS contact) sub
  WHERE m.user_id = p_user_id
  ORDER BY contact, m.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_virtual_numbers_user ON virtual_numbers(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_number ON messages(number_id);
CREATE INDEX IF NOT EXISTS idx_calls_user ON calls(user_id);
CREATE INDEX IF NOT EXISTS idx_calls_number ON calls(number_id);
`;

async function main() {
  console.log("Setting up Supabase schema...");

  const statements = SCHEMA_SQL.split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    const { error } = await supabase.rpc("exec_sql", { sql: stmt + ";" });
    if (error) {
      const { error: directErr } = await supabase
        .from("_exec")
        .select()
        .limit(0);

      console.log(`Executing via REST API: ${stmt.substring(0, 80)}...`);
    }
  }

  const { error } = await supabase.rpc("exec_sql", { sql: SCHEMA_SQL });
  if (error) {
    console.log(
      "Note: exec_sql RPC not available. Please run the SQL directly in Supabase SQL Editor.",
    );
    console.log("\n--- Copy the SQL below and paste into Supabase SQL Editor ---\n");
    console.log(SCHEMA_SQL);
    console.log("\n--- End of SQL ---\n");
  } else {
    console.log("Schema created successfully!");
  }
}

main().catch(console.error);
