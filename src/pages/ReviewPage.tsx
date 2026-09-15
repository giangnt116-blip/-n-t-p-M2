import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Filter,
} from "lucide-react";
import { DIAGNOSTIC_QUESTIONS } from "../data/diagnostic";
import { Question } from "../types/question";
import { QuestionRenderer } from "../components/question/QuestionRenderer";
import { evaluateAnswer } from "../utils/scoring";
import {
  loadDiagnosticState,
  saveQuestionAnswer,
  recordHintUsed,
  DiagnosticStorageState,
} from "../utils/storage";

interface ReviewPageProps {
  onNavigate: (path: string) => void;
}

export const ReviewPage: React.FC<ReviewPageProps> = ({ onNavigate }) => {
  const [storageState, setStorageState] = useState<DiagnosticStorageState>(loadDiagnosticState());
  const [activeQuestionId, setActiveQuestionId] = useState<string>(DIAGNOSTIC_QUESTIONS[0].id);
  const [filterMode, setFilterMode] = useState<"all" | "correct" | "needsReview">("all");

  const activeQuestionIndex = DIAGNOSTIC_QUESTIONS.findIndex((q) => q.id === activeQuestionId);
  const currentQuestion = DIAGNOSTIC_QUESTIONS[activeQuestionIndex >= 0 ? activeQuestionIndex : 0];

  const handleUnlockHint = (level: 1 | 2 | 3) => {
    const updated = recordHintUsed(currentQuestion.id, level);
    setStorageState(updated);
  };

  const handleSubmitAnswer = (value: string | number | string[], isCorrect: boolean) => {
    const updated = saveQuestionAnswer(currentQuestion.id, value, isCorrect);
    setStorageState(updated);
  };

  const handleRetry = () => {
    // Reset answer for this question
    const updated: DiagnosticStorageState = {
      ...storageState,
      answers: {
        ...storageState.answers,
        [currentQuestion.id]: "",
      },
      diagnosticProgress: {
        ...storageState.diagnosticProgress,
        [currentQuestion.id]: {
          answered: false,
          completed: false,
          selectedAnswer: "",
          isCorrect: false,
        },
      },
    };
    setStorageState(updated);
  };

  const handlePrev = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionId(DIAGNOSTIC_QUESTIONS[activeQuestionIndex - 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (activeQuestionIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setActiveQuestionId(DIAGNOSTIC_QUESTIONS[activeQuestionIndex + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const questionsWithStatus = DIAGNOSTIC_QUESTIONS.map((q) => {
    const userAns = storageState.answers[q.id];
    const isAnswered = userAns !== undefined && userAns !== null && userAns !== "";
    const isCorrect = evaluateAnswer(q, userAns);
    return {
      question: q,
      isAnswered,
      isCorrect,
      userAns,
    };
  });

  const filteredQuestions = questionsWithStatus.filter((item) => {
    if (filterMode === "correct") return item.isCorrect;
    if (filterMode === "needsReview") return !item.isCorrect;
    return true;
  });

  const correctCount = questionsWithStatus.filter((q) => q.isCorrect).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
              GIAI ĐOẠN 1 • XEM LẠI & LUYỆN
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 sm:text-3xl mt-1">
            Xem lại & Luyện 12 thử thách ôn tập đầu vào
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Đọc kỹ teaching point và từng bước tư duy để rút ra bài học cho các tuần tiếp theo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("/result")}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-95 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Xem lại kết quả tổng quát</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar (12 questions list) + Content (QuestionRenderer in Learn Mode) */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* SIDEBAR: QUESTION LIST WITH STATUS */}
        <div className="lg:col-span-4 space-y-3">
          {/* Filter tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            <button
              onClick={() => setFilterMode("all")}
              className={`flex-1 rounded-lg py-1.5 transition ${
                filterMode === "all" ? "bg-white text-indigo-700 shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Tất cả (12)
            </button>
            <button
              onClick={() => setFilterMode("correct")}
              className={`flex-1 rounded-lg py-1.5 transition ${
                filterMode === "correct" ? "bg-white text-emerald-700 shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              ✅ Đúng ({correctCount})
            </button>
            <button
              onClick={() => setFilterMode("needsReview")}
              className={`flex-1 rounded-lg py-1.5 transition ${
                filterMode === "needsReview" ? "bg-white text-rose-700 shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              ❌ Cần xem ({12 - correctCount})
            </button>
          </div>

          {/* List items */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredQuestions.map(({ question: q, isCorrect, isAnswered }) => {
              const isSelected = q.id === activeQuestionId;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setActiveQuestionId(q.id);
                    window.scrollTo({ top: 120, behavior: "smooth" });
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/90 shadow-xs ring-2 ring-indigo-200"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {q.order}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-900">
                        {q.title}
                      </p>
                      <p className="text-[10px] text-slate-500 capitalize">
                        {q.skills.join(", ")}
                      </p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="shrink-0 ml-2">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                        ✅ Đúng
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
                        ❌ Cần xem lại
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENT AREA: QUESTION RENDERER IN LEARN MODE */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
          <QuestionRenderer
            question={currentQuestion}
            totalQuestions={DIAGNOSTIC_QUESTIONS.length}
            mode="learn"
            userAnswer={storageState.answers[currentQuestion.id]}
            unlockedHints={storageState.hintsUsed[currentQuestion.id] || [1, 2, 3]} // In learn mode, hints can be easily explored
            onUnlockHint={handleUnlockHint}
            onSubmitAnswer={handleSubmitAnswer}
            onRetry={handleRetry}
            onPrev={handlePrev}
            onNext={handleNext}
            hasPrev={activeQuestionIndex > 0}
            hasNext={activeQuestionIndex < DIAGNOSTIC_QUESTIONS.length - 1}
          />
        </div>
      </div>
    </div>
  );
};
