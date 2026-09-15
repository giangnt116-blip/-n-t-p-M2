import { Question } from "../types/question";

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents for lenient fallback
    .replace(/\s+/g, "");
}

export function evaluateAnswer(
  question: Question,
  rawUserAnswer: string | number | string[] | null | undefined
): boolean {
  if (rawUserAnswer === null || rawUserAnswer === undefined || rawUserAnswer === "") {
    return false;
  }

  const expected = question.answer.value;

  // Handle numbers
  if (question.problem.answerType === "number") {
    const numExpected = Number(expected);
    const numUser = Number(String(rawUserAnswer).replace(/,/g, ".").trim());
    if (isNaN(numUser)) return false;
    return Math.abs(numExpected - numUser) < 0.0001;
  }

  // Handle single choice
  if (question.problem.answerType === "single-choice") {
    const userStr = String(rawUserAnswer).trim().toLowerCase();
    const expStr = String(expected).trim().toLowerCase();

    if (userStr === expStr) return true;

    // Special case for yes/có
    if (expStr === "có" || expStr === "yes") {
      return (
        userStr === "có" ||
        userStr === "co" ||
        userStr === "yes" ||
        userStr === "y" ||
        userStr === "đúng" ||
        userStr === "dung"
      );
    }

    // Compare with choice ID or prefix
    if (userStr === expStr) return true;
    return normalizeText(userStr) === normalizeText(expStr);
  }

  // Handle text
  if (question.problem.answerType === "text") {
    const userStr = String(rawUserAnswer).trim();
    const expStr = String(expected).trim();

    // Direct match ignoring whitespace and case
    if (userStr.toLowerCase() === expStr.toLowerCase()) return true;

    // Remove whitespace and compare (e.g. "3, 3" vs "3,3")
    const cleanUser = userStr.replace(/\s+/g, "").toLowerCase();
    const cleanExp = expStr.replace(/\s+/g, "").toLowerCase();
    if (cleanUser === cleanExp) return true;

    // For D04: "3 đoạn, 3 cách" or "3,3" or "3-3" or "3;3"
    if (question.id === "D04") {
      const numbers = userStr.match(/\d+/g);
      if (numbers && numbers.length >= 2 && numbers[0] === "3" && numbers[1] === "3") {
        return true;
      }
    }

    return normalizeText(userStr) === normalizeText(expStr);
  }

  // Fallback
  return String(rawUserAnswer).trim() === String(expected).trim();
}
