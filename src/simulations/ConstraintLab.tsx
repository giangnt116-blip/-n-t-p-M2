import React, { useState, useMemo } from "react";
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Trophy,
  Sliders,
  ChevronRight,
  TrendingUp,
  Lightbulb,
  Search,
  BookOpen,
} from "lucide-react";
import { QuestionMode } from "../types/question";
import {
  ConstraintLabConfig,
  calculateSum,
  checkConstraint,
  getSortedBreakdown,
} from "../utils/constraintUtils";

interface ConstraintLabProps {
  config?: ConstraintLabConfig;
  mode: QuestionMode;
}

export const ConstraintLab: React.FC<ConstraintLabProps> = ({ config, mode }) => {
  const count = config?.count ?? 10;
  const minValue = config?.minValue ?? 1;
  const k = config?.constraint?.k ?? 3;
  const limit = config?.constraint?.limit ?? 14;

  // State: 10 numbers initialized to minValue (all 1)
  const [numbers, setNumbers] = useState<number[]>(() =>
    Array(count).fill(minValue)
  );

  // Challenge Mode State: best valid sum record found by student
  const [bestValidSum, setBestValidSum] = useState<number | null>(null);
  const [hasSavedRecord, setHasSavedRecord] = useState<boolean>(false);

  // Validation feedback state (triggered by user "Kiểm tra" or interactive toggle)
  const [checkTriggered, setCheckTriggered] = useState<boolean>(false);

  // Learn Mode Progressive Steps (0 = hidden, 1 = Step 1, 2 = Step 2, 3 = Step 3)
  const [learnStep, setLearnStep] = useState<number>(mode === "learn" ? 1 : 0);

  // Derived current evaluation
  const evaluation = useMemo(() => {
    return checkConstraint(numbers, config?.constraint);
  }, [numbers, config?.constraint]);

  const currentSum = useMemo(() => calculateSum(numbers), [numbers]);

  // Handlers for adjusting individual number
  const handleIncrease = (index: number) => {
    setNumbers((prev) => {
      const next = [...prev];
      next[index] = next[index] + 1;
      return next;
    });
    setCheckTriggered(false);
    setHasSavedRecord(false);
  };

  const handleDecrease = (index: number) => {
    setNumbers((prev) => {
      if (prev[index] <= minValue) return prev;
      const next = [...prev];
      next[index] = next[index] - 1;
      return next;
    });
    setCheckTriggered(false);
    setHasSavedRecord(false);
  };

  const handleCheck = () => {
    setCheckTriggered(true);
  };

  const handleSaveRecord = () => {
    if (evaluation.valid) {
      if (bestValidSum === null || currentSum > bestValidSum) {
        setBestValidSum(currentSum);
      }
      setHasSavedRecord(true);
    }
  };

  const handleReset = () => {
    setNumbers(Array(count).fill(minValue));
    setCheckTriggered(false);
    setHasSavedRecord(false);
  };

  // Preset loader for Learn Mode
  const handleLoadSample = (sampleValues: number[]) => {
    setNumbers([...sampleValues]);
    setCheckTriggered(true);
  };

  // Sorted list for Learn Mode Step 1
  const sortedInfo = useMemo(() => {
    return getSortedBreakdown(numbers);
  }, [numbers]);

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-slate-50/70 to-white p-5 shadow-xs space-y-5">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mô phỏng tương tác
              </span>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-700">
                constraintLab
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Mười số bí mật & Tối ưu hóa Ràng buộc
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {mode === "learn" && (
            <button
              onClick={() => setLearnStep(learnStep > 0 ? 0 : 1)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                learnStep > 0
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              <span>{learnStep > 0 ? "Ẩn phân tích" : "🔍 Khám phá tối ưu"}</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition shadow-2xs"
            title="Đưa 10 số về giá trị nhỏ nhất"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>↺ Đặt lại</span>
          </button>
        </div>
      </div>

      {/* STATS & SCOREBOARD BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Current Sum */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Tổng hiện tại (10 số)
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-indigo-700 font-mono">
              {currentSum}
            </span>
            <span className="text-xs font-bold text-slate-400">đơn vị</span>
          </div>
        </div>

        {/* Current Constraint Status */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Trạng thái ràng buộc
          </div>
          <div className="flex items-center gap-1.5 text-xs font-extrabold">
            {evaluation.valid ? (
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ✅ Hợp lệ (Mọi bộ 3 số ≤ {limit})
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-700">
                <AlertCircle className="h-4 w-4 text-rose-600" />
                ❌ Vi phạm ràng buộc
              </span>
            )}
          </div>
        </div>

        {/* Student Personal Record (Best Valid Sum) */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Kỷ lục hợp lệ của em
          </div>
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-700">
            <Trophy className="h-4 w-4 text-amber-600" />
            {bestValidSum !== null ? (
              <span className="font-mono text-base font-black text-amber-800">
                {bestValidSum}
              </span>
            ) : (
              <span className="text-slate-400 font-normal">Chưa lưu kỷ lục</span>
            )}
          </div>
        </div>
      </div>

      {/* RULE SUMMARY BOX */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700 space-y-1">
        <div className="flex items-center justify-between font-bold text-slate-800">
          <span>🎯 Mục tiêu: Làm tổng 10 số càng lớn càng tốt.</span>
          <span className="font-mono text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            Ràng buộc: Bất kỳ {k} số nào có tổng ≤ {limit}
          </span>
        </div>
        <p className="text-slate-500 text-[11px]">
          Các số nguyên dương (≥ {minValue}). Bấm nút <strong>[+]</strong> hoặc <strong>[-]</strong> ở mỗi ô để điều chỉnh giá trị, sau đó bấm <strong>&ldquo;Kiểm tra&rdquo;</strong> và <strong>&ldquo;Lưu kỷ lục&rdquo;</strong>.
        </p>
      </div>

      {/* 10 NUMBER BOXES (RESPONSIVE GRID: 2 rows of 5 on desktop, 5 cols / 2 cols on mobile) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span>Danh sách 10 ô số:</span>
          <span className="text-[11px] text-slate-400 font-normal">
            {!evaluation.valid && evaluation.violatingIndices && (
              <span className="text-rose-600 font-bold">
                ⚠️ Ô màu đỏ nằm trong bộ 3 số gây vi phạm
              </span>
            )}
          </span>
        </div>

        {/* Interactive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {numbers.map((val, idx) => {
            const isViolating =
              !evaluation.valid &&
              evaluation.violatingIndices &&
              evaluation.violatingIndices.includes(idx);

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-between rounded-xl border-2 p-3 transition-all ${
                  isViolating
                    ? "border-rose-400 bg-rose-50/70 ring-2 ring-rose-200"
                    : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
                }`}
              >
                {/* Index label */}
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Số thứ {idx + 1}
                </span>

                {/* Big number display */}
                <div
                  className={`font-mono text-2xl sm:text-3xl font-black py-1 ${
                    isViolating ? "text-rose-700" : "text-slate-800"
                  }`}
                >
                  {val}
                </div>

                {/* Control buttons */}
                <div className="flex items-center gap-2 mt-2 w-full justify-center">
                  <button
                    onClick={() => handleDecrease(idx)}
                    disabled={val <= minValue}
                    aria-label={`Giảm số thứ ${idx + 1}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-2xs hover:bg-slate-100 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => handleIncrease(idx)}
                    aria-label={`Tăng số thứ ${idx + 1}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ACTION BUTTONS & FEEDBACK PANEL */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCheck}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Kiểm tra</span>
            </button>

            <button
              onClick={handleSaveRecord}
              disabled={!evaluation.valid}
              className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900 shadow-2xs hover:bg-amber-100 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              <Trophy className="h-3.5 w-3.5 text-amber-600" />
              <span>Lưu kỷ lục</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            {hasSavedRecord && (
              <span className="text-emerald-700 font-bold">
                ✓ Đã cập nhật kỷ lục mới: {currentSum}!
              </span>
            )}
          </div>
        </div>

        {/* Feedback alert after click or active violation */}
        {(checkTriggered || !evaluation.valid) && (
          <div className="pt-1">
            {evaluation.valid ? (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-900 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  ✅ Phương án này thỏa điều kiện! (Tổng hiện tại = {currentSum}). Hãy thử tăng tiếp xem có lập được kỷ lục cao hơn không!
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-900 animate-in fade-in">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>
                  ❌ Có ít nhất một bộ ba vượt quá {limit}: bộ ba [{evaluation.violatingValues?.join(" + ")}] có tổng là <strong>{evaluation.violatingSum} &gt; {limit}</strong>!
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* LEARN MODE: STEP-BY-STEP PROGRESSION ACCORDION / WORKFLOW */}
      {mode === "learn" && learnStep > 0 && (
        <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="flex items-center justify-between border-b border-emerald-200/70 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Phương pháp phân tích & Chứng minh Tối ưu</span>
            </div>

            {/* Step navigation tabs */}
            <div className="flex items-center gap-1 text-[11px] font-bold">
              <button
                onClick={() => setLearnStep(1)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  learnStep === 1
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-slate-700 hover:bg-emerald-100/60 border border-emerald-200"
                }`}
              >
                Bước 1: Ràng buộc cốt lõi
              </button>
              <button
                onClick={() => setLearnStep(2)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  learnStep === 2
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-slate-700 hover:bg-emerald-100/60 border border-emerald-200"
                }`}
              >
                Bước 2: Giới hạn trên
              </button>
              <button
                onClick={() => setLearnStep(3)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  learnStep === 3
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-slate-700 hover:bg-emerald-100/60 border border-emerald-200"
                }`}
              >
                Bước 3: Chỉ ra phương án
              </button>
            </div>
          </div>

          {/* STEP 1: Điều gì quyết định ràng buộc? */}
          {learnStep === 1 && (
            <div className="space-y-3 rounded-xl border border-emerald-300 bg-white p-4 text-xs text-slate-700 animate-in fade-in">
              <div className="flex items-center justify-between font-bold text-emerald-950 border-b border-slate-100 pb-2">
                <span className="flex items-center gap-1.5 text-sm">
                  <Search className="h-4 w-4 text-emerald-600" />
                  Bước 1: Điều gì quyết định ràng buộc?
                </span>
                <span className="text-[11px] text-slate-500 font-normal">
                  Sắp xếp 10 số theo thứ tự không giảm: a₁ ≤ a₂ ≤ ... ≤ a₁₀
                </span>
              </div>

              <p className="leading-relaxed">
                Khi ta sắp xếp 10 số từ nhỏ đến lớn: <strong>a₁ ≤ a₂ ≤ a₃ ≤ a₄ ≤ a₅ ≤ a₆ ≤ a₇ ≤ a₈ ≤ a₉ ≤ a₁₀</strong>, tổng của 3 số bất kỳ sẽ luôn nhỏ hơn hoặc bằng tổng của <strong>3 số lớn nhất (a₈, a₉, a₁₀)</strong>.
              </p>

              {/* Sorted Preview of Current 10 Numbers */}
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 block">
                  Thứ tự các số hiện tại sau khi sắp xếp:
                </span>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {sortedInfo.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col items-center px-2 py-1 rounded-lg border font-mono text-xs font-bold ${
                        item.isTopK
                          ? "bg-emerald-100 border-emerald-400 text-emerald-900 ring-1 ring-emerald-300"
                          : "bg-white border-slate-200 text-slate-700"
                      }`}
                    >
                      <span className="text-[9px] text-slate-400 font-sans">
                        a{item.sortedRank}
                      </span>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-emerald-50 p-2.5 font-semibold text-emerald-900 border border-emerald-200">
                👉 Nhận xét then chốt: &ldquo;Nếu ba số lớn nhất (a₈, a₉, a₁₀) có tổng không vượt quá 14, thì mọi bộ ba khác cũng chắc chắn không thể vượt quá 14!&rdquo;
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setLearnStep(2)}
                  className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 active:scale-95 transition"
                >
                  <span>Sang Bước 2: Tìm giới hạn trên</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Tìm giới hạn trên (Từng bước chi tiết) */}
          {learnStep === 2 && (
            <div className="space-y-3 rounded-xl border border-emerald-300 bg-white p-4 text-xs text-slate-700 animate-in fade-in">
              <div className="flex items-center justify-between font-bold text-emerald-950 border-b border-slate-100 pb-2">
                <span className="flex items-center gap-1.5 text-sm">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  Bước 2: Tìm giới hạn trên cho tổng 10 số
                </span>
                <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Tổng ≤ 42
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200 space-y-1">
                  <strong className="text-slate-800">1. Từ ràng buộc 3 số lớn nhất:</strong>
                  <p className="font-mono text-emerald-800">
                    a₈ + a₉ + a₁₀ ≤ 14
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200 space-y-1">
                  <strong className="text-slate-800">2. Chặn giá trị của số a₈:</strong>
                  <p>
                    Do dãy sắp xếp tăng dần nên <strong>a₈ ≤ a₉ ≤ a₁₀</strong>.
                  </p>
                  <p className="font-mono text-slate-600">
                    Nếu a₈ ≥ 5 thì: a₈ + a₉ + a₁₀ ≥ 5 + 5 + 5 = 15 &gt; 14 (mâu thuẫn!).
                  </p>
                  <p className="font-semibold text-emerald-800">
                    Do đó bắt buộc: <strong>a₈ ≤ 4</strong>.
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200 space-y-1">
                  <strong className="text-slate-800">3. Chặn tổng 8 số đầu tiên:</strong>
                  <p>
                    Vì a₁ ≤ a₂ ≤ ... ≤ a₈ ≤ 4, nên tổng của 8 số đầu nhiều nhất là:
                  </p>
                  <p className="font-mono font-bold text-indigo-700">
                    a₁ + a₂ + ... + a₈ ≤ 8 × 4 = 32
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200 space-y-1">
                  <strong className="text-slate-800">4. Chặn tổng 2 số còn lại (a₉, a₁₀):</strong>
                  <p>
                    Từ a₈ + a₉ + a₁₀ ≤ 14, suy ra <strong>a₉ + a₁₀ ≤ 14 - a₈</strong>.
                  </p>
                  <p className="font-mono">
                    Do đó tổng cả 10 số = (a₁ + ... + a₇) + (a₈ + a₉ + a₁₀) ≤ (7 × a₈) + 14.
                  </p>
                  <p className="font-mono">
                    Hoặc tính: (a₁ + ... + a₈) + (a₉ + a₁₀) ≤ 32 + (14 - 4) = 32 + 10 = <strong>42</strong>.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setLearnStep(1)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  ← Quay lại Bước 1
                </button>

                <button
                  onClick={() => setLearnStep(3)}
                  className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 active:scale-95 transition"
                >
                  <span>Sang Bước 3: Chỉ ra phương án đạt 42</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Chỉ ra phương án cụ thể đạt 42 */}
          {learnStep === 3 && (
            <div className="space-y-3 rounded-xl border border-emerald-300 bg-white p-4 text-xs text-slate-700 animate-in fade-in">
              <div className="flex items-center justify-between font-bold text-emerald-950 border-b border-slate-100 pb-2">
                <span className="flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Bước 3: Chỉ ra phương án thật sự đạt giá trị 42
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Tối ưu: 42
                </span>
              </div>

              <p>
                Chứng minh &ldquo;tổng ≤ 42&rdquo; chỉ mới là một nửa bài toán. Để khẳng định 42 là giá trị lớn nhất, ta <strong>bắt buộc phải chỉ ra ít nhất một cách chọn 10 số thỏa mãn điều kiện và có tổng đúng bằng 42</strong>!
              </p>

              {/* Sample 1: 4 4 4 4 4 4 4 4 4 6 */}
              <div className="space-y-2 rounded-xl bg-slate-50 p-3 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Phương án mẫu 1: Chín số 4 và một số 6
                  </span>
                  <button
                    onClick={() => handleLoadSample([4, 4, 4, 4, 4, 4, 4, 4, 4, 6])}
                    className="rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-indigo-700"
                  >
                    Nạp vào 10 ô 👆
                  </button>
                </div>
                <div className="font-mono font-bold text-indigo-700 text-xs">
                  4, 4, 4, 4, 4, 4, 4, 4, 4, 6
                </div>
                <div className="text-[11px] text-slate-600">
                  • 3 số lớn nhất: 4 + 4 + 6 = 14 ≤ 14 (Hợp lệ ✅).<br />
                  • Tổng 10 số: (9 × 4) + 6 = <strong>42</strong>.
                </div>
              </div>

              {/* Sample 2: 4 4 4 4 4 4 4 4 5 5 */}
              <div className="space-y-2 rounded-xl bg-slate-50 p-3 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Phương án mẫu 2: Tám số 4 và hai số 5
                  </span>
                  <button
                    onClick={() => handleLoadSample([4, 4, 4, 4, 4, 4, 4, 4, 5, 5])}
                    className="rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-indigo-700"
                  >
                    Nạp vào 10 ô 👆
                  </button>
                </div>
                <div className="font-mono font-bold text-indigo-700 text-xs">
                  4, 4, 4, 4, 4, 4, 4, 4, 5, 5
                </div>
                <div className="text-[11px] text-slate-600">
                  • 3 số lớn nhất: 4 + 5 + 5 = 14 ≤ 14 (Hợp lệ ✅).<br />
                  • Tổng 10 số: (8 × 4) + 5 + 5 = <strong>42</strong>.
                </div>
              </div>

              <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-3 space-y-1 text-center font-bold text-emerald-950">
                <p>
                  💡 Kết luận: Vì tổng không thể vượt quá 42 và có thể đạt được 42, nên <strong>42 là giá trị lớn nhất</strong>!
                </p>
              </div>

              <div className="flex justify-start pt-1">
                <button
                  onClick={() => setLearnStep(2)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  ← Quay lại Bước 2
                </button>
              </div>
            </div>
          )}

          {/* TEACHING POINT */}
          <div className="rounded-xl border border-emerald-300 bg-white p-3 space-y-1 text-center text-xs">
            <p className="font-extrabold text-emerald-950">
              Teaching Point: “Muốn chứng minh một giá trị là lớn nhất, cần làm hai việc: 1. Chứng minh không thể vượt qua nó. 2. Chỉ ra một cách đạt được nó.”
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold">
              “Tối ưu = Mục tiêu + Ràng buộc.”
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
