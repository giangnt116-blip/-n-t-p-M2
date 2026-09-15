import React from "react";
import { Brain, ArrowRight } from "lucide-react";

export const Footer: React.FC = () => {
  const learningSteps = [
    { label: "QUAN SÁT", emoji: "👀" },
    { label: "THỬ", emoji: "🧪" },
    { label: "DỰ ĐOÁN", emoji: "💡" },
    { label: "KIỂM CHỨNG", emoji: "🎯" },
    { label: "GIẢI THÍCH", emoji: "🗣️" },
    { label: "RÚT RA QUY LUẬT", emoji: "📜" },
  ];

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      {/* Learning philosophy banner */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-6 px-4">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">
            Triết lý học tập tư duy M2
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold sm:gap-3">
            {learningSteps.map((step, idx) => (
              <React.Fragment key={step.label}>
                <span className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3 py-1.5 text-slate-200 ring-1 ring-slate-700">
                  <span>{step.emoji}</span>
                  <span>{step.label}</span>
                </span>
                {idx < learningSteps.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-indigo-500/70" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer info */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-white">M2 LOGIC LAB</p>
              <p className="text-xs text-slate-400">
                Học tư duy bằng mô phỏng – Chinh phục M2 từng bước
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Dành cho học sinh lớp 6 khởi đầu lộ trình tư duy logic, tổ hợp & thuật toán.
          </div>
        </div>
      </div>
    </footer>
  );
};
