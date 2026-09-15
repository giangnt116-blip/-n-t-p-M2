import React from "react";
import {
  Award,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Map,
  Compass,
  ArrowRight,
  TrendingUp,
  Brain,
  Zap,
} from "lucide-react";
import { loadDiagnosticState } from "../utils/storage";
import { analyzeDiagnosticPerformance } from "../utils/skillAnalysis";
import { SkillBar } from "../components/result/SkillBar";

interface ResultPageProps {
  onNavigate: (path: string) => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ onNavigate }) => {
  const state = loadDiagnosticState();
  const summary = analyzeDiagnosticPerformance(state);

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-8 px-4 sm:px-6">
      {/* CELEBRATION HEADER */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-b from-indigo-50/80 via-white to-amber-50/40 p-8 sm:p-12 text-center shadow-sm">
        <div className="mx-auto max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>GIAI ĐOẠN 1 • HOÀN THÀNH ÔN TẬP ĐẦU VÀO</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            🎉 HOÀN THÀNH ÔN TẬP ĐẦU VÀO
          </h1>

          <p className="text-xs sm:text-sm text-slate-600">
            Xin chúc mừng <strong>{state.studentName}</strong> đã nỗ lực hoàn thành trọn vẹn 12 thử thách ôn tập đầu vào M2!
          </p>

          {/* Big Score Card */}
          <div className="mx-auto my-6 flex max-w-xs items-center justify-center gap-3 rounded-2xl border-2 border-indigo-200 bg-white p-6 shadow-sm">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tổng điểm đạt được
              </span>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-5xl font-black tracking-tight text-indigo-600">
                  {summary.correctCount}
                </span>
                <span className="text-2xl font-bold text-slate-400">/ 12</span>
              </div>
              <span className="mt-1 inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">
                Độ chuẩn xác: {summary.accuracyRate}%
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl border border-slate-200 bg-white/80 p-3">
              <span className="text-slate-400 block font-medium">Đã trả lời</span>
              <strong className="text-base text-slate-800 font-bold">{summary.answeredCount}/12</strong>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-3">
              <span className="text-slate-400 block font-medium">Gợi ý đã dùng</span>
              <strong className="text-base text-amber-600 font-bold">{summary.totalHintsUsed}</strong>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-3">
              <span className="text-slate-400 block font-medium">Lượt kiểm tra</span>
              <strong className="text-base text-slate-800 font-bold">{summary.totalAttempts}</strong>
            </div>
          </div>

          {/* Navigation CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigate("/diagnostic/D13")}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-3.5 text-sm font-extrabold text-white shadow-md shadow-amber-200 hover:bg-amber-600 active:scale-95 transition"
            >
              <Sparkles className="h-4 w-4 text-white" />
              <span>Luyện Phần B: Củng cố (D13–D22) →</span>
            </button>

            <button
              onClick={() => onNavigate("/review")}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition"
            >
              <BookOpen className="h-4 w-4" />
              <span>Xem lại & Luyện</span>
            </button>

            <button
              onClick={() => onNavigate("/course")}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-95 transition"
            >
              <Map className="h-4 w-4 text-indigo-600" />
              <span>🗺 Xem lộ trình 12 tuần</span>
            </button>
          </div>
        </div>
      </section>

      {/* STRENGTHS & GROWTH AREAS SECTION */}
      <section className="grid gap-6 sm:grid-cols-2">
        {/* STRENGTHS CARD */}
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-b from-emerald-50/50 to-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-xs">
              <span className="text-lg">💪</span>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Điểm mạnh nổi bật
              </h3>
              <p className="text-xs text-emerald-700 font-medium">
                Các mảng tư duy em làm rất tự tin và chính xác
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {summary.strengths.map((str) => (
              <div
                key={str.skillId}
                className="rounded-xl border border-emerald-200 bg-white p-3.5 shadow-2xs"
              >
                <div className="flex items-center justify-between font-bold text-slate-800 text-xs">
                  <span>{str.vietnameseLabel}</span>
                  <span className="text-emerald-600 font-black">{str.percentage}%</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  {str.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* GROWTH / UNLOCK NEXT CARD */}
        <div className="rounded-3xl border border-indigo-200 bg-gradient-to-b from-indigo-50/50 to-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <span className="text-lg">🎯</span>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Kỹ năng tiếp theo nên mở khóa
              </h3>
              <p className="text-xs text-indigo-700 font-medium">
                Cần luyện thêm trong các tuần tới để bứt phá
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {summary.growthAreas.map((ga) => (
              <div
                key={ga.skillId}
                className="rounded-xl border border-indigo-200 bg-white p-3.5 shadow-2xs"
              >
                <div className="flex items-center justify-between font-bold text-slate-800 text-xs">
                  <span>{ga.vietnameseLabel}</span>
                  <span className="rounded bg-indigo-50 px-2 py-0.5 text-indigo-700 text-[11px] font-bold">
                    Cần luyện thêm
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  {ga.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 SKILL BARS SECTION */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            <span>Chi tiết 7 kỹ năng tư duy M2</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tỷ lệ câu đúng theo từng trụ cột năng lực trong bài khảo sát
          </p>
        </div>

        <div className="space-y-3">
          {summary.skillScores.map((score) => (
            <SkillBar key={score.skillId} skill={score} />
          ))}
        </div>
      </section>
    </div>
  );
};
