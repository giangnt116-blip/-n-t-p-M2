import React, { useState } from "react";
import { CheckCircle2, XCircle, Info, Sparkles, Sliders } from "lucide-react";
import { QuestionMode } from "../types/question";

export interface ToleranceLabConfig {
  multipliers?: number[];
  observed?: number[];
  tolerance?: number;
  minX?: number;
  maxX?: number;
}

interface ToleranceLabProps {
  config?: Record<string, unknown>;
  mode: QuestionMode;
}

export const ToleranceLab: React.FC<ToleranceLabProps> = ({ config, mode }) => {
  const multipliers: number[] = Array.isArray(config?.multipliers)
    ? (config.multipliers as number[])
    : [1, 2, 3, 4, 5];

  const observed: number[] = Array.isArray(config?.observed)
    ? (config.observed as number[])
    : [7, 9, 16, 18, 22];

  const tolerance = typeof config?.tolerance === "number" ? config.tolerance : 3;
  const minX = typeof config?.minX === "number" ? config.minX : 1;
  const maxX = typeof config?.maxX === "number" ? config.maxX : 10;

  // Initial slider value: start at minX or 2 so answer (5) is not revealed
  const [selectedX, setSelectedX] = useState<number>(() => {
    return mode === "learn" ? 5 : Math.max(minX, 2);
  });

  // Calculate comparisons for each plate
  const rows = multipliers.map((k, idx) => {
    const obs = observed[idx] ?? 0;
    const initial = k * selectedX;
    const diff = Math.abs(initial - obs);
    const isValid = diff <= tolerance;
    return {
      plateNum: idx + 1,
      multiplier: k,
      initial,
      observed: obs,
      diff,
      isValid,
    };
  });

  const validCount = rows.filter((r) => r.isValid).length;
  const totalCount = rows.length;
  const isAllValid = validCount === totalCount;

  // Intervals for Learn Mode
  const intervals = multipliers.map((k, idx) => {
    const obs = observed[idx] ?? 0;
    const lowerObs = obs - tolerance;
    const upperObs = obs + tolerance;
    const minVal = Math.ceil(lowerObs / k);
    const maxVal = Math.floor(upperObs / k);
    const validIntegers: number[] = [];
    for (let x = minX; x <= maxX; x++) {
      if (Math.abs(k * x - obs) <= tolerance) {
        validIntegers.push(x);
      }
    }
    return {
      plateNum: idx + 1,
      k,
      obs,
      lowerObs,
      upperObs,
      minVal,
      maxVal,
      validIntegers,
    };
  });

  return (
    <div className="space-y-6 rounded-2xl border border-indigo-100 bg-white p-5 shadow-xs sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Phòng thí nghiệm Sai lệch Đĩa táo
            </h4>
            <p className="text-xs text-slate-500">
              Điều kiện: Mỗi đĩa sau khi xáo trộn lệch nhiều nhất {tolerance} quả
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
              isAllValid
                ? "bg-emerald-100 text-emerald-800 ring-2 ring-emerald-400"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {isAllValid ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Thỏa mãn {validCount}/{totalCount} đĩa</span>
              </>
            ) : (
              <>
                <span>Thỏa mãn {validCount}/{totalCount} đĩa</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Slider Control */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="tolerance-slider-x"
            className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2"
          >
            <span>Thử chọn giá trị ban đầu cho đĩa thứ nhất:</span>
            <span className="rounded-lg bg-indigo-600 px-3 py-1 text-base font-black text-white shadow-xs">
              x = {selectedX}
            </span>
          </label>
          <span className="text-xs text-slate-500 hidden sm:inline">
            (Kéo slider từ {minX} đến {maxX})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400">{minX}</span>
          <input
            id="tolerance-slider-x"
            type="range"
            min={minX}
            max={maxX}
            step={1}
            value={selectedX}
            onChange={(e) => setSelectedX(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600 focus:outline-none"
          />
          <span className="text-xs font-bold text-slate-400">{maxX}</span>
        </div>

        {/* Quick buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-slate-400 mr-1">Chọn nhanh:</span>
          {Array.from({ length: maxX - minX + 1 }, (_, i) => minX + i).map((num) => (
            <button
              key={num}
              onClick={() => setSelectedX(num)}
              className={`h-7 w-7 rounded-md text-xs font-bold transition ${
                selectedX === num
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Plates Visual Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {rows.map((r) => (
          <div
            key={r.plateNum}
            className={`relative rounded-xl border p-3 text-center transition-all ${
              r.isValid
                ? "border-emerald-300 bg-emerald-50/40 shadow-2xs"
                : "border-rose-200 bg-rose-50/30"
            }`}
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Đĩa {r.plateNum} ({r.multiplier}x)
            </div>
            <div className="mt-1 flex items-center justify-center gap-1">
              <span className="text-lg">🍎</span>
              <span className="text-xl font-black text-slate-900">{r.initial}</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-600 border-t border-slate-200/60 pt-1">
              Sau xáo trộn: <strong className="text-slate-900">{r.observed}</strong>
            </div>
            <div
              className={`mt-1.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${
                r.isValid
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {r.isValid ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>Lệch {r.diff} ≤ {tolerance}</span>
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 text-rose-600" />
                  <span>Lệch {r.diff} &gt; {tolerance}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Table Comparison */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2.5">Đĩa</th>
              <th className="px-3 py-2.5">Ban đầu ({selectedX}×k)</th>
              <th className="px-3 py-2.5">Sau xáo trộn</th>
              <th className="px-3 py-2.5">Sai lệch</th>
              <th className="px-3 py-2.5 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr
                key={r.plateNum}
                className={`transition-colors ${
                  r.isValid ? "hover:bg-emerald-50/30" : "bg-rose-50/20 hover:bg-rose-50/40"
                }`}
              >
                <td className="px-3 py-2 font-bold text-slate-800">Đĩa {r.plateNum}</td>
                <td className="px-3 py-2 font-semibold text-indigo-700">
                  {r.multiplier} × {selectedX} = <strong>{r.initial}</strong> quả
                </td>
                <td className="px-3 py-2 font-semibold text-slate-800">{r.observed} quả</td>
                <td className="px-3 py-2">
                  |{r.initial} - {r.observed}| = <strong>{r.diff}</strong>
                </td>
                <td className="px-3 py-2 text-center">
                  {r.isValid ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                      ✅ Hợp lệ (≤ 3)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800">
                      ❌ Vi phạm (&gt; 3)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Feedback / Success Banner in Challenge Mode */}
      {isAllValid && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 shadow-2xs">
          <Sparkles className="h-5 w-5 shrink-0 text-emerald-600" />
          <div className="text-xs sm:text-sm">
            <strong className="font-extrabold text-emerald-950">
              Tuyệt vời!
            </strong>{" "}
            Em đã tìm được một giá trị thỏa mãn tất cả điều kiện ({validCount}/{totalCount} đĩa). Hãy nhập kết quả này vào ô trả lời bên dưới!
          </div>
        </div>
      )}

      {/* LEARN MODE: Mathematical Range Analysis */}
      {mode === "learn" && (
        <div className="space-y-4 rounded-xl border border-indigo-200 bg-indigo-50/40 p-5">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-indigo-600" />
            <h5 className="text-sm font-extrabold text-indigo-950">
              Phân tích Khoảng giá trị & Giao điều kiện (Learn Mode)
            </h5>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Vì Khỉ Nâu chỉ thêm hoặc bớt nhiều nhất 3 quả táo ở mỗi đĩa, số táo ban đầu{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-bold text-indigo-700">
              k · x
            </code>{" "}
            phải cách số quan sát không quá 3:
          </p>

          <div className="grid gap-2 sm:grid-cols-2 text-xs">
            {intervals.map((inv) => (
              <div
                key={inv.plateNum}
                className="rounded-lg border border-indigo-100 bg-white p-3 space-y-1"
              >
                <div className="font-bold text-slate-800">
                  Đĩa {inv.plateNum}: |{inv.k}x - {inv.obs}| ≤ 3
                </div>
                <div className="text-slate-600">
                  → {inv.lowerObs} ≤ {inv.k}x ≤ {inv.upperObs}
                </div>
                <div className="font-semibold text-indigo-700">
                  → x ∈ &#123;{inv.validIntegers.join(", ")}&#125;
                </div>
              </div>
            ))}
          </div>

          {/* Range Intersection Grid Visual */}
          <div className="rounded-xl border border-indigo-200 bg-white p-4 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              Bảng kiểm tra giao điểm các khoảng:
            </span>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-11 gap-1 text-center text-xs min-w-[320px]">
                <div className="font-bold text-slate-400 py-1">Đĩa \ x</div>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((xVal) => (
                  <div
                    key={xVal}
                    className={`font-black py-1 rounded ${
                      xVal === 5 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {xVal}
                  </div>
                ))}

                {intervals.map((inv) => (
                  <React.Fragment key={inv.plateNum}>
                    <div className="py-1 text-slate-500 font-semibold text-left pl-1">
                      Đĩa {inv.plateNum}
                    </div>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((xVal) => {
                      const ok = inv.validIntegers.includes(xVal);
                      return (
                        <div
                          key={xVal}
                          className={`py-1 rounded text-[11px] ${
                            ok
                              ? xVal === 5
                                ? "bg-emerald-200 font-bold text-emerald-900"
                                : "bg-emerald-50 text-emerald-700"
                              : "text-slate-300"
                          }`}
                        >
                          {ok ? "✓" : "·"}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-2 text-xs text-slate-700">
              💡 <strong>Kết luận:</strong> Chỉ có duy nhất cột{" "}
              <strong className="text-indigo-700 font-black">x = 5</strong> được cả 5 đĩa đồng loạt thỏa mãn dấu “✓”. Do đó số táo ban đầu ở đĩa 1 chắc chắn là 5.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
