import { create } from 'zustand';

interface PlayerState {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentTime: number;
  setCurrentTime: (currentTime: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  isAudioOnly: boolean;
  setIsAudioOnly: (isAudioOnly: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
  playbackRate: number;
  setPlaybackRate: (playbackRate: number) => void;
  buffer: number;
  setBuffer: (buffer: number) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  quality: string;
  setQuality: (quality: string) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  currentTime: 0,
  setCurrentTime: (currentTime) => set({ currentTime }),
  duration: 0,
  setDuration: (duration) => set({ duration }),
  isAudioOnly: false,
  setIsAudioOnly: (isAudioOnly) => set({ isAudioOnly }),
  volume: 1,
  setVolume: (volume) => set({ volume }),
  isMuted: false,
  setIsMuted: (isMuted) => set({ isMuted }),
  playbackRate: 1,
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  buffer: 0,
  setBuffer: (buffer) => set({ buffer }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  error: null,
  setError: (error) => set({ error }),
  quality: 'auto',
  setQuality: (quality) => set({ quality }),
}));