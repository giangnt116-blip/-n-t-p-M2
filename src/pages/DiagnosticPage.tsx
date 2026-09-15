import React, { useState, useEffect, useRef } from "react";
import { ALL_MODULE0_QUESTIONS, getQuestionById } from "../data/allQuestions";
import { ProgressBar } from "../components/question/ProgressBar";
import { QuestionRenderer } from "../components/question/QuestionRenderer";
import {
  loadDiagnosticState,
  saveQuestionAnswer,
  recordHintUsed,
  recordTimeSpent,
  markDiagnosticComplete,
  DiagnosticStorageState,
  loadPracticeState,
  savePracticeQuestionAnswer,
  recordPracticeHintUsed,
  recordPracticeTimeSpent,
  isPartBQuestion,
  PracticeStorageState,
} from "../utils/storage";
import { Sparkles, ArrowRight, Lock, BookOpen } from "lucide-react";

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
  const [practiceState, setPracticeState] = useState<PracticeStorageState>(loadPracticeState());

  // Find question or fallback
  const validQuestion = getQuestionById(currentQuestionId) || ALL_MODULE0_QUESTIONS[0];
  const activeIndex = ALL_MODULE0_QUESTIONS.findIndex(
    (q) => q.id.toLowerCase() === validQuestion.id.toLowerCase()
  );
  const currentQuestion = validQuestion;
  const isPartB = isPartBQuestion(currentQuestion.id);

  // Timer tracking per question
  const timeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Reset timer on question change and commit previous elapsed time
    const elapsedSec = Math.round((Date.now() - timeRef.current) / 1000);
    if (elapsedSec > 1 && elapsedSec < 1800) {
      if (isPartB) {
        recordPracticeTimeSpent(currentQuestion.id, elapsedSec);
      } else {
        recordTimeSpent(currentQuestion.id, elapsedSec);
      }
    }
    timeRef.current = Date.now();

    // Reload latest states
    setStorageState(loadDiagnosticState());
    setPracticeState(loadPracticeState());

    const interval = setInterval(() => {
      if (isPartB) {
        recordPracticeTimeSpent(currentQuestion.id, 10);
      } else {
        recordTimeSpent(currentQuestion.id, 10);
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      const remainingSec = Math.round((Date.now() - timeRef.current) / 1000);
      if (remainingSec > 1 && remainingSec < 1800) {
        if (isPartB) {
          recordPracticeTimeSpent(currentQuestion.id, remainingSec);
        } else {
          recordTimeSpent(currentQuestion.id, remainingSec);
        }
      }
    };
  }, [currentQuestion.id, isPartB]);

  // Handlers
  const handleUnlockHint = (level: 1 | 2 | 3) => {
    if (isPartB) {
      const updated = recordPracticeHintUsed(currentQuestion.id, level);
      setPracticeState(updated);
    } else {
      const updated = recordHintUsed(currentQuestion.id, level);
      setStorageState(updated);
    }
  };

  const handleSubmitAnswer = (value: string | number | string[], isCorrect: boolean) => {
    if (isPartB) {
      const updated = savePracticeQuestionAnswer(currentQuestion.id, value, isCorrect);
      setPracticeState(updated);
    } else {
      const updated = saveQuestionAnswer(currentQuestion.id, value, isCorrect);
      setStorageState(updated);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      const prevQ = ALL_MODULE0_QUESTIONS[activeIndex - 1];
      onSelectQuestion(prevQ.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    // If currently at D12 (end of Part A)
    if (currentQuestion.id === "D12") {
      // Mark diagnostic Part A complete
      markDiagnosticComplete();
      // Flow directly to D13 (Beginning of Part B)
      onSelectQuestion("D13");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // If currently at D22 (end of Part B questions)
    if (currentQuestion.id === "D22") {
      // Go to completion screen /result
      onNavigate("/result");
      return;
    }

    if (activeIndex < ALL_MODULE0_QUESTIONS.length - 1) {
      const nextQ = ALL_MODULE0_QUESTIONS[activeIndex + 1];
      onSelectQuestion(nextQ.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onFinishDiagnostic();
    }
  };

  const currentAnswer = isPartB
    ? practiceState.answers[currentQuestion.id]
    : storageState.answers[currentQuestion.id];

  const unlockedHints = isPartB
    ? practiceState.hintsUsed[currentQuestion.id] || []
    : storageState.hintsUsed[currentQuestion.id] || [];

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-6 px-4 sm:px-6">
      {/* 1. PROGRESS BAR & NAV PILLS */}
      <ProgressBar
        questions={ALL_MODULE0_QUESTIONS}
        currentQuestionId={currentQuestion.id}
        onSelectQuestion={(qId) => {
          onSelectQuestion(qId);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        storageState={storageState}
        practiceState={practiceState}
      />

      {/* Special transition banner when on D12 */}
      {currentQuestion.id === "D12" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-indigo-900 font-semibold">
            <Sparkles className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>
              Đây là thử thách cuối cùng của <strong>Phần A (Khởi động)</strong>. Sau khi nộp bài, em sẽ bước vào <strong>Phần B (Củng cố)</strong>!
            </span>
          </div>
          <button
            onClick={() => onNavigate("/result")}
            className="rounded-lg border border-indigo-300 bg-white px-3 py-1.5 font-bold text-indigo-700 shadow-2xs hover:bg-indigo-50 transition"
          >
            Xem hồ sơ năng lực Phần A →
          </button>
        </div>
      )}

      {/* 2. QUESTION ENGINE RENDERER (or Coming Soon Card) */}
      {currentQuestion.status === "coming_soon" ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center shadow-xs space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Lock className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              SẮP MỞ
            </span>
            <h3 className="text-xl font-black text-slate-800 pt-2">
              {currentQuestion.id}: {currentQuestion.title}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {currentQuestion.problem.text}
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onSelectQuestion("D13")}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
            >
              Luyện bài D13 (Đĩa táo)
            </button>
            <button
              onClick={() => onSelectQuestion("D14")}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Luyện bài D14 (Cơ số 3)
            </button>
            <button
              onClick={() => onSelectQuestion("D15")}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Luyện bài D15 (Lập phương)
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-4 sm:p-7 shadow-xs">
          <QuestionRenderer
            question={currentQuestion}
            totalQuestions={ALL_MODULE0_QUESTIONS.length}
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
      )}
    </div>
  );
};
