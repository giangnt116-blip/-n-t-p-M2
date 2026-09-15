import React, { useState, useEffect, useRef } from "react";
import { DIAGNOSTIC_QUESTIONS } from "../data/diagnostic";
import { ProgressBar } from "../components/question/ProgressBar";
import { QuestionRenderer } from "../components/question/QuestionRenderer";
import {
  loadDiagnosticState,
  saveQuestionAnswer,
  recordHintUsed,
  recordTimeSpent,
  markDiagnosticComplete,
  DiagnosticStorageState,
} from "../utils/storage";

interface DiagnosticPageProps {
  currentQuestionId: string;
  onSelectQuestion: (questionId: string) => void;
  onFinishDiagnostic: () => void;
  onNavigate: (path: string) => void;
}

export const DiagnosticPage: React.FC<DiagnosticPageProps> = ({
  currentQuestionId,
  onSelectQuestion,
  onFinishDiagnostic,
  onNavigate,
}) => {
  const [storageState, setStorageState] = useState<DiagnosticStorageState>(loadDiagnosticState());

  // Find question or fallback to first
  const currentQIndex = DIAGNOSTIC_QUESTIONS.findIndex(
    (q) => q.id === currentQuestionId
  );
  const activeIndex = currentQIndex >= 0 ? currentQIndex : 0;
  const currentQuestion = DIAGNOSTIC_QUESTIONS[activeIndex];

  // Timer tracking per question
  const timeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Reset timer on question change and commit previous elapsed time
    const elapsedSec = Math.round((Date.now() - timeRef.current) / 1000);
    if (elapsedSec > 1 && elapsedSec < 1800) {
      recordTimeSpent(currentQuestion.id, elapsedSec);
    }
    timeRef.current = Date.now();

    // Reload latest state
    setStorageState(loadDiagnosticState());

    const interval = setInterval(() => {
      // Periodic save of elapsed time (every 10 seconds)
      recordTimeSpent(currentQuestion.id, 10);
    }, 10000);

    return () => {
      clearInterval(interval);
      const remainingSec = Math.round((Date.now() - timeRef.current) / 1000);
      if (remainingSec > 1 && remainingSec < 1800) {
        recordTimeSpent(currentQuestion.id, remainingSec);
      }
    };
  }, [currentQuestion.id]);

  // Handlers
  const handleUnlockHint = (level: 1 | 2 | 3) => {
    const updated = recordHintUsed(currentQuestion.id, level);
    setStorageState(updated);
  };

  const handleSubmitAnswer = (value: string | number | string[], isCorrect: boolean) => {
    const updated = saveQuestionAnswer(currentQuestion.id, value, isCorrect);
    setStorageState(updated);
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      const prevQ = DIAGNOSTIC_QUESTIONS[activeIndex - 1];
      onSelectQuestion(prevQ.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (activeIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      const nextQ = DIAGNOSTIC_QUESTIONS[activeIndex + 1];
      onSelectQuestion(nextQ.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Finish diagnostic
      markDiagnosticComplete();
      onFinishDiagnostic();
    }
  };

  const currentAnswer = storageState.answers[currentQuestion.id];
  const unlockedHints = storageState.hintsUsed[currentQuestion.id] || [];

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-6 px-4 sm:px-6">
      {/* 1. PROGRESS BAR & NAV PILLS */}
      <ProgressBar
        questions={DIAGNOSTIC_QUESTIONS}
        currentQuestionId={currentQuestion.id}
        onSelectQuestion={(qId) => {
          onSelectQuestion(qId);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        storageState={storageState}
      />

      {/* 2. QUESTION ENGINE RENDERER (Challenge mode) */}
      <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-4 sm:p-7 shadow-xs">
        <QuestionRenderer
          question={currentQuestion}
          totalQuestions={DIAGNOSTIC_QUESTIONS.length}
          mode="challenge"
          userAnswer={currentAnswer}
          unlockedHints={unlockedHints}
          onUnlockHint={handleUnlockHint}
          onSubmitAnswer={handleSubmitAnswer}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={activeIndex > 0}
          hasNext={true}
        />
      </div>
    </div>
  );
};
