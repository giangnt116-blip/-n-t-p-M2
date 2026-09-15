import React from "react";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Question } from "../../types/question";
import { DiagnosticStorageState } from "../../utils/storage";

interface ProgressBarProps {
  questions: Question[];
  currentQuestionId: string;
  onSelectQuestion: (questionId: string) => void;
  storageState: DiagnosticStorageState;
  showStatusSummary?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  questions,
  currentQuestionId,
  onSelectQuestion,
  storageState,
  showStatusSummary = true,
}) => {
  const currentIndex = questions.findIndex((q) => q.id === currentQuestionId);
  const currentOrder = currentIndex >= 0 ? currentIndex + 1 : 1;
  const total = questions.length;

  const answeredCount = questions.filter(
    (q) => storageState.answers[q.id] !== undefined && storageState.answers[q.id] !== ""
  ).length;

  const progressPercent = Math.round((answeredCount / total) * 100);

  return (
    <div className="w-full space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Top row: Counter & progress bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Tiến độ khảo sát
          </span>
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-extrabold text-indigo-700">
            {currentOrder} / {total}
          </span>
        </div>

        {showStatusSummary && (
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Đã làm: <strong className="text-slate-800">{answeredCount}</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-slate-300" />
              Chưa làm: <strong className="text-slate-800">{total - answeredCount}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar Track */}
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Step Pills Grid */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {questions.map((q, idx) => {
          const isCurrent = q.id === currentQuestionId;
          const isAnswered =
            storageState.answers[q.id] !== undefined && storageState.answers[q.id] !== "";
          const isCompleted = storageState.diagnosticProgress[q.id]?.completed;

          let btnClass = "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100";
          if (isCurrent) {
            btnClass = "border-indigo-600 bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-200 font-bold";
          } else if (isAnswered) {
            btnClass = "border-emerald-300 bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100";
          }

          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(q.id)}
              className={`flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-xs transition-all active:scale-95 ${btnClass}`}
              title={`Câu ${idx + 1}: ${q.title} (${isAnswered ? "Đã trả lời" : "Chưa trả lời"})`}
            >
              <span className="mr-0.5">{idx + 1}</span>
              {isAnswered && !isCurrent && (
                <CheckCircle2 className="h-3 w-3 text-emerald-600 ml-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
