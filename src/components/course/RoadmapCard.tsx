import React from "react";
import { Lock, CheckCircle2, Play, Sparkles, Clock, Target, Award } from "lucide-react";
import { CourseModule } from "../../types/course";
import { SKILLS_DICTIONARY } from "../../data/skills";

interface RoadmapCardProps {
  module: CourseModule;
  onSelect: (module: CourseModule) => void;
  progressPercent?: number;
}

export const RoadmapCard: React.FC<RoadmapCardProps> = ({
  module,
  onSelect,
  progressPercent = 0,
}) => {
  const isAvailable = module.status === "AVAILABLE";

  return (
    <div
      id={`course-module-${module.id}`}
      className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
        isAvailable
          ? "border-indigo-500 bg-white shadow-md ring-4 ring-indigo-50 hover:shadow-lg"
          : "border-slate-200 bg-slate-50/70 opacity-90"
      }`}
    >
      {/* Top Banner */}
      <div
        className={`flex items-center justify-between px-5 py-3.5 border-b ${
          isAvailable
            ? "border-indigo-100 bg-indigo-50/60"
            : "border-slate-200/80 bg-slate-100/60"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-black tracking-wider ${
              isAvailable
                ? "bg-indigo-600 text-white"
                : "bg-slate-300 text-slate-700"
            }`}
          >
            {module.code}
          </span>
          {isAvailable && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              SẴN SÀNG KHÁM PHÁ
            </span>
          )}
        </div>

        {isAvailable ? (
          <span className="text-xs font-bold text-indigo-700">12 Thử thách</span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
            <Lock className="h-3.5 w-3.5 text-slate-400" />
            🔒 Chưa mở
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 sm:text-xl">
            {module.title}
          </h3>
          <p className="text-xs font-semibold text-indigo-600 mt-0.5">
            {module.subtitle}
          </p>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            {module.description}
          </p>
        </div>

        {/* Skill tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {module.skills.map((sk) => {
            const meta = SKILLS_DICTIONARY[sk];
            return (
              <span
                key={sk}
                className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
              >
                #{meta ? meta.name : sk}
              </span>
            );
          })}
        </div>

        {/* Meta stats */}
        <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
          {module.estimatedDuration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {module.estimatedDuration}
            </span>
          )}
          {module.challengeCount && (
            <span className="flex items-center gap-1">
              <Target className="h-3.5 w-3.5 text-slate-400" />
              {module.challengeCount} bài tập
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isAvailable ? (
            <button
              onClick={() => onSelect(module)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>{progressPercent > 0 ? "Tiếp tục thử thách" : "Bắt đầu Module 0"}</span>
            </button>
          ) : (
            <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-2.5 text-xs font-semibold text-slate-400 bg-slate-100/50 cursor-not-allowed">
              <Lock className="h-3.5 w-3.5" />
              <span>Sẽ mở sau khi hoàn thành Module trước</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
