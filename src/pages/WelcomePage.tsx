import React from "react";
import {
  Brain,
  Rocket,
  Compass,
  Sparkles,
  PlayCircle,
  FlaskConical,
  Target,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { loadDiagnosticState } from "../utils/storage";

interface WelcomePageProps {
  onNavigate: (path: string) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onNavigate }) => {
  const state = loadDiagnosticState();
  const answeredCount = Object.keys(state.answers).length;

  const keyPoints = [
    {
      icon: "🎯",
      title: "12 thử thách khởi động",
      desc: "Được thiết kế chuẩn cấu trúc tư duy M2 nhằm đánh giá toàn diện năng lực xuất phát.",
    },
    {
      icon: "💻",
      title: "Không cần biết lập trình",
      desc: "Tập trung thuần túy vào tư duy thuật toán, nhận diện mô hình và logic rẽ nhánh.",
    },
    {
      icon: "📐",
      title: "Không cần học thuộc công thức",
      desc: "Tự tay em tìm ra lời giải thông qua trực giác hình học và thử nghiệm số học.",
    },
    {
      icon: "💡",
      title: "Quan sát – Thử nghiệm – Suy luận",
      desc: "Học cách đặt giả thuyết, kiểm chứng thực tế và giải thích vì sao một chiến thuật luôn thắng.",
    },
  ];

  const studentActions = [
    { emoji: "🧪", text: "Thử nghiệm" },
    { emoji: "🖐️", text: "Kéo thả" },
    { emoji: "🎮", text: "Chạy mô phỏng" },
    { emoji: "🔍", text: "Phát hiện quy luật" },
    { emoji: "🗣️", text: "Giải thích vì sao" },
  ];

  return (
    <div className="space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-b from-indigo-50/70 via-white to-sky-50/50 p-8 sm:p-12 lg:p-16 text-center shadow-sm">
        {/* Decorative background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(#6366f1 0.75px, transparent 0.75px)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/90 px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-2xs backdrop-blur-xs">
            <span className="text-base">🧠</span>
            <span>KHÓA HUẤN LUYỆN TƯ DUY LỚP 6</span>
            <span className="h-1 w-1 rounded-full bg-indigo-400" />
            <span className="text-slate-500 font-medium">Bản khởi động</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            M2 LOGIC LAB
          </h1>

          {/* Subtitle */}
          <p className="text-lg font-bold text-indigo-700 sm:text-xl md:text-2xl">
            “Học tư duy bằng mô phỏng – Chinh phục M2 từng bước”
          </p>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Chào mừng em đến với không gian trải nghiệm tư duy logic hiện đại. Tại đây, em không học vẹt lý thuyết mà sẽ trực tiếp khám phá các quy luật bí ẩn đằng sau các bài toán M2 hàng đầu.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={() => onNavigate("/diagnostic")}
              className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 px-8 py-4 text-base font-extrabold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition"
            >
              <Rocket className="h-5 w-5 text-amber-300" />
              <span>{answeredCount > 0 ? "TIẾP TỤC THỬ THÁCH" : "🚀 BẮT ĐẦU KHÁM PHÁ"}</span>
            </button>

            <button
              onClick={() => onNavigate("/course")}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-4 text-sm font-bold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-95 transition"
            >
              <Compass className="h-4 w-4 text-indigo-600" />
              <span>Xem lộ trình 12 tuần</span>
            </button>
          </div>

          {answeredCount > 0 && (
            <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full py-1.5 px-4 inline-block">
              ✓ Em đã lưu tiến trình {answeredCount}/12 câu trên thiết bị này.
            </p>
          )}
        </div>
      </section>

      {/* PHILOSOPHY & WHAT YOU DO */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xs space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Trải nghiệm học tập khác biệt
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl mt-1">
            Ở M2 Logic Lab, em sẽ không chỉ chọn đáp án!
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Mỗi bài toán là một tình huống mô phỏng sống động. Em sẽ chủ động thao tác để tự mình thấu hiểu bản chất:
          </p>
        </div>

        {/* Action pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {studentActions.map((act) => (
            <div
              key={act.text}
              className="flex items-center gap-2.5 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 transition hover:bg-indigo-100/50 hover:border-indigo-200"
            >
              <span className="text-2xl">{act.emoji}</span>
              <span className="font-bold text-xs sm:text-sm text-slate-800">{act.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4 CORE PROMISES */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
            Bốn nguyên tắc khởi đầu vững chắc
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Không tạo áp lực điểm số, tập trung mở rộng năng lực tư duy tự nhiên
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {keyPoints.map((point) => (
            <div
              key={point.title}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs transition hover:border-indigo-300 hover:shadow-xs"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                {point.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">{point.title}</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                  {point.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROADMAP PREVIEW CARD */}
      <section className="rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-r from-indigo-900 to-slate-900 p-8 sm:p-10 text-white shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="rounded-full bg-indigo-500/30 px-3 py-1 text-xs font-bold text-indigo-300">
              MODULE 0 • ÔN TẬP ĐẦU VÀO
            </span>
            <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
              Sẵn sàng làm bài khảo sát 12 câu?
            </h3>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
              Khoảng 45–60 phút khám phá giúp phát hiện điểm mạnh và các kỹ năng cần bổ trợ trước khi bước vào 12 tuần huấn luyện chuyên sâu.
            </p>
          </div>

          <button
            onClick={() => onNavigate("/diagnostic")}
            className="shrink-0 flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-extrabold text-indigo-950 shadow-md hover:bg-indigo-50 active:scale-95 transition"
          >
            <span>Vào thử thách ngay</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
