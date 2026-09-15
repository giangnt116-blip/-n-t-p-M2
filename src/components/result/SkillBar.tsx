import React from "react";
import { SkillScore } from "../../types/result";
import { SKILLS_DICTIONARY } from "../../data/skills";

interface SkillBarProps {
  skill: SkillScore;
}

export const SkillBar: React.FC<SkillBarProps> = ({ skill }) => {
  const meta = SKILLS_DICTIONARY[skill.skillId];
  const percent = skill.percentage;

  // Determine progress bar color
  let barColor = "from-amber-400 to-amber-500";
  let textColor = "text-amber-700";
  let bgColor = "bg-amber-50";

  if (percent >= 75) {
    barColor = "from-emerald-400 to-emerald-600";
    textColor = "text-emerald-700";
    bgColor = "bg-emerald-50";
  } else if (percent >= 50) {
    barColor = "from-blue-400 to-indigo-600";
    textColor = "text-indigo-700";
    bgColor = "bg-indigo-50";
  }

  return (
    <div className="space-y-1.5 rounded-xl border border-slate-100 bg-white p-3.5 shadow-2xs">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <span className="font-mono text-indigo-600">{skill.skillName}</span>
          <span className="text-slate-400 font-normal">|</span>
          <span className="text-slate-600 font-medium">{skill.vietnameseLabel}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400">
            {skill.correctQuestions}/{skill.totalQuestions} câu
          </span>
          <span className={`rounded-md px-2 py-0.5 text-xs font-black ${bgColor} ${textColor}`}>
            {percent}%
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Small recommendation hint */}
      <p className="text-[11px] text-slate-500 leading-snug">
        {skill.recommendation}
      </p>
    </div>
  );
};
