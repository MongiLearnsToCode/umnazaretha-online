import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

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

export function ComingUpNext() {
  const [nextProgram, setNextProgram] = useState<ScheduleItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNextProgram = async () => {
      const now = new Date();
      const { data, error } = await supabase
        .from('schedules')
        .select(`
          id,
          start_time,
          end_time,
          programs (
            title,
            description,
            genre
          )
        `)
        .gt('start_time', now.toISOString()) // Get programs starting after now
        .order('start_time', { ascending: true })
        .limit(1);

      if (error) {
        console.error('Error fetching next program:', error);
      } else if (data && data.length > 0) {
        setNextProgram(data[0] as ScheduleItem);
      }
      setLoading(false);
    };

    fetchNextProgram();
  }, []);

  if (loading) {
    return <div>Loading next program...</div>;
  }

  if (!nextProgram) {
    return <div>No upcoming programs.</div>;
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Coming Up Next:</h3>
      <p className="font-bold">{nextProgram.programs?.title}</p>
      <p className="text-sm text-gray-600">
        {new Date(nextProgram.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(nextProgram.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
      <p className="text-sm mt-2">{nextProgram.programs?.description}</p>
      <p className="text-xs mt-2 capitalize">Genre: {nextProgram.programs?.genre?.replace(/_/, ' ')}</p>
    </div>
  );
}
