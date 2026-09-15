export type AnswerType = "number" | "text" | "single-choice" | "multiple-choice";

export type DifficultyLevel = 1 | 2 | 3;

export type QuestionMode = "challenge" | "learn";

export interface QuestionChoice {
  id: string;
  label: string;
}

export interface QuestionHint {
  level: 1 | 2 | 3;
  text?: string;
  content?: string;
  title?: string;
  cost?: string;
}

export interface QuestionSimulation {
  type: string;
  name?: string;
  config?: Record<string, any>;
}

export type Simulation = QuestionSimulation;

export interface Question {
  id: string;
  title: string;
  order: number;
  part?: "A" | "B";
  status?: "available" | "coming_soon";
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
    type?: string;
    unit?: string;
    tolerance?: number;
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
