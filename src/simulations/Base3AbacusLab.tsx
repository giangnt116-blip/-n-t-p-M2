import React, { useState } from "react";
import { Plus, RotateCcw, HelpCircle, Sparkles, AlertTriangle, Layers, Info } from "lucide-react";
import { QuestionMode } from "../types/question";

export interface Base3AbacusLabConfig {
  levels?: number;
  base?: number;
  maxDigit?: number;
}

interface Base3AbacusLabProps {
  config?: Record<string, unknown>;
  mode: QuestionMode;
}

export const Base3AbacusLab: React.FC<Base3AbacusLabProps> = ({ config, mode }) => {
  const levelsCount = typeof config?.levels === "number" ? config.levels : 4;
  const base = typeof config?.base === "number" ? config.base : 3;
  const maxDigit = typeof config?.maxDigit === "number" ? config.maxDigit : 2;

  // Maximum value before overflow: with 4 levels base 3 maxDigit 2:
  // 2*1 + 2*3 + 2*9 + 2*27 = 80
  const maxAllowedScore = Math.pow(base, levelsCount) - 1;

  const [score, setScore] = useState<number>(0);
  const [isOverflow, setIsOverflow] = useState<boolean>(false);
  const [carryAnimationLevel, setCarryAnimationLevel] = useState<number | null>(null);

  // Convert decimal score to base 3 digits (from level 0 = bottom to level 3 = top)
  const getDigits = (val: number): number[] => {
    const digits: number[] = [];
    let temp = val;
    for (let i = 0; i < levelsCount; i++) {
      digits.push(temp % base);
      temp = Math.floor(temp / base);
    }
    return digits;
  };

  const currentDigits = getDigits(score);

  // Add points handler
  const handleAdd = (amount: number) => {
    const nextScore = score + amount;
    if (nextScore > maxAllowedScore) {
      setIsOverflow(true);
      return;
    }
    setIsOverflow(false);

    // Detect if a carry will trigger on level 0
    if ((score % base) + amount >= base) {
      setCarryAnimationLevel(0);
      setTimeout(() => setCarryAnimationLevel(null), 700);
    }

    setScore(nextScore);
  };

  const handleReset = () => {
    setScore(0);
    setIsOverflow(false);
    setCarryAnimationLevel(null);
  };

  const handleSetMax = () => {
    setScore(maxAllowedScore);
    setIsOverflow(false);
  };

  // Level weights for Learn Mode
  const levelWeights = Array.from({ length: levelsCount }, (_, i) => Math.pow(base, i));

  return (
    <div className="space-y-6 rounded-2xl border border-indigo-100 bg-white p-5 shadow-xs sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Cỗ máy tính điểm cơ số {base}
            </h4>
            <p className="text-xs text-slate-500">
              {levelsCount} tầng hiển thị • Tối đa {maxDigit} hạt bên trái mỗi tầng
            </p>
          </div>
        </div>

        {/* Current Score Pill */}
        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/80 px-3.5 py-1.5 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
              Điểm hiện tại
            </span>
            <span className="text-lg font-black text-indigo-950">
              {score} {score === 1 ? "điểm" : "điểm"}
            </span>
          </div>
        </div>
      </div>

      {/* Overflow Alert */}
      {isOverflow && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-300 bg-rose-50 p-3.5 text-xs text-rose-800">
          <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
          <div>
            <strong>Cảnh báo quá tải!</strong> Vượt quá giới hạn hiển thị của cả {levelsCount} tầng ({maxAllowedScore} điểm). Cỗ máy bị tràn số.
          </div>
        </div>
      )}

      {/* Abacus Tracks (Rendered Top-down: Level 4 at top, Level 1 at bottom) */}
      <div className="space-y-3 rounded-2xl border-2 border-slate-200 bg-gradient-to-b from-slate-900 to-slate-950 p-5 text-white shadow-inner">
        <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase text-slate-400 border-b border-slate-800 pb-2">
          <span>← BÊN TRÁI (HẠT ĐÃ KÍCH HOẠT)</span>
          <span>BÊN PHẢI (HẠT CHỜ) →</span>
        </div>

        {Array.from({ length: levelsCount }, (_, idx) => {
          // idx 0 is top level (Level 4), idx 3 is bottom level (Level 1)
          const levelIndex = levelsCount - 1 - idx;
          const digit = currentDigits[levelIndex] ?? 0;
          const weight = levelWeights[levelIndex];
          const isCarrying = carryAnimationLevel === levelIndex;

          return (
            <div
              key={levelIndex}
              className={`relative rounded-xl border p-3 transition-all ${
                isCarrying
                  ? "border-amber-400 bg-amber-950/40"
                  : "border-slate-800 bg-slate-900/90"
              }`}
            >
              {/* Level label & value */}
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[11px] font-bold text-indigo-300">
                    Tầng {levelIndex + 1} {levelIndex === 0 ? "(dưới cùng)" : levelIndex === levelsCount - 1 ? "(trên cùng)" : ""}
                  </span>
                  {mode === "learn" && (
                    <span className="text-[11px] font-semibold text-emerald-400">
                      (1 hạt = {weight} điểm)
                    </span>
                  )}
                </div>

                <div className="font-mono text-xs font-bold text-slate-300">
                  {digit} hạt bên trái
                  {mode === "learn" && ` = ${digit * weight} điểm`}
                </div>
              </div>

              {/* Physical Rod with 3 beads */}
              <div className="relative flex h-10 w-full items-center justify-between rounded-lg bg-slate-950 px-4 ring-1 ring-slate-800">
                {/* Center Rod Line */}
                <div className="absolute inset-x-2 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-700/60" />

                {/* Left Side: Active Beads */}
                <div className="relative z-10 flex items-center gap-2">
                  {Array.from({ length: digit }, (_, beadIdx) => (
                    <div
                      key={`active-${beadIdx}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-indigo-300 bg-gradient-to-tr from-indigo-600 to-blue-400 shadow-md shadow-indigo-500/50 transition-all duration-300 active:scale-95"
                    >
                      <span className="text-[10px] font-black text-white">●</span>
                    </div>
                  ))}
                  {digit === 0 && (
                    <span className="text-[11px] italic text-slate-600">trống (0)</span>
                  )}
                </div>

                {/* Rod Divider marker */}
                <div className="relative z-10 h-6 w-0.5 bg-slate-600/40" />

                {/* Right Side: Inactive / Available Beads */}
                <div className="relative z-10 flex items-center gap-2">
                  {Array.from({ length: base - digit }, (_, beadIdx) => (
                    <div
                      key={`inactive-${beadIdx}`}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800/80 text-slate-500 transition-all opacity-40"
                      title="Hạt đang chờ ở bên phải"
                    >
                      <span className="text-[9px]">○</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleAdd(1)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition"
          >
            <Plus className="h-4 w-4" />
            <span>+1 điểm</span>
          </button>

          <button
            onClick={() => handleAdd(3)}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 active:scale-95 transition"
            title="Tăng 3 điểm (quan sát quy tắc nhớ)"
          >
            <span>+3 điểm</span>
          </button>

          <button
            onClick={() => handleAdd(9)}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 active:scale-95 transition"
            title="Tăng 9 điểm (quan sát quy tắc nhớ lên tầng 3)"
          >
            <span>+9 điểm</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Đặt lại (0)</span>
          </button>
        </div>

        {mode === "learn" && (
          <button
            onClick={handleSetMax}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Xem trạng thái tối đa ({maxAllowedScore} điểm)</span>
          </button>
        )}
      </div>

      {/* Micro-prompt in Challenge Mode */}
      {mode === "challenge" && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-amber-900">
          <HelpCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <span className="font-bold block">
              💡 Thử nghiệm & Khám phá:
            </span>
            <p className="leading-relaxed text-amber-800">
              Hãy bấm <strong>“+1 điểm”</strong> vài lần và chú ý quan sát:{" "}
              <em>“Điều gì xảy ra mỗi khi tầng dưới cùng nhận đủ 3 hạt?”</em> Khi đó, 1 hạt ở tầng 2 tương đương bao nhiêu điểm? Tầng 3 và tầng 4 thì sao?
            </p>
          </div>
        </div>
      )}

      {/* LEARN MODE: Mathematical Breakdown */}
      {mode === "learn" && (
        <div className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 text-slate-800">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-emerald-600" />
            <h5 className="text-sm font-extrabold text-emerald-950">
              Giải thích Chi tiết (Learn Mode): Bản chất Cơ số 3
            </h5>
          </div>

          <div className="grid gap-2 sm:grid-cols-4 text-xs">
            <div className="rounded-lg border border-emerald-100 bg-white p-3 text-center">
              <span className="font-bold text-slate-500 block">Tầng 1</span>
              <span className="text-sm font-black text-indigo-600">3⁰ = 1 điểm</span>
              <span className="text-[11px] text-slate-500 block mt-1">Tối đa 2 hạt = 2</span>
            </div>
            <div className="rounded-lg border border-emerald-100 bg-white p-3 text-center">
              <span className="font-bold text-slate-500 block">Tầng 2</span>
              <span className="text-sm font-black text-indigo-600">3¹ = 3 điểm</span>
              <span className="text-[11px] text-slate-500 block mt-1">Tối đa 2 hạt = 6</span>
            </div>
            <div className="rounded-lg border border-emerald-100 bg-white p-3 text-center">
              <span className="font-bold text-slate-500 block">Tầng 3</span>
              <span className="text-sm font-black text-indigo-600">3² = 9 điểm</span>
              <span className="text-[11px] text-slate-500 block mt-1">Tối đa 2 hạt = 18</span>
            </div>
            <div className="rounded-lg border border-emerald-100 bg-white p-3 text-center">
              <span className="font-bold text-slate-500 block">Tầng 4</span>
              <span className="text-sm font-black text-indigo-600">3³ = 27 điểm</span>
              <span className="text-[11px] text-slate-500 block mt-1">Tối đa 2 hạt = 54</span>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-white p-4 text-xs space-y-2 leading-relaxed">
            <p>
              • <strong>Trước khi cỗ máy bị tràn số</strong>, mỗi tầng có thể chứa nhiều nhất <strong>2 hạt</strong> bên trái (vì khi có 3 hạt sẽ tự động carry 1 hạt lên tầng kế tiếp).
            </p>
            <p>
              • Số điểm lớn nhất hiển thị được khi cả 4 tầng đều đạt tối đa 2 hạt:
            </p>
            <div className="rounded-lg bg-slate-50 p-2.5 font-mono font-bold text-center text-indigo-900 sm:text-sm">
              Tổng điểm = 2×1 + 2×3 + 2×9 + 2×27 = 2 + 6 + 18 + 54 = 80 điểm.
            </div>
            <p className="text-slate-500 italic text-[11px]">
              (Quy tắc nhanh: Trong cơ số 3 với 4 chữ số, giá trị lớn nhất là 3⁴ - 1 = 81 - 1 = 80).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
