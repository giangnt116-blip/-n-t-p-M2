export type AnswerType = "number" | "text" | "single-choice" | "multiple-choice";

export type DifficultyLevel = 1 | 2 | 3;

export type QuestionMode = "challenge" | "learn";

export interface QuestionChoice {
  id: string;
  label: string;
}

export interface QuestionHint {
  level: 1 | 2 | 3;
  text: string;
}

export interface QuestionSimulation {
  type: string;
  name?: string;
  config?: Record<string, unknown>;
}

export type Simulation = QuestionSimulation;

export interface Question {
  id: string;
  title: string;
  order: number;
  difficulty: DifficultyLevel;
  skills: string[];

  problem: {
    text: string;
    subtext?: string;
    answerType: AnswerType;
    choices?: string[] | QuestionChoice[];
    unit?: string;
    placeholder?: string;
  };

  answer: {
    value: string | number | string[];
    displayValue?: string;
  };

  hints: QuestionHint[];

  simulation?: QuestionSimulation;

  teachingPoint: string;

  explanation: string[];
}

export interface StudentAnswer {
  questionId: string;
  value: string | number | string[];
  isCorrect: boolean;
  attempts: number;
  submittedAt: number;
}
