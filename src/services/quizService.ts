import { QuizAnswers } from '../store/quizStore';

export interface QuizQuestion {
  id: number;
  text: string;
  icon: string;
  options: string[];
  multiSelect?: boolean;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 2,
    text: "Nombre de participants ?",
    icon: "👥",
    options: ["Seul(e)", "En duo", "Petit groupe (3-5)", "Grand groupe (6+)"]
  },
  {
    id: 3,
    text: "Type de relation ?",
    icon: "💝",
    options: ["Famille", "Amis", "Couple", "Collègues", "Avec enfants"]
  },
  {
    id: 4,
    text: "Ambiance recherchée ?",
    icon: "✨",
    options: ["Détente", "Fun et énergique", "Sportif", "Culturel", "Nature"]
  },
  {
    id: 5,
    text: "Budget ?",
    icon: "💰",
    options: ["Gratuit", "< 25€", "25-50€", "50-100€", "Peu importe"]
  },
  {
    id: 6,
    text: "Préférences spécifiques ?",
    icon: "🎯",
    options: [
      "Intérieur",
      "Extérieur",
      "Jour",
      "Soirée",
      "Activité physique",
      "Ludique",
      "Créatif",
      "Nature"
    ],
    multiSelect: true
  }
];

export function getInitialQuestions(): QuizQuestion[] {
  return QUIZ_QUESTIONS;
}

export function getQuestionById(id: number): QuizQuestion | undefined {
  return QUIZ_QUESTIONS.find(q => q.id === id);
}