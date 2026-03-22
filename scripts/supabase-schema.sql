-- DialGlobal Supabase Schema
-- Run this in your Supabase SQL Editor (supabase.com → SQL Editor → New Query)

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

-- User push tokens table
CREATE TABLE IF NOT EXISTS user_push_tokens (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  ios_voip_token TEXT,
  android_fcm_token TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_push_tokens ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own
DROP POLICY IF EXISTS profiles_select_own ON profiles;
CREATE POLICY profiles_select_own ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS profiles_update_own ON profiles;
CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS profiles_insert_own ON profiles;
CREATE POLICY profiles_insert_own ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Virtual numbers: users can CRUD their own
DROP POLICY IF EXISTS numbers_select_own ON virtual_numbers;
CREATE POLICY numbers_select_own ON virtual_numbers FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS numbers_insert_own ON virtual_numbers;
CREATE POLICY numbers_insert_own ON virtual_numbers FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS numbers_delete_own ON virtual_numbers;
CREATE POLICY numbers_delete_own ON virtual_numbers FOR DELETE USING (auth.uid() = user_id);

-- Messages: users can CRUD their own
DROP POLICY IF EXISTS messages_select_own ON messages;
CREATE POLICY messages_select_own ON messages FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS messages_insert_own ON messages;
CREATE POLICY messages_insert_own ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Calls: users can read their own
DROP POLICY IF EXISTS calls_select_own ON calls;
CREATE POLICY calls_select_own ON calls FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS calls_insert_own ON calls;
CREATE POLICY calls_insert_own ON calls FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Push tokens: users can read and upsert their own row
DROP POLICY IF EXISTS push_tokens_select_own ON user_push_tokens;
CREATE POLICY push_tokens_select_own ON user_push_tokens FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS push_tokens_insert_own ON user_push_tokens;
CREATE POLICY push_tokens_insert_own ON user_push_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS push_tokens_update_own ON user_push_tokens;
CREATE POLICY push_tokens_update_own ON user_push_tokens FOR UPDATE USING (auth.uid() = user_id);

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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_virtual_numbers_user ON virtual_numbers(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_number ON messages(number_id);
CREATE INDEX IF NOT EXISTS idx_calls_user ON calls(user_id);
CREATE INDEX IF NOT EXISTS idx_calls_number ON calls(number_id);
CREATE INDEX IF NOT EXISTS idx_user_push_tokens_updated_at ON user_push_tokens(updated_at);
