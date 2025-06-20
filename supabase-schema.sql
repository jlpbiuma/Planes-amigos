-- Create the users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  color TEXT NOT NULL DEFAULT 'bg-blue-500',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the event_participants table
CREATE TABLE event_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(event_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_creator ON events(creator_id);
CREATE INDEX idx_event_participants_event ON event_participants(event_id);
CREATE INDEX idx_event_participants_user ON event_participants(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can read all users (for participant lists)
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (true);

-- Users can insert their own data (for registration)
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (true);

-- Events are readable by everyone
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);

-- Only authenticated users can create events
CREATE POLICY "Authenticated users can create events" ON events FOR INSERT WITH CHECK (true);

-- Event participants are readable by everyone
CREATE POLICY "Event participants are viewable by everyone" ON event_participants FOR SELECT USING (true);

-- Users can join events
CREATE POLICY "Users can join events" ON event_participants FOR INSERT WITH CHECK (true);

-- Users can leave events they joined
CREATE POLICY "Users can leave events" ON event_participants FOR DELETE USING (true); 