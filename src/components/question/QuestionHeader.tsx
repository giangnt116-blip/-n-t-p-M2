import React from "react";
import { Star } from "lucide-react";
import { Question } from "../../types/question";
import { SKILLS_DICTIONARY } from "../../data/skills";

interface QuestionHeaderProps {
  question: Question;
  totalQuestions: number;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  question,
  totalQuestions,
}) => {
  const formattedOrder = String(question.order).padStart(2, "0");
  const formattedTotal = String(totalQuestions).padStart(2, "0");

  const renderStars = (difficulty: 1 | 2 | 3) => {
    return Array.from({ length: 3 }).map((_, idx) => (
      <Star
        key={idx}
        className={`h-3.5 w-3.5 ${
          idx < difficulty
            ? "fill-amber-400 text-amber-500"
            : "fill-slate-200 text-slate-300"
        }`}
      />
    ));
  };

  const getDifficultyLabel = (diff: 1 | 2 | 3) => {
    switch (diff) {
      case 1:
        return "Cơ bản";
      case 2:
        return "Vận dụng";
      case 3:
        return "Thử thách cao";
    }
  };

  return (
    <div className="space-y-2 border-b border-slate-200 pb-4">
      {/* Top Meta Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-indigo-100/80 px-2.5 py-1 text-xs font-black tracking-wider text-indigo-800">
            THỬ THÁCH {formattedOrder} / {formattedTotal}
          </span>

          <div
            className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200/60"
            title={`Độ khó: ${getDifficultyLabel(question.difficulty)}`}
          >
            <div className="flex items-center gap-0.5">{renderStars(question.difficulty)}</div>
            <span className="text-[11px] ml-1">{getDifficultyLabel(question.difficulty)}</span>
          </div>
        </div>

        {/* Skill Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          {question.skills.map((sk) => {
            const meta = SKILLS_DICTIONARY[sk];
            const label = meta ? meta.name : sk;
            const badgeClass = meta
              ? `${meta.badgeBg} ${meta.badgeBorder}`
              : "bg-slate-100 text-slate-700 border-slate-200";

            return (
              <span
                key={sk}
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badgeClass}`}
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Main Question Title */}
      <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
        <span>{getQuestionEmoji(question.id)}</span>
        <span>{question.title}</span>
      </h2>
    </div>
  );
};

function getQuestionEmoji(id: string): string {
  switch (id) {
    case "D01":
      return "⚖️";
    case "D02":
      return "🪑";
    case "D03":
      return "🐰";
    case "D04":
      return "🏝️";
    case "D05":
      return "🤖";
    case "D06":
      return "🚶‍♂️";
    case "D07":
      return "🦫";
    case "D08":
      return "📚";
    case "D09":
      return "🔋";
    case "D10":
      return "🀄";
    case "D11":
      return "🔢";
    case "D12":
      return "🚢";
    default:
      return "🧠";
  }
}
