import React, { useState, useEffect } from "react";
import { CheckCircle2, Lock, Sparkles, Compass } from "lucide-react";
import { Question } from "../../types/question";
import { DiagnosticStorageState, PracticeStorageState } from "../../utils/storage";

interface ProgressBarProps {
  questions: Question[];
  currentQuestionId: string;
  onSelectQuestion: (questionId: string) => void;
  storageState: DiagnosticStorageState;
  practiceState?: PracticeStorageState;
  showStatusSummary?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  questions,
  currentQuestionId,
  onSelectQuestion,
  storageState,
  practiceState,
  showStatusSummary = true,
}) => {
  // Determine if current question is Part A or Part B
  const isPartBCurrent =
    currentQuestionId.startsWith("D") && parseInt(currentQuestionId.slice(1), 10) >= 13;

  // Active section tab in progress bar
  const [activeTab, setActiveTab] = useState<"A" | "B">(isPartBCurrent ? "B" : "A");

  // Sync tab when current question changes externally
  useEffect(() => {
    setActiveTab(isPartBCurrent ? "B" : "A");
  }, [isPartBCurrent, currentQuestionId]);

  // Split questions into Part A and Part B
  const partAQuestions = questions.filter(
    (q) => !q.part || q.part === "A" || (q.id.startsWith("D") && parseInt(q.id.slice(1), 10) <= 12)
  );
  const partBQuestions = questions.filter(
    (q) => q.part === "B" || (q.id.startsWith("D") && parseInt(q.id.slice(1), 10) >= 13)
  );

  // Active list based on tab
  const displayList = activeTab === "A" ? partAQuestions : partBQuestions;

  // Answered counts
  const partAAnswered = partAQuestions.filter(
    (q) => storageState.answers[q.id] !== undefined && storageState.answers[q.id] !== ""
  ).length;

  const partBAnswered = partBQuestions.filter(
    (q) =>
      practiceState &&
      practiceState.answers[q.id] !== undefined &&
      practiceState.answers[q.id] !== ""
  ).length;

  // Part B available questions count (D13, D14, D15 = 3)
  const partBAvailableCount = partBQuestions.filter(
    (q) => q.status === "available" || !q.status
  ).length;

  return (
    <div className="w-full space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Tab Switcher: PHẦN A vs PHẦN B */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab("A")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === "A"
                ? "bg-white text-indigo-700 shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Compass className="h-3.5 w-3.5 text-indigo-600" />
            <span>PHẦN A: Khởi động ({partAAnswered}/{partAQuestions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("B")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === "B"
                ? "bg-white text-amber-900 shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>PHẦN B: Củng cố ({partBAnswered}/{partBQuestions.length})</span>
          </button>
        </div>

        {/* Current status summary */}
        {showStatusSummary && (
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {activeTab === "A" ? (
              <>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Đã làm: <strong className="text-slate-800">{partAAnswered}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  Còn lại: <strong className="text-slate-800">{partAQuestions.length - partAAnswered}</strong>
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Đã làm: <strong className="text-slate-800">{partBAnswered}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  D13–D20 mở • D21–D22 sắp mở
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Question Step Pills Grid */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {displayList.map((q, idx) => {
          const isCurrent = q.id === currentQuestionId;
          const isComingSoon = q.status === "coming_soon";

          let isAnswered = false;
          if (activeTab === "A") {
            isAnswered =
              storageState.answers[q.id] !== undefined && storageState.answers[q.id] !== "";
          } else {
            isAnswered =
              Boolean(practiceState && practiceState.answers[q.id] !== undefined && practiceState.answers[q.id] !== "");
          }

          let btnClass = "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100";
          if (isCurrent) {
            btnClass =
              activeTab === "B"
                ? "border-amber-500 bg-amber-500 text-white shadow-sm ring-2 ring-amber-200 font-black"
                : "border-indigo-600 bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-200 font-black";
          } else if (isAnswered) {
            btnClass = "border-emerald-300 bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100";
          } else if (isComingSoon) {
            btnClass = "border-dashed border-slate-300 bg-slate-100/60 text-slate-400 cursor-not-allowed opacity-75";
          }

          return (
            <button
              key={q.id}
              disabled={isComingSoon}
              onClick={() => onSelectQuestion(q.id)}
              className={`flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-xs transition-all active:scale-95 ${btnClass}`}
              title={
                isComingSoon
                  ? `${q.id}: ${q.title} (Sắp mở)`
                  : `${q.id}: ${q.title} (${isAnswered ? "Đã làm" : "Chưa làm"})`
              }
            >
              <span className="font-bold">{q.id}</span>
              {isAnswered && !isCurrent && (
                <CheckCircle2 className="h-3 w-3 text-emerald-600 ml-1" />
              )}
              {isComingSoon && (
                <Lock className="h-2.5 w-2.5 text-slate-400 ml-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
