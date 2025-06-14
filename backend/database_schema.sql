-- EuroLove Dating Platform Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'escort')),
    age INTEGER NOT NULL CHECK (age >= 18),
    bio TEXT,
    location VARCHAR(255),
    profile_image TEXT,
    credits INTEGER DEFAULT 0,
    earnings DECIMAL(10,2) DEFAULT 0.00,
    vip_status BOOLEAN DEFAULT FALSE,
    vip_expires_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gifts table
CREATE TABLE IF NOT EXISTS gifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    gift_type VARCHAR(50) NOT NULL CHECK (gift_type IN ('heart', 'rose', 'diamond', 'crown', 'luxury_car')),
    credits_cost INTEGER NOT NULL,
    money_value DECIMAL(10,2) NOT NULL,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reposts table
CREATE TABLE IF NOT EXISTS reposts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    likes INTEGER DEFAULT 0,
    earnings DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    stripe_session_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'EUR',
    status VARCHAR(50) NOT NULL,
    product_type VARCHAR(50) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reward_distributions table
CREATE TABLE IF NOT EXISTS reward_distributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reward_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    period VARCHAR(50) NOT NULL,
    distributed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leaderboards table
CREATE TABLE IF NOT EXISTS leaderboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    rank INTEGER NOT NULL,
    score DECIMAL(10,2) NOT NULL,
    period VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_vip_status ON profiles(vip_status);
CREATE INDEX IF NOT EXISTS idx_profiles_earnings ON profiles(earnings DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_credits ON profiles(credits DESC);
CREATE INDEX IF NOT EXISTS idx_gifts_sender_id ON gifts(sender_id);
CREATE INDEX IF NOT EXISTS idx_gifts_receiver_id ON gifts(receiver_id);
CREATE INDEX IF NOT EXISTS idx_gifts_created_at ON gifts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reposts_user_id ON reposts(user_id);
CREATE INDEX IF NOT EXISTS idx_reposts_created_at ON reposts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_category ON leaderboards(category);
CREATE INDEX IF NOT EXISTS idx_leaderboards_rank ON leaderboards(rank);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reposts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Gifts policies
CREATE POLICY "Users can view their own gifts" ON gifts
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send gifts" ON gifts
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Reposts policies
CREATE POLICY "All reposts are publicly viewable" ON reposts
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own reposts" ON reposts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reposts" ON reposts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reposts" ON reposts
    FOR DELETE USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payment transactions policies
CREATE POLICY "Users can view their own transactions" ON payment_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" ON payment_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reward distributions policies
CREATE POLICY "Users can view their own rewards" ON reward_distributions
    FOR SELECT USING (auth.uid() = user_id);

-- Leaderboards policies
CREATE POLICY "Leaderboards are publicly viewable" ON leaderboards
    FOR SELECT USING (true);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reposts_updated_at BEFORE UPDATE ON reposts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate leaderboard rankings
CREATE OR REPLACE FUNCTION calculate_client_leaderboard()
RETURNS TABLE (
    user_id UUID,
    full_name VARCHAR,
    role VARCHAR,
    total_spent DECIMAL,
    rank INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.full_name,
        p.role,
        COALESCE(SUM(g.money_value), 0) as total_spent,
        ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(g.money_value), 0) DESC)::INTEGER as rank
    FROM profiles p
    LEFT JOIN gifts g ON p.id = g.sender_id
    WHERE p.role = 'client'
    GROUP BY p.id, p.full_name, p.role
    ORDER BY total_spent DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate escort leaderboard
CREATE OR REPLACE FUNCTION calculate_escort_leaderboard()
RETURNS TABLE (
    user_id UUID,
    full_name VARCHAR,
    role VARCHAR,
    total_earned DECIMAL,
    rank INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.full_name,
        p.role,
        p.earnings,
        ROW_NUMBER() OVER (ORDER BY p.earnings DESC)::INTEGER as rank
    FROM profiles p
    WHERE p.role = 'escort'
    ORDER BY p.earnings DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing (optional)
INSERT INTO profiles (id, email, full_name, role, age, bio, location, credits, earnings, vip_status) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'client1@example.com', 'John Client', 'client', 25, 'Looking for companionship', 'Paris', 500, 0, false),
    ('550e8400-e29b-41d4-a716-446655440001', 'escort1@example.com', 'Maria Escort', 'escort', 28, 'Professional companion', 'Milan', 0, 150.50, true),
    ('550e8400-e29b-41d4-a716-446655440002', 'client2@example.com', 'Pierre Client', 'client', 35, 'Premium member', 'Rome', 1000, 0, true),
    ('550e8400-e29b-41d4-a716-446655440003', 'escort2@example.com', 'Sofia Escort', 'escort', 24, 'Elite companion', 'Barcelona', 0, 200.25, false)
ON CONFLICT (id) DO NOTHING;

-- Sample gifts data
INSERT INTO gifts (sender_id, receiver_id, gift_type, credits_cost, money_value, message) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'rose', 5, 0.05, 'Beautiful rose for you'),
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'luxury_car', 100, 1.00, 'Premium gift for premium service')
ON CONFLICT DO NOTHING;

-- Sample reposts data
INSERT INTO reposts (user_id, title, content, likes, earnings) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Paris Fashion Week', 'Amazing time at the fashion show!', 25, 15.75),
    ('550e8400-e29b-41d4-a716-446655440003', 'Barcelona Nights', 'The city never sleeps!', 18, 12.50)
ON CONFLICT DO NOTHING;

COMMIT;