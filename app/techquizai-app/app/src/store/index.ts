import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

interface QuizResult {
  score: number;
  totalQuestions: number;
  categoryId: string;
}

interface QuizState {
  currentQuiz: string | null;
  results: QuizResult[];
  addResult: (result: QuizResult) => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  currentQuiz: null,
  results: [],
  addResult: (result) => set((state) => ({ 
    results: [...state.results, result] 
  })),
}));
