import React, { useState } from "react";
import {
  Rocket,
  Brain,
  Sparkles,
  Clock,
  CheckCircle2,
  Compass,
  ArrowRight,
  Lock,
  PlayCircle,
  HelpCircle,
} from "lucide-react";
import { CORE_SKILL_GROUPS, SKILLS_DICTIONARY } from "../data/skills";
import { DIAGNOSTIC_QUESTIONS } from "../data/diagnostic";
import { PRACTICE_QUESTIONS } from "../data/practice";
import {
  loadDiagnosticState,
  loadPracticeState,
  startDiagnosticSession,
} from "../utils/storage";

interface DiagnosticIntroPageProps {
  onStart: () => void;
  onNavigate: (path: string) => void;
}

export const DiagnosticIntroPage: React.FC<DiagnosticIntroPageProps> = ({
  onStart,
  onNavigate,
}) => {
  const state = loadDiagnosticState();
  const practiceState = loadPracticeState();

  const [studentName, setStudentName] = useState(state.studentName || "Học viên M2");

  const answeredPartACount = Object.keys(state.answers).length;
  const answeredPartBCount = Object.keys(practiceState.answers).length;

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
            <span className="text-base">🎯</span> 12 khởi động + 10 củng cố
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 shadow-2xs border border-slate-200">
            <Clock className="h-4 w-4 text-indigo-600" /> Tự do theo nhịp học sinh
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
            “<strong>Đây không phải bài kiểm tra để đánh giá em giỏi hay yếu.</strong> Mục tiêu của các thử thách là cùng em tìm xem em đang mạnh ở kiểu tư duy nào và kỹ năng nào cần luyện thêm.”
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

        {/* Primary CTA Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleBegin}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-base font-extrabold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition"
          >
            <Rocket className="h-5 w-5 text-amber-300" />
            <span>
              {answeredPartACount > 0
                ? `Tiếp tục ôn tập (${answeredPartACount}/12 câu Phần A)`
                : "Bắt đầu ôn tập"}
            </span>
          </button>

          {answeredPartACount >= 12 && (
            <button
              onClick={() => onNavigate("/diagnostic/D13")}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-amber-400 bg-amber-50 px-6 py-4 text-base font-extrabold text-amber-900 hover:bg-amber-100 active:scale-95 transition"
            >
              <Sparkles className="h-5 w-5 text-amber-600" />
              <span>Luyện Phần B (D13–D15)</span>
            </button>
          )}

          {answeredPartACount > 0 && (
            <button
              onClick={() => onNavigate("/review")}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <span>Xem lại &amp; Luyện</span>
            </button>
          )}
        </div>
      </div>

      {/* ====================================================
          COURSE STRUCTURE: PHẦN A & PHẦN B
          ==================================================== */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Compass className="h-5 w-5 text-indigo-600" />
            <span>Cấu trúc Thử thách Ôn tập</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Bao gồm 2 phần được phân cấp rõ ràng theo lộ trình tư duy
          </p>
        </div>

        {/* SECTION A: 12 THỬ THÁCH KHỞI ĐỘNG */}
        <div className="rounded-3xl border border-indigo-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-indigo-100 px-2.5 py-1 text-xs font-black text-indigo-800">
                  PHẦN A
                </span>
                <h3 className="text-base font-black text-slate-900">
                  “Khởi động tư duy M2”
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                12/12 thử thách hiện có • Giúp nhận diện điểm mạnh và vùng cần rèn luyện
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Tiến độ: {answeredPartACount}/12 thử thách</span>
              </span>
            </div>
          </div>

          {/* Grid of 12 Questions (Part A) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {DIAGNOSTIC_QUESTIONS.map((q) => {
              const isAnswered =
                state.answers[q.id] !== undefined && state.answers[q.id] !== "";
              return (
                <button
                  key={q.id}
                  onClick={() => onNavigate(`/diagnostic/${q.id}`)}
                  className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all hover:shadow-xs active:scale-98 ${
                    isAnswered
                      ? "border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50"
                      : "border-slate-200 bg-white hover:border-indigo-300"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-mono text-xs font-black text-indigo-700">
                      {q.id}
                    </span>
                    {isAnswered ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="h-3 w-3" /> Đã làm
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Chưa làm</span>
                    )}
                  </div>
                  <h4 className="mt-1 text-xs font-bold text-slate-800 line-clamp-1">
                    {q.title}
                  </h4>
                  <span className="mt-1 text-[10px] text-slate-500 line-clamp-1">
                    {q.skills.map((s) => SKILLS_DICTIONARY[s]?.name || s).join(", ")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION B: 10 THỬ THÁCH CỦNG CỐ */}
        <div className="rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50/40 to-white p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-amber-500 px-2.5 py-1 text-xs font-black text-white shadow-2xs">
                  PHẦN B
                </span>
                <h3 className="text-base font-black text-slate-900">
                  “Củng cố tư duy M2”
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                10 thử thách chuyên sâu • 3 thử thách đã sẵn sàng, 7 thử thách sắp mở
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-300">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>Đã hoàn thành {answeredPartBCount}/3 khả dụng</span>
              </span>
            </div>
          </div>

          {/* Grid of 10 Questions (Part B) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRACTICE_QUESTIONS.map((q) => {
              const isAvailable = q.status === "available";
              const isAnswered =
                practiceState.answers[q.id] !== undefined &&
                practiceState.answers[q.id] !== "";

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border p-4 transition-all ${
                    isAvailable
                      ? isAnswered
                        ? "border-emerald-300 bg-emerald-50/40 hover:shadow-xs"
                        : "border-amber-200 bg-white hover:border-amber-400 hover:shadow-xs"
                      : "border-dashed border-slate-200 bg-slate-50/80 opacity-75"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-mono text-xs font-black ${
                          isAvailable ? "text-amber-900" : "text-slate-400"
                        }`}
                      >
                        {q.id}
                      </span>
                      {isAvailable ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-800 border border-emerald-300">
                          AVAILABLE
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                          <Lock className="h-2.5 w-2.5" /> COMING SOON
                        </span>
                      )}
                    </div>

                    {isAnswered && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Đã nộp
                      </span>
                    )}
                  </div>

                  <h4
                    className={`mt-2 text-sm font-black ${
                      isAvailable ? "text-slate-900" : "text-slate-500"
                    }`}
                  >
                    {q.title}
                  </h4>

                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                    {q.teachingPoint}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {q.skills.slice(0, 2).map((s) => (
                        <span
                          key={s}
                          className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                        >
                          {SKILLS_DICTIONARY[s]?.name || s}
                        </span>
                      ))}
                    </div>

                    {isAvailable ? (
                      <button
                        onClick={() => onNavigate(`/diagnostic/${q.id}`)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        <span>{isAnswered ? "Luyện lại" : "Thử sức"}</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Sắp mở</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 7 Core M2 Skills Display */}
      <div className="space-y-4 pt-4">
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
