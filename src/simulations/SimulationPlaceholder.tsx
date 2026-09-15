import React from "react";
import { Sparkles, Terminal, FlaskConical, Cpu, Layers } from "lucide-react";
import { QuestionSimulation } from "../types/question";

interface SimulationPlaceholderProps {
  simulation?: QuestionSimulation;
  questionTitle?: string;
  className?: string;
}

export const SimulationPlaceholder: React.FC<SimulationPlaceholderProps> = ({
  simulation,
  questionTitle,
  className = "",
}) => {
  const simType = simulation?.type || "genericLab";
  const simName = simulation?.name || "Mô phỏng Tương tác";

  return (
    <div
      id="simulation-placeholder"
      className={`relative overflow-hidden rounded-2xl border-2 border-indigo-100 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-md transition-all ${className}`}
    >
      {/* Background STEM grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #818cf8 1px, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* Header Badges */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-indigo-400/40">
            <span className="text-base">🎮</span> MÔ PHỎNG TƯƠNG TÁC
          </span>
          <span
            id="simulation-type-badge"
            className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-3 py-1 font-mono text-xs font-bold text-cyan-300 ring-1 ring-cyan-400/40"
          >
            <Terminal className="h-3.5 w-3.5" />
            {simType}
          </span>
        </div>

        {/* Lab Icon with Pulse Halo */}
        <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/30 ring-1 ring-indigo-400/30">
          <FlaskConical className="h-8 w-8 text-indigo-300" />
          <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[10px] text-slate-950">
            <Sparkles className="h-2.5 w-2.5" />
          </div>
        </div>

        {/* Title and message */}
        <h3 className="mb-1 text-lg font-bold tracking-tight text-white sm:text-xl">
          {simName}
        </h3>
        <p className="mb-4 text-xs text-indigo-200/80 sm:text-sm">
          {questionTitle ? `Chuyên đề: ${questionTitle}` : "Không gian khám phá giả định & trực quan hóa thuật toán"}
        </p>

        {/* Coming soon notice */}
        <div className="flex max-w-md items-center gap-2.5 rounded-xl border border-indigo-400/30 bg-indigo-950/60 px-4 py-2.5 text-xs text-indigo-200">
          <Cpu className="h-4 w-4 shrink-0 text-cyan-400" />
          <span className="text-left leading-relaxed">
            Mô phỏng này sẽ được mở ở <strong>checkpoint tiếp theo</strong> để em trực tiếp kéo thả và thử nghiệm!
          </span>
        </div>

        {/* Config peek (Engine + Data architecture demonstration) */}
        {simulation?.config && (
          <div className="mt-4 w-full max-w-lg rounded-lg border border-slate-700 bg-slate-950/70 p-3 text-left">
            <div className="mb-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Layers className="h-3 w-3 text-indigo-400" /> Config Engine Specs
              </span>
              <span className="text-emerald-400">Ready for mount</span>
            </div>
            <pre className="max-h-24 overflow-x-auto font-mono text-[11px] text-indigo-300/90 scrollbar-thin">
              {JSON.stringify(simulation.config, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
