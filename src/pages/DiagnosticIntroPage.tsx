import React, { useState } from "react";
import {
  Rocket,
  Brain,
  Sparkles,
  Clock,
  CheckCircle2,
  Compass,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { CORE_SKILL_GROUPS, SKILLS_DICTIONARY } from "../data/skills";
import { loadDiagnosticState, startDiagnosticSession } from "../utils/storage";

interface DiagnosticIntroPageProps {
  onStart: () => void;
  onNavigate: (path: string) => void;
}

export const DiagnosticIntroPage: React.FC<DiagnosticIntroPageProps> = ({
  onStart,
  onNavigate,
}) => {
  const state = loadDiagnosticState();
  const [studentName, setStudentName] = useState(state.studentName || "Học viên M2");
  const answeredCount = Object.keys(state.answers).length;

  const handleBegin = () => {
    startDiagnosticSession(studentName);
    onStart();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-8 px-4 sm:px-6">
      {/* Hero Header */}
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-b from-indigo-50/60 to-white p-8 sm:p-12 text-center shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100/70 px-3.5 py-1 text-xs font-bold text-indigo-800">
          <Compass className="h-3.5 w-3.5" />
          <span>GIAI ĐOẠN 1 • ÔN TẬP ĐẦU VÀO</span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          ÔN TẬP ĐẦU VÀO M2
        </h1>

        <div className="inline-block rounded-xl border border-indigo-200/80 bg-indigo-50/80 px-4 py-1.5 text-xs sm:text-sm font-bold text-indigo-900">
          Hiện tại: Ôn tập đầu vào M2 dành cho học sinh lớp 6.
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 pt-1">
          <span className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 shadow-2xs border border-slate-200">
            <span className="text-base">🎯</span> 12 thử thách tư duy
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 shadow-2xs border border-slate-200">
            <Clock className="h-4 w-4 text-indigo-600" /> Khoảng 45–60 phút
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 shadow-2xs border border-slate-200">
            <span className="text-base">💡</span> 3 cấp độ gợi ý hỗ trợ
          </span>
        </div>

        {/* Empathy & Encouragement Box */}
        <div className="mx-auto max-w-2xl rounded-2xl border-2 border-indigo-200 bg-white p-5 text-left shadow-2xs space-y-2 mt-4">
          <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>🌱</span> Thông điệp gửi em:
          </p>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            “<strong>Đây không phải bài kiểm tra để đánh giá em giỏi hay yếu.</strong> Mục tiêu của 12 thử thách là cùng em tìm xem em đang mạnh ở kiểu tư duy nào và kỹ năng nào cần luyện thêm.”
          </p>
          <p className="text-xs text-slate-500 italic">
            Em có thể thoải mái thử sai, đổi phương án, và sử dụng gợi ý bất cứ khi nào cần.
          </p>
        </div>

        {/* Student Name Input */}
        <div className="mx-auto max-w-sm pt-2 text-left">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tên của em (để ghi nhận báo cáo tiến trình):
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Nhập tên em..."
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        {/* Action button */}
        <div className="pt-2">
          <button
            onClick={handleBegin}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-base font-extrabold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition"
          >
            <Rocket className="h-5 w-5 text-amber-300" />
            <span>
              {answeredCount > 0
                ? `Tiếp tục ôn tập (${answeredCount}/12 câu)`
                : "Bắt đầu ôn tập"}
            </span>
          </button>
        </div>
      </div>

      {/* 7 Core M2 Skills Display */}
      <div className="space-y-4">
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 justify-center sm:justify-start">
            <Brain className="h-5 w-5 text-indigo-600" />
            <span>7 Trụ cột Tư duy được khảo sát</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mỗi thử thách tương ứng với một góc nhìn tư duy cụ thể trong cấu trúc đề M2
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_SKILL_GROUPS.map((grp) => {
            const meta = SKILLS_DICTIONARY[grp.id];
            return (
              <div
                key={grp.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-indigo-300 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-indigo-600">
                    {grp.label}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    M2 Core
                  </span>
                </div>
                <h4 className="mt-1 text-sm font-extrabold text-slate-900">
                  {grp.vietnamese}
                </h4>
                <p className="mt-1 text-xs text-slate-500 leading-snug">
                  {meta?.description || "Rèn luyện khả năng tư duy giải quyết vấn đề."}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
