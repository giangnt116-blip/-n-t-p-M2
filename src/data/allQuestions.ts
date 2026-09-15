import { Question } from "../types/question";
import { DIAGNOSTIC_QUESTIONS } from "./diagnostic";
import { PRACTICE_QUESTIONS } from "./practice";

export const PART_A_QUESTIONS: Question[] = DIAGNOSTIC_QUESTIONS.map((q) => ({
  ...q,
  part: "A" as const,
  status: "available" as const,
}));

export const PART_B_QUESTIONS: Question[] = PRACTICE_QUESTIONS;

export const ALL_MODULE0_QUESTIONS: Question[] = [
  ...PART_A_QUESTIONS,
  ...PART_B_QUESTIONS,
];

export function getQuestionById(id: string): Question | undefined {
  return ALL_MODULE0_QUESTIONS.find((q) => q.id.toLowerCase() === id.toLowerCase());
}

export function getNextQuestion(currentId: string): Question | undefined {
  const currentIndex = ALL_MODULE0_QUESTIONS.findIndex(
    (q) => q.id.toLowerCase() === currentId.toLowerCase()
  );
  if (currentIndex === -1 || currentIndex >= ALL_MODULE0_QUESTIONS.length - 1) {
    return undefined;
  }
  return ALL_MODULE0_QUESTIONS[currentIndex + 1];
}

export function getPrevQuestion(currentId: string): Question | undefined {
  const currentIndex = ALL_MODULE0_QUESTIONS.findIndex(
    (q) => q.id.toLowerCase() === currentId.toLowerCase()
  );
  if (currentIndex <= 0) {
    return undefined;
  }
  return ALL_MODULE0_QUESTIONS[currentIndex - 1];
}
