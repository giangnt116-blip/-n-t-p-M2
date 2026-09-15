import React, { useState, useMemo } from "react";
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Trophy,
  RotateCcw,
  Sparkles,
  Info,
  ArrowRight,
} from "lucide-react";

interface WindowOptimizationLabProps {
  mode: "challenge" | "learn";
  config?: any;
}

export const WindowOptimizationLab: React.FC<WindowOptimizationLabProps> = ({
  mode,
  config,
}) => {
  const totalDays = (config?.days as number) || 23;
  const minimumPerDay = (config?.minimumPerDay as number) ?? 4;
  const windowSize = (config?.windowSize as number) || 5;
  const windowLimit = (config?.windowLimit as number) || 50;

  // Array of nuts for each day: Day 1..23 (index 0..22)
  // Initialized to minimum 4 nuts per day
  const [dayValues, setDayValues] = useState<number[]>(() =>
    Array(totalDays).fill(minimumPerDay)
  );

  // Active sliding window start index (0 .. totalDays - windowSize)
  // 0 corresponds to Days 1..5
  const [activeWindowStart, setActiveWindowStart] = useState<number>(0);

  // Challenge mode record
  const [bestSum, setBestSum] = useState<number | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Learn mode step
  const [learnStep, setLearnStep] = useState<1 | 2 | 3 | 4>(1);

  // Calculate sum of each 5-day window
  const totalWindows = totalDays - windowSize + 1; // 19 windows
  const windowSums = useMemo(() => {
    const sums: { start: number; sum: number; isOver: boolean }[] = [];
    for (let i = 0; i <= totalDays - windowSize; i++) {
      let s = 0;
      for (let j = 0; j < windowSize; j++) {
        s += dayValues[i + j];
      }
      sums.push({
        start: i,
        sum: s,
        isOver: s > windowLimit,
      });
    }
    return sums;
  }, [dayValues, totalDays, windowSize, windowLimit]);

  const violatedWindows = windowSums.filter((w) => w.isOver);
  const isAllValid =
    violatedWindows.length === 0 && dayValues.every((v) => v >= minimumPerDay);

  const currentTotal = dayValues.reduce((acc, v) => acc + v, 0);

  // Active window details
  const activeWindowEnd = activeWindowStart + windowSize - 1;
  const activeWindowSum = windowSums[activeWindowStart]?.sum || 0;
  const isActiveWindowOver = activeWindowSum > windowLimit;

  // Day value modifier
  const handleUpdateDay = (index: number, delta: number) => {
    setDayValues((prev) => {
      const nextVal = Math.max(minimumPerDay, prev[index] + delta);
      const updated = [...prev];
      updated[index] = nextVal;
      return updated;
    });
    setSaveFeedback(null);
  };

  const handleSetDayExact = (index: number, val: number) => {
    setDayValues((prev) => {
      const updated = [...prev];
      updated[index] = Math.max(minimumPerDay, val);
      return updated;
    });
    setSaveFeedback(null);
  };

  const handleReset = () => {
    setDayValues(Array(totalDays).fill(minimumPerDay));
    setActiveWindowStart(0);
    setSaveFeedback(null);
  };

  // Save Record
  const handleSaveRecord = () => {
    if (!isAllValid) {
      setSaveFeedback("Hiện tại có đoạn 5 ngày bị vượt quá 50 hạt, chưa thể lưu kỷ lục!");
      return;
    }
    setBestSum((prev) => (prev === null ? currentTotal : Math.max(prev, currentTotal)));
    setSaveFeedback(`🎉 Tuyệt vời! Đã lưu kỷ lục thành tích: ${currentTotal} hạt!`);
  };

  // Apply Sample Optimal 242 Pattern for Learn Mode
  const handleApplyOptimalPattern = () => {
    // Pattern [34, 4, 4, 4, 4] repeated for 23 days
    const pattern = Array.from({ length: totalDays }, (_, idx) =>
      idx % 5 === 0 ? 34 : 4
    );
    setDayValues(pattern);
    setActiveWindowStart(0);
  };

  return (
    <div className="space-y-6 rounded-2xl border border-indigo-100 bg-white p-5 shadow-xs sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Phòng Thí Nghiệm Cửa Sổ Trượt (23 Ngày Nhặt Hạt Dẻ)
            </h3>
            <p className="text-xs text-slate-500">
              Mỗi ngày ít nhất 4 hạt • Bất kỳ 5 ngày liên tiếp nào cũng không vượt quá 50 hạt
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Đặt lại (4 hạt/ngày)</span>
        </button>
      </div>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total nuts */}
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-3.5 text-center">
          <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
            Tổng hạt (23 ngày)
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-black text-indigo-950">
            {currentTotal}
          </span>
        </div>

        {/* Active Window Sum */}
        <div
          className={`rounded-2xl border p-3.5 text-center ${
            isActiveWindowOver
              ? "border-rose-300 bg-rose-50 text-rose-900"
              : "border-slate-200 bg-white text-slate-800"
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block">
            Ngày {activeWindowStart + 1}–{activeWindowEnd + 1}
          </span>
          <div className="flex items-baseline justify-center gap-1">
            <span
              className={`font-mono text-2xl font-black ${
                isActiveWindowOver ? "text-rose-600" : "text-slate-900"
              }`}
            >
              {activeWindowSum}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 50</span>
          </div>
        </div>

        {/* Global Validity Status */}
        <div
          className={`rounded-2xl border p-3.5 text-center ${
            isAllValid
              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
              : "border-amber-300 bg-amber-50 text-amber-900"
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block">
            19 Cửa sổ 5 ngày
          </span>
          <span className="text-xs font-bold block mt-1">
            {isAllValid ? (
              <span className="flex items-center justify-center gap-1 text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> ✅ Hợp lệ
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1 text-rose-700">
                <AlertTriangle className="h-4 w-4" /> {violatedWindows.length} đoạn vi phạm
              </span>
            )}
          </span>
        </div>

        {/* Best Record */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 text-center">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            Kỷ lục của em
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-black text-amber-900">
            {bestSum !== null ? `${bestSum}` : "—"}
          </span>
        </div>
      </div>

      {/* Sliding Window Navigator Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-bold">
            Soi cửa sổ: Ngày <strong>{activeWindowStart + 1}</strong> đến Ngày{" "}
            <strong>{activeWindowEnd + 1}</strong> (Tổng:{" "}
            <strong className={isActiveWindowOver ? "text-rose-400" : "text-amber-300"}>
              {activeWindowSum}/50
            </strong>
            )
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled={activeWindowStart <= 0}
            onClick={() => setActiveWindowStart((p) => Math.max(0, p - 1))}
            className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-200 hover:bg-slate-700 disabled:opacity-40 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>← Trượt lùi</span>
          </button>

          <span className="text-[11px] font-mono text-slate-400 px-1">
            {activeWindowStart + 1} / {totalWindows}
          </span>

          <button
            disabled={activeWindowStart >= totalWindows - 1}
            onClick={() => setActiveWindowStart((p) => Math.min(totalWindows - 1, p + 1))}
            className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-200 hover:bg-slate-700 disabled:opacity-40 transition"
          >
            <span>Trượt tới →</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Violation Alert Banner */}
      {violatedWindows.length > 0 && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-900 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block">Phát hiện cửa sổ 5 ngày vượt quá 50 hạt!</strong>
            <p className="mt-0.5 text-rose-800">
              Ví dụ: Đoạn từ Ngày {violatedWindows[0].start + 1} đến Ngày{" "}
              {violatedWindows[0].start + windowSize} đang có tổng là{" "}
              <strong>{violatedWindows[0].sum} hạt</strong> (&gt; 50). Hãy giảm bớt hạt ở các ngày này.
            </p>
          </div>
        </div>
      )}

      {/* Timeline 23 Days Grid */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700">
          Dòng thời gian 23 ngày (Nhấn + / - để điều chỉnh số hạt nhặt):
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {dayValues.map((val, idx) => {
            const isInsideActiveWindow =
              idx >= activeWindowStart && idx <= activeWindowEnd;

            // Check if this day is part of any violated window
            const isInViolated = violatedWindows.some(
              (w) => idx >= w.start && idx < w.start + windowSize
            );

            let cardStyle = "border-slate-200 bg-white";
            if (isInViolated && isInsideActiveWindow) {
              cardStyle = "border-rose-400 bg-rose-50 ring-2 ring-rose-300";
            } else if (isInsideActiveWindow) {
              cardStyle = "border-amber-400 bg-amber-50/80 ring-2 ring-amber-300";
            } else if (isInViolated) {
              cardStyle = "border-rose-200 bg-rose-50/40";
            }

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-between rounded-xl border p-2 text-center transition-all ${cardStyle}`}
              >
                <div className="flex w-full items-center justify-between text-[10px] font-bold text-slate-400">
                  <span>N{idx + 1}</span>
                  {isInsideActiveWindow && (
                    <span className="text-amber-700 font-extrabold text-[9px] bg-amber-200/70 px-1 rounded">
                      Cửa sổ
                    </span>
                  )}
                </div>

                <div className="my-1 text-lg font-black text-slate-900 font-mono">
                  {val}
                </div>

                {/* +/- Controls */}
                <div className="flex items-center gap-1 w-full justify-center">
                  <button
                    disabled={val <= minimumPerDay}
                    onClick={() => handleUpdateDay(idx, -1)}
                    className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-300 bg-white text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                    title="Giảm 1 hạt"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleUpdateDay(idx, +1)}
                    className="flex h-6 w-6 items-center justify-center rounded-md border border-indigo-300 bg-indigo-50 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
                    title="Tăng 1 hạt"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleUpdateDay(idx, +5)}
                    className="flex h-6 px-1 items-center justify-center rounded-md border border-slate-200 bg-white text-[9px] font-bold text-slate-500 hover:bg-slate-50"
                    title="Tăng nhanh 5 hạt"
                  >
                    +5
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons in Challenge Mode */}
      {mode === "challenge" && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-800">
                Thử thách tối ưu hóa tổng số hạt:
              </span>
              <p className="text-[11px] text-slate-500">
                Hãy tìm cách phân phối hạt để tổng cả 23 ngày đạt giá trị lớn nhất mà không vi phạm quy tắc!
              </p>
            </div>

            <button
              onClick={handleSaveRecord}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-black text-white hover:bg-amber-600 active:scale-95 transition shadow-xs"
            >
              <Trophy className="h-4 w-4" />
              <span>Lưu kỷ lục của em</span>
            </button>
          </div>

          {saveFeedback && (
            <p
              className={`text-xs font-semibold p-2.5 rounded-xl border ${
                saveFeedback.startsWith("🎉")
                  ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                  : "bg-rose-50 text-rose-900 border-rose-200"
              }`}
            >
              {saveFeedback}
            </p>
          )}
        </div>
      )}

      {/* LEARN MODE SECTION */}
      {mode === "learn" && (
        <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-b from-indigo-50/50 to-white p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-xs">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>Chứng minh Toán học &amp; Cận trên (Dành cho Lớp 6)</span>
            </div>

            <button
              onClick={handleApplyOptimalPattern}
              className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-2xs"
            >
              ⚡ Nạp phương án tối ưu (242 hạt)
            </button>
          </div>

          {/* Step Selector */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((step) => (
              <button
                key={step}
                onClick={() => setLearnStep(step as 1 | 2 | 3 | 4)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                  learnStep === step
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                Bước {step}
              </button>
            ))}
          </div>

          {learnStep === 1 && (
            <div className="text-xs text-slate-700 space-y-2 bg-white p-3.5 rounded-xl border border-indigo-100">
              <strong className="text-indigo-900 block text-sm">
                Bước 1: Nhóm các đoạn 5 ngày không giao nhau
              </strong>
              <p>
                Dãy 23 ngày có thể chia thành 4 nhóm 5 ngày đầu tiên cộng với 3 ngày cuối:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Nhóm 1 (Ngày 1–5): tổng $\le 50$</li>
                <li>Nhóm 2 (Ngày 6–10): tổng $\le 50$</li>
                <li>Nhóm 3 (Ngày 11–15): tổng $\le 50$</li>
                <li>Nhóm 4 (Ngày 16–20): tổng $\le 50$</li>
              </ul>
              <p className="font-mono text-indigo-800 font-bold bg-indigo-50 p-2 rounded-lg">
                → Tổng 20 ngày đầu $\le 4 \times 50 = 200$ hạt.
              </p>
            </div>
          )}

          {learnStep === 2 && (
            <div className="text-xs text-slate-700 space-y-2 bg-white p-3.5 rounded-xl border border-indigo-100">
              <strong className="text-indigo-900 block text-sm">
                Bước 2: Tìm cận trên cho 3 ngày cuối cùng (Ngày 21, 22, 23)
              </strong>
              <p>
                Ta xét cửa sổ 5 ngày liên tiếp cuối cùng: <strong>Ngày 19, 20, 21, 22, 23</strong>.
              </p>
              <p>
                Theo đề bài, tổng 5 ngày này không vượt quá 50 hạt:
              </p>
              <p className="font-mono text-slate-800 font-semibold">
                (Ngày 19) + (Ngày 20) + (Ngày 21 + Ngày 22 + Ngày 23) $\le 50$.
              </p>
              <p>
                Vì mỗi ngày Sóc đều nhặt <strong>ít nhất 4 hạt</strong>, nên Ngày 19 $\ge 4$ và Ngày 20 $\ge 4$.
              </p>
              <p className="font-mono text-indigo-800 font-bold bg-indigo-50 p-2 rounded-lg">
                → (Ngày 21 + Ngày 22 + Ngày 23) $\le 50 - 4 - 4 = 42$ hạt!
              </p>
            </div>
          )}

          {learnStep === 3 && (
            <div className="text-xs text-slate-700 space-y-2 bg-white p-3.5 rounded-xl border border-indigo-100">
              <strong className="text-indigo-900 block text-sm">
                Bước 3: Xác lập Cận trên tối đa của 23 ngày
              </strong>
              <p>
                Cộng tổng 20 ngày đầu và 3 ngày cuối lại:
              </p>
              <p className="font-mono text-base font-black text-indigo-900 bg-indigo-100/70 p-2.5 rounded-xl text-center">
                Tổng 23 ngày $\le 200 + 42 = 242$ hạt.
              </p>
              <p className="text-slate-600">
                Để khẳng định số hạt nhiều nhất là 242, ta chỉ cần chỉ ra <strong>một cách xếp cụ thể</strong> thỏa mãn mọi điều kiện mà đạt đúng 242 hạt!
              </p>
            </div>
          )}

          {learnStep === 4 && (
            <div className="text-xs text-slate-700 space-y-2.5 bg-white p-3.5 rounded-xl border border-indigo-100">
              <strong className="text-indigo-900 block text-sm">
                Bước 4: Cấu hình tối ưu chu kỳ 5 ngày &amp; Khái niệm Tin học
              </strong>
              <p>
                Thiết lập quy luật chu kỳ 5 ngày: <span className="font-mono font-bold text-amber-700">[34, 4, 4, 4, 4]</span> lặp lại:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Các ngày 1, 6, 11, 16, 21: nhặt <strong>34 hạt</strong> (5 ngày).</li>
                <li>Tất cả 18 ngày còn lại: nhặt <strong>4 hạt</strong>.</li>
              </ul>
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2 text-emerald-950 font-bold">
                Mọi đoạn 5 ngày liên tiếp đều chứa đúng một ngày 34 và bốn ngày 4 → Tổng = 34 + 4×4 = 50 ≤ 50!
                <br />
                Tổng 23 ngày = 5 × 34 + 18 × 4 = 170 + 72 = <strong>242 hạt</strong>.
              </div>

              {/* Computer Science Insight */}
              <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-3 text-purple-950 space-y-1 mt-2">
                <span className="font-extrabold text-xs text-purple-900 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-purple-700" />
                  Mở rộng Tin học:
                </span>
                <p className="text-[11px] leading-relaxed text-purple-900">
                  “Trong Tin học, cách quan sát một đoạn liên tiếp có độ dài cố định thường được gọi là <strong>cửa sổ trượt – sliding window</strong>. Thuật toán này giúp kiểm soát dữ liệu liên tục mà không cần tính toán lại từ đầu.”
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
