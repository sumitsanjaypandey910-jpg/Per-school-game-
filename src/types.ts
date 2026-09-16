export type GameMode = 'count' | 'build' | 'make10' | 'freeplay';

export type PrimaryColor = 'blue' | 'red' | 'yellow';

export interface CounterItem {
  color: PrimaryColor;
  id: string;
}

export interface Question {
  targetNumber: number; // 0 to 10
  currentCounters: (CounterItem | null)[]; // length 10
  missingNumber?: number; // for make10 mode
}

export interface GameStats {
  currentQuestionIndex: number; // 0 to 9 (display 1 to 10)
  totalQuestions: number; // 10
  score: number;
  streak: number;
  bestScore: number;
}
