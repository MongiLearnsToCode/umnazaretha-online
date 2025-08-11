import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScheduleItem {
  id: string;
  start_time: string;
  end_time: string;
  programs: {
    title: string;
    description: string;
    genre: string;
  } | null;
}

interface Genre {
  name: string;
}

const genreColors: { [key: string]: string } = {
  worship_services: 'bg-blue-100 border-blue-200',
  talk_shows: 'bg-green-100 border-green-200',
  youth_programs: 'bg-yellow-100 border-yellow-200',
  womens_shows: 'bg-pink-100 border-pink-200',
  mens_shows: 'bg-indigo-100 border-indigo-200',
  default: 'bg-gray-100 border-gray-200',
};

export function ProgramGuide() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      const { data, error } = await supabase.from('genres').select('name');
      if (error) console.error('Error fetching genres:', error);
      else setGenres(data as Genre[]);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      let query = supabase
        .from('schedules')
        .select(`id, start_time, end_time, programs (title, description, genre)`)
        .gt('end_time', now.toISOString())
        .order('start_time', { ascending: true })
        .limit(10);

      if (selectedGenre !== 'all') {
        query = query.eq('programs.genre', selectedGenre);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching schedule:', error);
      } else {
        setSchedule(data as ScheduleItem[]);
      }
      setLoading(false);
    };

    fetchSchedule();
  }, [now, selectedGenre]);

  const isLive = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return now >= start && now <= end;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Program Guide</h2>
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre.name} value={genre.name}>
                {genre.name.replace(/_/, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          schedule.map((item) => {
            const live = isLive(item.start_time, item.end_time);
            const genre = item.programs?.genre || 'default';
            const colorClass = genreColors[genre] || genreColors.default;

            return (
              <div key={item.id} className={`p-4 border rounded-lg ${colorClass}`}>
                <div className="flex justify-between items-center">
                  <p className="font-bold">{item.programs?.title}</p>
                  {live && <Badge variant="destructive">Live</Badge>}
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(item.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(item.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm mt-2">{item.programs?.description}</p>
                <p className="text-xs mt-2 capitalize">Genre: {item.programs?.genre.replace(/_/, ' ')}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}