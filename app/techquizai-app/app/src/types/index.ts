export interface Category {
  id: string;
  title: string;
  color: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
}

export interface QuizResult {
  categoryId: string;
  score: number;
  totalQuestions: number;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
