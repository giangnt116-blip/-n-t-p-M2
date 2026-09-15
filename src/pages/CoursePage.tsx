import React from "react";
import { Lock, Play, ArrowDown, Award, Sparkles, Compass, CheckCircle2 } from "lucide-react";
import { COURSE_MODULES } from "../data/course";
import { CourseModule } from "../types/course";
import { RoadmapCard } from "../components/course/RoadmapCard";
import { loadDiagnosticState } from "../utils/storage";

interface CoursePageProps {
  onNavigate: (path: string) => void;
}

export const CoursePage: React.FC<CoursePageProps> = ({ onNavigate }) => {
  const state = loadDiagnosticState();
  const module0 = COURSE_MODULES[0];
  const weeklyModules = COURSE_MODULES.slice(1);
  const answeredCount = Object.keys(state.answers).length;

  const handleSelectModule = (mod: CourseModule) => {
    if (mod.status === "AVAILABLE") {
      onNavigate("/diagnostic");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-12 py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700">
          <Compass className="h-3.5 w-3.5" />
          <span>LỘ TRÌNH HUẤN LUYỆN TƯ DUY 12 TUẦN</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Hành trình Chinh phục M2 từng bước
        </h1>
        <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-600 leading-relaxed">
          Khóa học được cấu trúc theo chuỗi phát triển năng lực tư duy toán tin chuẩn hóa.
          Bắt đầu từ <strong>Module 0</strong> để đánh giá khởi động, sau đó từng tuần học chuyên sâu sẽ lần lượt được mở khóa.
        </p>
      </div>

      {/* Visual Journey Pathway */}
      <div className="relative space-y-8">
        {/* START Point */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md ring-4 ring-indigo-100">
            <Sparkles className="h-6 w-6" />
          </div>
          <span className="mt-2 font-mono text-xs font-black tracking-widest text-indigo-700 uppercase">
            Điểm Xuất Phát (START)
          </span>
          <ArrowDown className="mt-2 h-5 w-5 text-indigo-400 animate-bounce" />
        </div>

        {/* MODULE 0 - HERO HIGHLIGHT */}
        <div className="mx-auto max-w-2xl">
          <div className="mb-2 text-center">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              ✦ Cổng khởi động hiện tại
            </span>
          </div>
          <RoadmapCard
            module={module0}
            onSelect={handleSelectModule}
            progressPercent={Math.round((answeredCount / 12) * 100)}
          />
        </div>

        {/* Pathway divider */}
        <div className="flex flex-col items-center justify-center text-center my-4">
          <ArrowDown className="h-6 w-6 text-slate-300" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
            Giai đoạn rèn luyện chuyên sâu 12 tuần
          </span>
        </div>

        {/* WEEKS 01 - 12 GRID */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {weeklyModules.map((mod) => (
            <RoadmapCard
              key={mod.id}
              module={mod}
              onSelect={handleSelectModule}
            />
          ))}
        </div>

        {/* DESTINATION: M2 MASTER */}
        <div className="flex flex-col items-center justify-center text-center pt-8">
          <ArrowDown className="mb-2 h-6 w-6 text-indigo-400" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-lg ring-4 ring-amber-100">
            <Award className="h-8 w-8" />
          </div>
          <h3 className="mt-3 text-lg font-black text-slate-900 tracking-tight">
            🏆 M2 MASTER – THÀNH CÔNG VƯỢT TRỘI
          </h3>
          <p className="mt-1 max-w-md text-xs text-slate-500">
            Trang bị tư duy thuật toán sắc bén, khả năng mô phỏng nhanh nhạy và phản xạ thi đấu tự tin.
          </p>
        </div>
      </div>
    </div>
  );
};
