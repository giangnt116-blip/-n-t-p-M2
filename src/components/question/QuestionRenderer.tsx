import React from "react";
import { ArrowLeft, ArrowRight, Lightbulb, BookOpen, CheckCircle, Award } from "lucide-react";
import { Question, QuestionMode } from "../../types/question";
import { QuestionHeader } from "./QuestionHeader";
import { HintEngine } from "./HintEngine";
import { AnswerInput } from "./AnswerInput";
import { SimulationRenderer } from "../../simulations/SimulationRenderer";

interface QuestionRendererProps {
  question: Question;
  totalQuestions: number;
  mode: QuestionMode;
  userAnswer?: string | number | string[] | null;
  unlockedHints?: number[];
  onUnlockHint: (level: 1 | 2 | 3) => void;
  onSubmitAnswer: (value: string | number | string[], isCorrect: boolean) => void;
  onPrev?: () => void;
  onNext?: () => void;
  onRetry?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  totalQuestions,
  mode,
  userAnswer,
  unlockedHints = [],
  onUnlockHint,
  onSubmitAnswer,
  onPrev,
  onNext,
  onRetry,
  hasPrev = true,
  hasNext = true,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <QuestionHeader question={question} totalQuestions={totalQuestions} />

      {/* 2. PROBLEM STATEMENT CARD */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>📋</span> Đề bài thử thách
        </div>
        <div className="space-y-3 font-sans text-base leading-relaxed text-slate-800 sm:text-lg whitespace-pre-line">
          {question.problem.text}
        </div>
      </div>

      {/* 3. SIMULATION AREA */}
      <div className="space-y-2">
        <SimulationRenderer
          simulation={question.simulation}
          mode={mode}
          questionTitle={question.title}
        />
      </div>

      {/* 4. HINT ENGINE (Active in challenge & learn) */}
      <HintEngine
        hints={question.hints}
        questionId={question.id}
        unlockedHints={unlockedHints}
        onUnlockHint={onUnlockHint}
      />

      {/* 5. ANSWER AREA */}
      <AnswerInput
        question={question}
        mode={mode}
        initialValue={userAnswer}
        onSubmitAnswer={onSubmitAnswer}
        onRetry={onRetry}
        onNext={onNext}
        isLastQuestion={question.order === totalQuestions}
      />

      {/* 6. LEARN MODE ONLY: TEACHING POINT & STEP-BY-STEP EXPLANATION */}
      {mode === "learn" && (
        <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 shadow-xs">
          {/* Teaching Point Callout */}
          <div className="flex items-start gap-3 rounded-xl border border-emerald-300 bg-white p-4 shadow-2xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                💡 Điểm mấu chốt tư duy (Teaching Point)
              </span>
              <p className="mt-1 text-base font-extrabold text-emerald-950">
                “{question.teachingPoint}”
              </p>
            </div>
          </div>

          {/* Explanation steps */}
          <div className="rounded-xl border border-emerald-200 bg-white p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              <span>Các bước giải thích chi tiết</span>
            </div>

            <div className="space-y-2.5">
              {question.explanation.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700 leading-relaxed"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-800">
                    {idx + 1}
                  </span>
                  <div className="whitespace-pre-line">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. NAVIGATION CONTROLS */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>← Câu trước</span>
        </button>

        <span className="text-xs font-semibold text-slate-500">
          Câu {question.order} / {totalQuestions}
        </span>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition"
        >
          <span>{question.order === totalQuestions ? "Hoàn thành" : "Câu tiếp →"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
