'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface Program {
  id: string;
  title: string;
  genre: string;
}

interface ScheduleConflict {
  id: string;
  program_title: string;
  start_time: string;
  end_time: string;
}

export default function SchedulePrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState<string>('12:00');
  const [duration, setDuration] = useState<number>(60); // in minutes
  const [channel, setChannel] = useState<string>('main');
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [checkingConflicts, setCheckingConflicts] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    const { data, error } = await supabase
      .from('programs')
      .select('id, title, genre')
      .eq('approval_status', 'approved');

    if (error) {
      console.error('Error fetching programs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch programs',
        variant: 'destructive',
      });
    } else {
      setPrograms(data || []);
    }
  };

  const checkConflicts = async () => {
    if (!startDate || !selectedProgram) return;

    setCheckingConflicts(true);

    try {
      const startDateTime = new Date(startDate);
      const [hours, minutes] = startTime.split(':').map(Number);
      startDateTime.setHours(hours, minutes, 0, 0);

      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + duration);

      const { data, error } = await supabase
        .from('schedules')
        .select(`
          id,
          start_time,
          end_time,
          programs (title)
        `)
        .lt('start_time', endDateTime.toISOString())
        .gt('end_time', startDateTime.toISOString())
        .eq('channel', channel);

      if (error) {
        throw new Error(error.message);
      }

      setConflicts(data?.map(item => ({
        id: item.id,
        program_title: (item.programs as { title: string })?.title || 'Unknown Program',
        start_time: item.start_time,
        end_time: item.end_time,
      })) || []);
    } catch (error) {
      console.error('Error checking conflicts:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to check conflicts',
        variant: 'destructive',
      });
    } finally {
      setCheckingConflicts(false);
    }
  };

  const handleSchedule = async () => {
    if (!startDate || !selectedProgram) {
      toast({
        title: 'Missing Information',
        description: 'Please select a program and schedule date/time',
        variant: 'destructive',
      });
      return;
    }

    if (conflicts.length > 0) {
      toast({
        title: 'Scheduling Conflict',
        description: 'Please resolve scheduling conflicts before proceeding',
        variant: 'destructive',
      });
      return;
    }

    setScheduling(true);

    try {
      const startDateTime = new Date(startDate);
      const [hours, minutes] = startTime.split(':').map(Number);
      startDateTime.setHours(hours, minutes, 0, 0);

      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + duration);

      const { data, error } = await supabase
        .from('schedules')
        .insert({
          program_id: selectedProgram,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          channel,
        })
        .select();

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: 'Schedule Created',
        description: 'Program has been scheduled successfully',
      });

      // Reset form
      setSelectedProgram('');
      setStartDate(new Date());
      setStartTime('12:00');
      setDuration(60);
      setChannel('main');
      setConflicts([]);
    } catch (error) {
      console.error('Error scheduling program:', error);
      toast({
        title: 'Scheduling Failed',
        description: error instanceof Error ? error.message : 'Failed to schedule program',
        variant: 'destructive',
      });
    } finally {
      setScheduling(false);
    }
  };

  const selectedProgramData = programs.find(p => p.id === selectedProgram);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Schedule Programs</h1>
        <p className="text-gray-500">Create and manage program schedules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Schedule</CardTitle>
              <CardDescription>Schedule a program for broadcast</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="program">Program *</Label>
                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.title} ({program.genre.replace(/_/, ' ')})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="channel">Channel</Label>
                  <Select value={channel} onValueChange={setChannel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Channel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={checkConflicts}
                  disabled={!startDate || !selectedProgram || checkingConflicts}
                >
                  {checkingConflicts ? 'Checking...' : 'Check for Conflicts'}
                </Button>
              </div>

              {conflicts.length > 0 && (
                <div className="rounded-md border border-destructive bg-destructive/10 p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <h3 className="font-medium text-destructive">Scheduling Conflicts Detected</h3>
                  </div>
                  <div className="mt-2 space-y-2">
                    {conflicts.map((conflict) => (
                      <div key={conflict.id} className="text-sm">
                        <p className="font-medium">{conflict.program_title}</p>
                        <p className="text-muted-foreground">
                          {new Date(conflict.start_time).toLocaleString()} - {new Date(conflict.end_time).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button
                  onClick={handleSchedule}
                  disabled={!startDate || !selectedProgram || scheduling || conflicts.length > 0}
                  className="w-full"
                >
                  {scheduling ? 'Scheduling...' : 'Schedule Program'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Program Details</CardTitle>
              <CardDescription>Information about the selected program</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedProgramData ? (
                <div className="space-y-2">
                  <h3 className="font-semibold">{selectedProgramData.title}</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    Genre: {selectedProgramData.genre.replace(/_/, ' ')}
                  </p>
                  <div className="pt-4">
                    <Button variant="outline" className="w-full">
                      View Full Details
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Select a program to view details</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}