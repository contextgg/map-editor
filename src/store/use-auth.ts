import { create } from 'zustand';
import { login as oidcLogin, logout as oidcLogout, getUser, isLoggedIn, type AuthUser } from '../lib/auth';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialize: () => void;
  login: () => void;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialize: () => {
    if (isLoggedIn()) {
      const user = getUser();
      set({ user, loading: false });
    } else {
      set({ user: null, loading: false });
    }
  },
  login: () => {
    oidcLogin();
  },
  logout: async () => {
    await oidcLogout();
    set({ user: null });
  },
}));
