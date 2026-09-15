export interface DiagnosticStorageState {
  studentName: string;
  diagnosticStartedAt: number | null;
  diagnosticProgress: Record<
    string,
    {
      answered: boolean;
      completed: boolean;
      selectedAnswer: string | number | string[] | null;
      isCorrect?: boolean;
    }
  >;
  answers: Record<string, string | number | string[]>;
  attemptCount: Record<string, number>;
  hintsUsed: Record<string, number[]>;
  timeSpent: Record<string, number>;
  completed: boolean;
  completedAt: number | null;
}

const STORAGE_KEY = "m2_logic_lab_diagnostic_v1";

const DEFAULT_STATE: DiagnosticStorageState = {
  studentName: "Học viên M2",
  diagnosticStartedAt: null,
  diagnosticProgress: {},
  answers: {},
  attemptCount: {},
  hintsUsed: {},
  timeSpent: {},
  completed: false,
  completedAt: null,
};

export function loadDiagnosticState(): DiagnosticStorageState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return {
      studentName: typeof parsed.studentName === "string" ? parsed.studentName : DEFAULT_STATE.studentName,
      diagnosticStartedAt: typeof parsed.diagnosticStartedAt === "number" ? parsed.diagnosticStartedAt : null,
      diagnosticProgress: parsed.diagnosticProgress || {},
      answers: parsed.answers || {},
      attemptCount: parsed.attemptCount || {},
      hintsUsed: parsed.hintsUsed || {},
      timeSpent: parsed.timeSpent || {},
      completed: Boolean(parsed.completed),
      completedAt: typeof parsed.completedAt === "number" ? parsed.completedAt : null,
    };
  } catch (err) {
    console.error("Error reading from localStorage:", err);
    return { ...DEFAULT_STATE };
  }
}

export function saveDiagnosticState(state: DiagnosticStorageState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Error writing to localStorage:", err);
  }
}

export function startDiagnosticSession(name?: string): DiagnosticStorageState {
  const current = loadDiagnosticState();
  const updated: DiagnosticStorageState = {
    ...current,
    studentName: name?.trim() || current.studentName || "Học viên M2",
    diagnosticStartedAt: current.diagnosticStartedAt || Date.now(),
  };
  saveDiagnosticState(updated);
  return updated;
}

export function saveQuestionAnswer(
  questionId: string,
  answer: string | number | string[],
  isCorrect: boolean
): DiagnosticStorageState {
  const current = loadDiagnosticState();
  const currentAttempts = current.attemptCount[questionId] || 0;
  
  const updated: DiagnosticStorageState = {
    ...current,
    answers: {
      ...current.answers,
      [questionId]: answer,
    },
    attemptCount: {
      ...current.attemptCount,
      [questionId]: currentAttempts + 1,
    },
    diagnosticProgress: {
      ...current.diagnosticProgress,
      [questionId]: {
        answered: true,
        completed: isCorrect,
        selectedAnswer: answer,
        isCorrect,
      },
    },
  };

  saveDiagnosticState(updated);
  return updated;
}

export function recordHintUsed(
  questionId: string,
  hintLevel: 1 | 2 | 3
): DiagnosticStorageState {
  const current = loadDiagnosticState();
  const questionHints = current.hintsUsed[questionId] || [];
  if (!questionHints.includes(hintLevel)) {
    const updated: DiagnosticStorageState = {
      ...current,
      hintsUsed: {
        ...current.hintsUsed,
        [questionId]: [...questionHints, hintLevel].sort((a, b) => a - b),
      },
    };
    saveDiagnosticState(updated);
    return updated;
  }
  return current;
}

export function recordTimeSpent(
  questionId: string,
  additionalSeconds: number
): DiagnosticStorageState {
  const current = loadDiagnosticState();
  const prevTime = current.timeSpent[questionId] || 0;
  const updated: DiagnosticStorageState = {
    ...current,
    timeSpent: {
      ...current.timeSpent,
      [questionId]: prevTime + additionalSeconds,
    },
  };
  saveDiagnosticState(updated);
  return updated;
}

export function markDiagnosticComplete(): DiagnosticStorageState {
  const current = loadDiagnosticState();
  const updated: DiagnosticStorageState = {
    ...current,
    completed: true,
    completedAt: Date.now(),
  };
  saveDiagnosticState(updated);
  return updated;
}

export function resetDiagnosticState(): DiagnosticStorageState {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Error clearing localStorage:", err);
  }
  return { ...DEFAULT_STATE };
}

/* ====================================================
   PHẦN B: PRACTICE / CỦNG CỐ STORAGE (D13 - D22)
   Lưu trữ độc lập, không ảnh hưởng Diagnostic Profile
   ==================================================== */

export interface PracticeStorageState {
  practiceProgress: Record<
    string,
    {
      answered: boolean;
      completed: boolean;
      selectedAnswer: string | number | string[] | null;
      isCorrect?: boolean;
    }
  >;
  answers: Record<string, string | number | string[]>;
  attemptCount: Record<string, number>;
  hintsUsed: Record<string, number[]>;
  timeSpent: Record<string, number>;
  completed: boolean;
  completedAt: number | null;
}

const PRACTICE_STORAGE_KEY = "m2_logic_lab_practice_v1";

const DEFAULT_PRACTICE_STATE: PracticeStorageState = {
  practiceProgress: {},
  answers: {},
  attemptCount: {},
  hintsUsed: {},
  timeSpent: {},
  completed: false,
  completedAt: null,
};

export function loadPracticeState(): PracticeStorageState {
  try {
    const raw = localStorage.getItem(PRACTICE_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PRACTICE_STATE };
    const parsed = JSON.parse(raw);
    return {
      practiceProgress: parsed.practiceProgress || {},
      answers: parsed.answers || {},
      attemptCount: parsed.attemptCount || {},
      hintsUsed: parsed.hintsUsed || {},
      timeSpent: parsed.timeSpent || {},
      completed: Boolean(parsed.completed),
      completedAt: typeof parsed.completedAt === "number" ? parsed.completedAt : null,
    };
  } catch (err) {
    console.error("Error reading practice localStorage:", err);
    return { ...DEFAULT_PRACTICE_STATE };
  }
}

export function savePracticeState(state: PracticeStorageState): void {
  try {
    localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Error writing practice localStorage:", err);
  }
}

export function savePracticeQuestionAnswer(
  questionId: string,
  answer: string | number | string[],
  isCorrect: boolean
): PracticeStorageState {
  const current = loadPracticeState();
  const currentAttempts = current.attemptCount[questionId] || 0;

  const updated: PracticeStorageState = {
    ...current,
    answers: {
      ...current.answers,
      [questionId]: answer,
    },
    attemptCount: {
      ...current.attemptCount,
      [questionId]: currentAttempts + 1,
    },
    practiceProgress: {
      ...current.practiceProgress,
      [questionId]: {
        answered: true,
        completed: isCorrect,
        selectedAnswer: answer,
        isCorrect,
      },
    },
  };

  savePracticeState(updated);
  return updated;
}

export function recordPracticeHintUsed(
  questionId: string,
  hintLevel: 1 | 2 | 3
): PracticeStorageState {
  const current = loadPracticeState();
  const questionHints = current.hintsUsed[questionId] || [];
  if (!questionHints.includes(hintLevel)) {
    const updated: PracticeStorageState = {
      ...current,
      hintsUsed: {
        ...current.hintsUsed,
        [questionId]: [...questionHints, hintLevel].sort((a, b) => a - b),
      },
    };
    savePracticeState(updated);
    return updated;
  }
  return current;
}

export function recordPracticeTimeSpent(
  questionId: string,
  additionalSeconds: number
): PracticeStorageState {
  const current = loadPracticeState();
  const prevTime = current.timeSpent[questionId] || 0;
  const updated: PracticeStorageState = {
    ...current,
    timeSpent: {
      ...current.timeSpent,
      [questionId]: prevTime + additionalSeconds,
    },
  };
  savePracticeState(updated);
  return updated;
}

export function isPartBQuestion(questionId: string): boolean {
  if (questionId.startsWith("D")) {
    const num = parseInt(questionId.slice(1), 10);
    return !isNaN(num) && num >= 13;
  }
  return false;
}

