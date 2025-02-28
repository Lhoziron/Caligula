import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  password: string;
  avatarUrl?: string;
  avatarId?: string;
}

interface AuthState {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  register: (user: Omit<User, 'id'>) => { success: boolean; error?: string };
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      isAuthenticated: false,

      login: (email, password) => {
        const user = get().users.find(u => u.email === email && u.password === password);
        
        if (!user) {
          return {
            success: false,
            error: 'Email ou mot de passe incorrect. Si vous n\'avez pas de compte, veuillez vous inscrire.'
          };
        }

        set({ currentUser: user, isAuthenticated: true });
        return { success: true };
      },

      logout: () => set({ currentUser: null, isAuthenticated: false }),

      register: (userData) => {
        const users = get().users;
        
        if (users.some(user => user.email === userData.email)) {
          return {
            success: false,
            error: 'Un compte existe déjà avec cet email'
          };
        }

        const newUser = {
          ...userData,
          id: Date.now().toString(),
          avatarUrl: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Felix&backgroundColor=b6e3f4',
          avatarId: 'avatar1'
        };

        set(state => ({
          users: [...state.users, newUser],
          currentUser: newUser,
          isAuthenticated: true
        }));

        return { success: true };
      },

      updateProfile: (updates) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        const updatedUser = { ...currentUser, ...updates };
        
        set(state => ({
          currentUser: updatedUser,
          users: state.users.map(user => 
            user.id === currentUser.id ? updatedUser : user
          )
        }));
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
