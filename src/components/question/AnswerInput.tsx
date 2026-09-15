import React, { useState, useEffect } from "react";
import { Check, CheckCircle2, XCircle, RefreshCw, Send, ArrowRight } from "lucide-react";
import { Question, QuestionMode } from "../../types/question";
import { evaluateAnswer } from "../../utils/scoring";

interface AnswerInputProps {
  question: Question;
  mode: QuestionMode;
  initialValue?: string | number | string[] | null;
  onSubmitAnswer: (value: string | number | string[], isCorrect: boolean) => void;
  onRetry?: () => void;
  onNext?: () => void;
  isLastQuestion?: boolean;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  question,
  mode,
  initialValue,
  onSubmitAnswer,
  onRetry,
  onNext,
  isLastQuestion = false,
}) => {
  const [currentVal, setCurrentVal] = useState<string>(
    initialValue !== null && initialValue !== undefined ? String(initialValue) : ""
  );
  const [submitted, setSubmitted] = useState<boolean>(
    initialValue !== null && initialValue !== undefined && initialValue !== ""
  );
  const [showFeedback, setShowFeedback] = useState<boolean>(submitted);

  useEffect(() => {
    const valStr = initialValue !== null && initialValue !== undefined ? String(initialValue) : "";
    setCurrentVal(valStr);
    const hasAnswer = valStr !== "";
    setSubmitted(hasAnswer);
    setShowFeedback(hasAnswer);
  }, [question.id, initialValue]);

  const isCorrect = evaluateAnswer(question, currentVal);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentVal.trim()) return;

    const correct = evaluateAnswer(question, currentVal);
    setSubmitted(true);
    setShowFeedback(true);
    onSubmitAnswer(currentVal, correct);
  };

  const handleSelectChoice = (choiceId: string) => {
    setCurrentVal(choiceId);
    if (mode === "challenge") {
      // Auto-submit choice in challenge mode or allow check button
      const correct = evaluateAnswer(question, choiceId);
      setSubmitted(true);
      setShowFeedback(true);
      onSubmitAnswer(choiceId, correct);
    }
  };

  const handleRetryInternal = () => {
    setCurrentVal("");
    setSubmitted(false);
    setShowFeedback(false);
    if (onRetry) onRetry();
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <span>✍️</span> Khu vực trả lời
        </h4>
        <span className="text-xs text-slate-500">
          Định dạng: <strong className="font-mono text-indigo-600">{question.problem.answerType}</strong>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* SINGLE CHOICE RENDERER */}
        {question.problem.answerType === "single-choice" && question.problem.choices && (
          <div className="grid gap-2.5 sm:grid-cols-1">
            {question.problem.choices.map((choice, idx) => {
              const choiceId = typeof choice === "string" ? String(idx + 1) : choice.id;
              const choiceLabel = typeof choice === "string" ? choice : choice.label;
              const isSelected = currentVal === choiceId || currentVal.toLowerCase() === choiceLabel.toLowerCase();

              return (
                <button
                  type="button"
                  key={choiceId}
                  onClick={() => handleSelectChoice(choiceId)}
                  className={`flex items-center justify-between rounded-xl border-2 p-3.5 text-left text-sm font-medium transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/80 text-indigo-950 ring-2 ring-indigo-200"
                      : "border-slate-200 bg-slate-50/60 text-slate-700 hover:border-indigo-300 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-300 bg-white text-slate-500"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{choiceLabel}</span>
                  </div>

                  {isSelected && <Check className="h-4 w-4 text-indigo-600" />}
                </button>
              );
            })}
          </div>
        )}

        {/* NUMBER INPUT RENDERER */}
        {question.problem.answerType === "number" && (
          <div className="space-y-2">
            <div className="relative flex max-w-md items-center">
              <input
                type="number"
                value={currentVal}
                onChange={(e) => setCurrentVal(e.target.value)}
                placeholder={question.problem.placeholder || "Nhập số..."}
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
              />
              {question.problem.unit && (
                <span className="pointer-events-none absolute right-4 rounded-md bg-slate-200/70 px-2 py-1 text-xs font-semibold text-slate-700">
                  {question.problem.unit}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Nhập giá trị số nguyên hoặc thập phân phù hợp với yêu cầu đề bài.
            </p>
          </div>
        )}

        {/* TEXT INPUT RENDERER */}
        {question.problem.answerType === "text" && (
          <div className="space-y-2">
            <div className="max-w-md">
              <input
                type="text"
                value={currentVal}
                onChange={(e) => setCurrentVal(e.target.value)}
                placeholder={question.problem.placeholder || "Nhập câu trả lời..."}
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {question.problem.placeholder
                ? `Lưu ý định dạng: ${question.problem.placeholder}`
                : "Nhập đúng cú pháp theo hướng dẫn trong đề bài."}
            </p>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <button
            type="submit"
            disabled={!currentVal.trim()}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition"
          >
            <Send className="h-4 w-4" />
            <span>{submitted ? "Lưu lại đáp án" : "Kiểm tra"}</span>
          </button>

          {mode === "learn" && submitted && (
            <button
              type="button"
              onClick={handleRetryInternal}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Thử lại</span>
            </button>
          )}

          {submitted && onNext && (
            <button
              type="button"
              onClick={onNext}
              className="ml-auto flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 active:scale-95 transition"
            >
              <span>{isLastQuestion ? "Xem kết quả" : "Câu tiếp theo"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* FEEDBACK BOX */}
      {showFeedback && (
        <div className="pt-2">
          {mode === "challenge" ? (
            /* Challenge mode feedback: respectful, records progress without spoiling */
            <div className="flex items-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900">
              <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
              <div>
                <p className="font-bold">Đã ghi nhận câu trả lời!</p>
                <p className="text-blue-700">
                  Em có thể suy nghĩ thêm, dùng gợi ý nếu cần, hoặc chuyển sang câu tiếp theo.
                </p>
              </div>
            </div>
          ) : (
            /* Learn mode feedback: full step-by-step verification */
            <div
              className={`rounded-xl border p-4 text-xs ${
                isCorrect
                  ? "border-emerald-200 bg-emerald-50/80 text-emerald-950"
                  : "border-rose-200 bg-rose-50/80 text-rose-950"
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm">Chính xác! Em đã suy luận rất chuẩn.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-rose-600" />
                    <span className="text-sm">Chưa chính xác! Cùng xem giải thích để rút kinh nghiệm nhé.</span>
                  </>
                )}
              </div>

              <div className="space-y-1.5 pl-7">
                <p>
                  <strong>Câu trả lời của em:</strong>{" "}
                  <span className="font-mono bg-white/60 px-1.5 py-0.5 rounded">
                    {currentVal || "(chưa nhập)"}
                  </span>
                </p>
                <p>
                  <strong>Đáp án chuẩn:</strong>{" "}
                  <span className="font-bold text-indigo-700 bg-white/60 px-1.5 py-0.5 rounded">
                    {question.answer.displayValue || String(question.answer.value)}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
