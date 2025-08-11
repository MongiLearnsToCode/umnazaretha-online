export interface Program {
  id: string;
  title: string;
  description: string | null;
  duration: number | null;
  thumbnail_url: string | null;
  video_id: string | null;
  language: string | null;
  genre: string | null;
  target_demographic: string | null;
  episode_number: number | null;
  season_number: number | null;
  series_id: string | null;
  production_date: string | null;
  approval_status: string | null;
  approval_notes: string | null;
  created_at: string;
  hosts?: string[]; // For simplicity, we're using string array instead of full host objects
}

export interface Schedule {
  id: string;
  program_id: string;
  start_time: string;
  end_time: string;
  channel: string | null;
  created_by: string | null;
  programming_block: string | null;
  created_at: string;
  program?: Program; // Optional program details
}

export interface Series {
  id: string;
  series_name: string;
  description: string | null;
  genre: string | null;
  target_demographic: string | null;
  total_episodes: number | null;
  status: string | null;
  created_at: string;
}

export interface Genre {
  id: string;
  name: string;
  description: string | null;
}

export interface Host {
  id: string;
  host_name: string;
  bio: string | null;
  photo_url: string | null;
  contact_info: string | null;
  approval_status: string | null;
  created_at: string;
}