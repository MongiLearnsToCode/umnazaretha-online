'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { logAdminAction } from '@/lib/audit';
import { useUserStore } from '@/store/user-store';

interface Program {
  id: string;
  title: string;
  genre: string | null;
}

interface ScheduleConflict {
  id: string;
  program_title: string;
  start_time: string;
  end_time: string;
}

export default function SchedulePrograms() {
  const { user } = useUserStore();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState<string>('12:00');
  const [duration, setDuration] = useState<number>(60); // in minutes
  const [channel, setChannel] = useState<string>('main');
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [checkingConflicts, setCheckingConflicts] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('approval_status', 'approved')
        .order('title');

      if (error) {
        throw new Error(error.message);
      }

      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch programs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

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
        .select('id, program_id, start_time, end_time, programs (title)')
        .lt('start_time', endDateTime.toISOString())
        .gt('end_time', startDateTime.toISOString())
        .eq('channel', channel);

      if (error) {
        throw new Error(error.message);
      }

      const conflicts = data.map(item => ({
        id: item.id,
        program_title: (item.programs as { title: string } | null)?.title || 'Unknown Program',
        start_time: new Date(item.start_time).toLocaleTimeString(),
        end_time: new Date(item.end_time).toLocaleTimeString(),
      }));

      setConflicts(conflicts);

      if (conflicts.length > 0) {
        toast({
          title: 'Schedule Conflicts Detected',
          description: 'There are conflicts with existing schedules. Please adjust your timing.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'No Conflicts',
          description: 'No scheduling conflicts detected.',
        });
      }
    } catch (error) {
      console.error('Error checking conflicts:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to check for conflicts',
        variant: 'destructive',
      });
    } finally {
      setCheckingConflicts(false);
    }
  };

  const scheduleProgram = async () => {
    if (!user || !startDate || !selectedProgram) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (conflicts.length > 0) {
      toast({
        title: 'Conflicts Exist',
        description: 'Please resolve scheduling conflicts before proceeding.',
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
          scheduled_by: user.id,
        })
        .select();

      if (error) {
        throw new Error(error.message);
      }

      // Log the action
      await logAdminAction(
        'SCHEDULE_PROGRAM',
        'schedule',
        user.id,
        data[0].id,
        {
          program_id: selectedProgram,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          channel,
        }
      );

      toast({
        title: 'Program Scheduled',
        description: 'The program has been successfully scheduled.',
      });

      // Reset form
      setSelectedProgram('');
      setStartDate(new Date());
      setStartTime('12:00');
      setDuration(60);
      setConflicts([]);
    } catch (error) {
      console.error('Error scheduling program:', error);
      
      // Log the error
      if (user) {
        await logAdminAction(
          'SCHEDULE_PROGRAM_ERROR',
          'schedule',
          user.id,
          '',
          {
            error: error instanceof Error ? error.message : 'Unknown error',
            program_id: selectedProgram,
            start_time: startDate?.toISOString(),
            channel,
          }
        );
      }
      
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to schedule program',
        variant: 'destructive',
      });
    } finally {
      setScheduling(false);
    }
  };

  const selectedProgramData = programs.find(p => p.id === selectedProgram);

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Schedule Programs</h1>
          <p className="text-gray-500">Create and manage program schedules</p>
        </div>

        {loading ? (
          <p>Loading programs...</p>
        ) : (
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
                            {program.title}
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
                            variant={"outline"}
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
                      <Label htmlFor="time">Start Time *</Label>
                      <Input
                        id="time"
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
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main">Main Channel</SelectItem>
                          <SelectItem value="secondary">Secondary Channel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      className="w-full" 
                      onClick={checkConflicts}
                      disabled={checkingConflicts || scheduling || !selectedProgram || !startDate}
                    >
                      {checkingConflicts ? (
                        <>
                          <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                          Checking for conflicts...
                        </>
                      ) : (
                        <>
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Check for Conflicts
                        </>
                      )}
                    </Button>
                  </div>

                  {conflicts.length > 0 && (
                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <h3 className="font-semibold text-red-800">Schedule Conflicts Detected</h3>
                      <ul className="mt-2 space-y-1">
                        {conflicts.map((conflict) => (
                          <li key={conflict.id} className="text-sm text-red-700">
                            {conflict.program_title} - {conflict.start_time} to {conflict.end_time}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button 
                      className="w-full" 
                      onClick={scheduleProgram}
                      disabled={checkingConflicts || scheduling || conflicts.length > 0 || !selectedProgram || !startDate}
                    >
                      {scheduling ? 'Scheduling...' : 'Schedule Program'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
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
                        Genre: {selectedProgramData.genre?.replace(/_/, ' ') || 'N/A'}
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
        )}
      </div>
    </>
  );
}