import { create } from 'zustand';
import { Program, Schedule } from '@/types/program';

interface GuideState {
  currentProgram: Program | null;
  setCurrentProgram: (program: Program | null) => void;
  upcomingPrograms: Program[];
  setUpcomingPrograms: (programs: Program[]) => void;
  schedule: Schedule[];
  setSchedule: (schedule: Schedule[]) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedGenre: string | null;
  setSelectedGenre: (genre: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useGuideStore = create<GuideState>((set) => ({
  currentProgram: null,
  setCurrentProgram: (program) => set({ currentProgram: program }),
  upcomingPrograms: [],
  setUpcomingPrograms: (programs) => set({ upcomingPrograms: programs }),
  schedule: [],
  setSchedule: (schedule) => set({ schedule }),
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
  selectedGenre: null,
  setSelectedGenre: (genre) => set({ selectedGenre: genre }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  error: null,
  setError: (error) => set({ error }),
}));