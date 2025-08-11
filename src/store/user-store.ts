import { create } from 'zustand';
import { User } from '@/types/user';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  language: string;
  setLanguage: (language: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  subscriptionStatus: string;
  setSubscriptionStatus: (status: string) => void;
  notificationSettings: Record<string, boolean>;
  setNotificationSettings: (settings: Record<string, boolean>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  language: 'en',
  setLanguage: (language) => set({ language }),
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  subscriptionStatus: 'inactive',
  setSubscriptionStatus: (status) => set({ subscriptionStatus: status }),
  notificationSettings: {
    programReminders: true,
    newEpisodes: true,
    scheduleChanges: true,
    specialEvents: true
  },
  setNotificationSettings: (settings) => set((state) => ({ 
    notificationSettings: { ...state.notificationSettings, ...settings } 
  })),
}));
