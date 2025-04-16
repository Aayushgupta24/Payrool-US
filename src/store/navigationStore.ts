import { create } from 'zustand';

type NavigationIntent = {
  page: string;
  action?: string;
  payload?: any;
};

interface NavigationStore {
  intent: NavigationIntent | null;
  setIntent: (intent: NavigationIntent | null) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  intent: null,
  setIntent: (intent) => set({ intent }),
}));


