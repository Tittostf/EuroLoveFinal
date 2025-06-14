-- Add more sample escort profiles for testing
INSERT INTO profiles (id, email, full_name, role, age, bio, location, credits, earnings, vip_status, profile_image) VALUES
    ('550e8400-e29b-41d4-a716-446655440010', 'sophia@eurolove.com', 'Sophia Milano', 'escort', 26, 'Elite companion from Milan. I speak Italian, English, and French. Available for dinner dates and social events.', 'Milan, Italy', 0, 125.75, true, 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'),
    
    ('550e8400-e29b-41d4-a716-446655440011', 'elena@eurolove.com', 'Elena Barcelona', 'escort', 24, 'Professional model and companion. Love art, wine, and intellectual conversations. VIP experiences only.', 'Barcelona, Spain', 0, 200.50, true, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'),
    
    ('550e8400-e29b-41d4-a716-446655440012', 'marie@eurolove.com', 'Marie Dubois', 'escort', 28, 'Parisian elegance meets modern sophistication. Perfect for business events and cultural experiences.', 'Paris, France', 0, 175.25, false, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face'),
    
    ('550e8400-e29b-41d4-a716-446655440013', 'anna@eurolove.com', 'Anna Vienna', 'escort', 25, 'Classical musician and companion. Love opera, fine dining, and romantic evenings. Speak German and English.', 'Vienna, Austria', 0, 150.00, false, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face'),
    
    ('550e8400-e29b-41d4-a716-446655440014', 'lucia@eurolove.com', 'Lucia Roma', 'escort', 27, 'Roman beauty with a passion for history and culture. Perfect guide for exploring the eternal city.', 'Rome, Italy', 0, 190.75, true, 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face'),
    
    ('550e8400-e29b-41d4-a716-446655440015', 'ingrid@eurolove.com', 'Ingrid Stockholm', 'escort', 23, 'Nordic beauty with a warm personality. Love winter sports, saunas, and cozy evenings by the fireplace.', 'Stockholm, Sweden', 0, 140.25, false, 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=face'),
    
    ('550e8400-e29b-41d4-a716-446655440016', 'katarina@eurolove.com', 'Katarina Prague', 'escort', 26, 'Czech elegance and charm. Architecture student who loves exploring historic cities and fine wine.', 'Prague, Czech Republic', 0, 165.50, false, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face'),
    
    ('550e8400-e29b-41d4-a716-446655440017', 'alexandra@eurolove.com', 'Alexandra Amsterdam', 'escort', 29, 'Sophisticated Dutch companion. Multilingual and well-traveled. Perfect for international business events.', 'Amsterdam, Netherlands', 0, 210.00, true, 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=400&h=400&fit=crop&crop=face')
ON CONFLICT (id) DO NOTHING;

-- Add some sample reposts
INSERT INTO reposts (user_id, title, content, likes, earnings, image_url) VALUES
    ('550e8400-e29b-41d4-a716-446655440010', 'Milan Fashion Week', 'Just finished an amazing photoshoot for Milan Fashion Week! The energy here is incredible ✨', 45, 22.50, 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop'),
    
    ('550e8400-e29b-41d4-a716-446655440011', 'Barcelona Sunset', 'Nothing beats a Barcelona sunset from Park Güell. This city never fails to inspire me 🌅', 62, 31.00, 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop'),
    
    ('550e8400-e29b-41d4-a716-446655440012', 'Louvre Evening', 'Private tour of the Louvre tonight. Art and culture feed the soul 🎨', 38, 19.00, 'https://images.unsplash.com/photo-1566992798386-df4aedeb6e8c?w=800&h=600&fit=crop'),
    
    ('550e8400-e29b-41d4-a716-446655440014', 'Roman Holiday', 'Exploring the hidden gems of Rome today. Every corner tells a story 🏛️', 51, 25.50, 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&h=600&fit=crop'),
    
    ('550e8400-e29b-41d4-a716-446655440017', 'Amsterdam Canals', 'Morning bike ride along the canals. Amsterdam is pure magic 🚲', 33, 16.50, 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=600&fit=crop')
ON CONFLICT DO NOTHING;

-- Add some gift transactions between users
INSERT INTO gifts (sender_id, receiver_id, gift_type, credits_cost, money_value, message) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', 'diamond', 10, 0.10, 'You look stunning in Milan! 💎'),
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440011', 'crown', 25, 0.25, 'For the queen of Barcelona 👑'),
    ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440012', 'rose', 5, 0.05, 'Beautiful like a Parisian rose 🌹'),
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', 'luxury_car', 100, 1.00, 'For an unforgettable Roman night 🚗'),
    ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440017', 'diamond', 10, 0.10, 'Amsterdam beauty deserves diamonds 💎')
ON CONFLICT DO NOTHING;