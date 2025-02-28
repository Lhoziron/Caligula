import { create } from 'zustand';

type QuizAnswers = {
  [key: number]: string;
};

interface QuizState {
  answers: QuizAnswers;
  setAnswer: (questionId: number, answer: string) => void;
  resetAnswers: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  answers: {},
  setAnswer: (questionId, answer) => 
    set((state) => ({ answers: { ...state.answers, [questionId]: answer } })),
  resetAnswers: () => set({ answers: {} }),
}));