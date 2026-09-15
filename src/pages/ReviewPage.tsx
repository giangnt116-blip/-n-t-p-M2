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
  Layers,
} from "lucide-react";
import { DIAGNOSTIC_QUESTIONS } from "../data/diagnostic";
import { AVAILABLE_PART_B_QUESTIONS } from "../data/practice";
import { Question } from "../types/question";
import { QuestionRenderer } from "../components/question/QuestionRenderer";
import { evaluateAnswer } from "../utils/scoring";
import {
  loadDiagnosticState,
  saveQuestionAnswer,
  recordHintUsed,
  DiagnosticStorageState,
  loadPracticeState,
  savePracticeQuestionAnswer,
  recordPracticeHintUsed,
  isPartBQuestion,
  PracticeStorageState,
} from "../utils/storage";

interface ReviewPageProps {
  onNavigate: (path: string) => void;
}

export const ReviewPage: React.FC<ReviewPageProps> = ({ onNavigate }) => {
  const [storageState, setStorageState] = useState<DiagnosticStorageState>(loadDiagnosticState());
  const [practiceState, setPracticeState] = useState<PracticeStorageState>(loadPracticeState());

  // Part selector: "A" (D01-D12) or "B" (D13-D19)
  const [selectedPart, setSelectedPart] = useState<"A" | "B">("A");
  const [activeQuestionId, setActiveQuestionId] = useState<string>(DIAGNOSTIC_QUESTIONS[0].id);
  const [filterMode, setFilterMode] = useState<"all" | "correct" | "needsReview">("all");

  const currentList = selectedPart === "A" ? DIAGNOSTIC_QUESTIONS : AVAILABLE_PART_B_QUESTIONS;
  const isPartB = isPartBQuestion(activeQuestionId);

  const activeQuestionIndex = currentList.findIndex((q) => q.id === activeQuestionId);
  const currentQuestion = currentList[activeQuestionIndex >= 0 ? activeQuestionIndex : 0] || currentList[0];

  const handleSwitchPart = (part: "A" | "B") => {
    setSelectedPart(part);
    const targetList = part === "A" ? DIAGNOSTIC_QUESTIONS : AVAILABLE_PART_B_QUESTIONS;
    setActiveQuestionId(targetList[0].id);
  };

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

  const handleRetry = () => {
    if (isPartB) {
      const updated: PracticeStorageState = {
        ...practiceState,
        answers: {
          ...practiceState.answers,
          [currentQuestion.id]: "",
        },
        practiceProgress: {
          ...practiceState.practiceProgress,
          [currentQuestion.id]: {
            answered: false,
            completed: false,
            selectedAnswer: "",
            isCorrect: false,
          },
        },
      };
      setPracticeState(updated);
    } else {
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
    }
  };

  const handlePrev = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionId(currentList[activeQuestionIndex - 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (activeQuestionIndex < currentList.length - 1) {
      setActiveQuestionId(currentList[activeQuestionIndex + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Questions with status according to selected part
  const questionsWithStatus = currentList.map((q) => {
    const userAns = isPartBQuestion(q.id)
      ? practiceState.answers[q.id]
      : storageState.answers[q.id];
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
  const currentAnswer = isPartB
    ? practiceState.answers[currentQuestion.id]
    : storageState.answers[currentQuestion.id];

  const currentHints = isPartB
    ? practiceState.hintsUsed[currentQuestion.id] || [1, 2, 3]
    : storageState.hintsUsed[currentQuestion.id] || [1, 2, 3];

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-bold text-indigo-800">
              CHẾ ĐỘ HỌC TẬP • XEM LẠI &amp; LUYỆN TẬP
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 sm:text-3xl mt-1">
            Xem lại bài học &amp; Trải nghiệm mô phỏng
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Đọc kỹ teaching point và từng bước tư duy để củng cố nền tảng toán tư duy và thuật toán.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("/result")}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-95 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kết quả tổng quát</span>
          </button>
        </div>
      </div>

      {/* Part Switcher: Part A vs Part B */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => handleSwitchPart("A")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black transition-all ${
            selectedPart === "A"
              ? "bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>PHẦN A: Khởi động tư duy (D01–D12)</span>
        </button>

        <button
          onClick={() => handleSwitchPart("B")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black transition-all ${
            selectedPart === "B"
              ? "bg-amber-500 text-white shadow-sm ring-2 ring-amber-300"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>PHẦN B: Củng cố tư duy (D13–D19)</span>
        </button>
      </div>

      {/* Main Grid: Sidebar (Questions list) + Content (QuestionRenderer in Learn Mode) */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* SIDEBAR: QUESTION LIST WITH STATUS */}
        <div className="lg:col-span-4 space-y-3">
          {/* Filter tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            <button
              onClick={() => setFilterMode("all")}
              className={`flex-1 rounded-lg py-1.5 transition ${
                filterMode === "all"
                  ? "bg-white text-indigo-700 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Tất cả ({currentList.length})
            </button>
            <button
              onClick={() => setFilterMode("correct")}
              className={`flex-1 rounded-lg py-1.5 transition ${
                filterMode === "correct"
                  ? "bg-white text-emerald-700 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              ✅ Đúng ({correctCount})
            </button>
            <button
              onClick={() => setFilterMode("needsReview")}
              className={`flex-1 rounded-lg py-1.5 transition ${
                filterMode === "needsReview"
                  ? "bg-white text-rose-700 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              ❌ Cần xem ({currentList.length - correctCount})
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
                          ? selectedPart === "B"
                            ? "bg-amber-500 text-white"
                            : "bg-indigo-600 text-white"
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
                        ❌ Cần xem
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
            totalQuestions={currentList.length}
            mode="learn"
            userAnswer={currentAnswer}
            unlockedHints={currentHints}
            onUnlockHint={handleUnlockHint}
            onSubmitAnswer={handleSubmitAnswer}
            onRetry={handleRetry}
            onPrev={handlePrev}
            onNext={handleNext}
            hasPrev={activeQuestionIndex > 0}
            hasNext={activeQuestionIndex < currentList.length - 1}
          />
        </div>
      </div>
    </div>
  );
};
