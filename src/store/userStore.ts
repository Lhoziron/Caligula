import { create } from 'zustand';

interface UserProfile {
  firstName: string;
  email: string;
}

interface UserState {
  profile: UserProfile;
  setProfile: (profile: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: {
    firstName: '',
    email: '',
  },
  setProfile: (newProfile) => set((state) => ({
    profile: { ...state.profile, ...newProfile }
  })),
}));