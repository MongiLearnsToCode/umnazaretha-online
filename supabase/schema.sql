CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscription_status TEXT DEFAULT 'inactive',
  language_preference TEXT DEFAULT 'en',
  role TEXT DEFAULT 'subscriber',
  viewing_preferences JSONB,
  notification_settings JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

-- Populate genres
INSERT INTO genres (name) VALUES
('worship_services'),
('talk_shows'),
('youth_programs'),
('womens_shows'),
('mens_shows'),
('magazine_shows'),
('community_events'),
('special_programming');

CREATE TABLE hosts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_name TEXT NOT NULL,
    bio TEXT,
    photo_url TEXT,
    contact_info TEXT,
    approval_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_name TEXT NOT NULL,
  description TEXT,
  genre TEXT REFERENCES genres(name),
  target_demographic TEXT,
  total_episodes INT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration INT, -- in seconds
  thumbnail_url TEXT,
  video_id TEXT, -- Cloudflare Stream ID
  language TEXT,
  genre TEXT REFERENCES genres(name),
  target_demographic TEXT,
  episode_number INT,
  season_number INT,
  series_id UUID REFERENCES series(id),
  production_date DATE,
  approval_status TEXT DEFAULT 'pending',
  approval_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE program_hosts (
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  host_id UUID REFERENCES hosts(id) ON DELETE CASCADE,
  PRIMARY KEY (program_id, host_id)
);

CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  channel TEXT DEFAULT 'main',
  created_by UUID REFERENCES users(id),
  programming_block TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_schedule UNIQUE (start_time, end_time, channel)
);

CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL, -- Can refer to program, host, etc.
    content_type TEXT NOT NULL, -- 'program', 'host', etc.
    approver_id UUID REFERENCES users(id),
    approval_level TEXT,
    status TEXT, -- 'approved', 'rejected', 'pending'
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_viewing_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    program_id UUID REFERENCES programs(id),
    watch_duration INT, -- in seconds
    completion_rate FLOAT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    user_id UUID REFERENCES users(id),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);
