import React, { useState } from "react";
import {
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Eye,
  Layers,
} from "lucide-react";
import { QuestionMode } from "../types/question";

interface CycleSeries {
  id: string;
  label: string;
  icon: string;
  values: number[];
}

interface CycleLabConfig {
  days?: number;
  series?: CycleSeries[];
}

interface CycleLabProps {
  config?: CycleLabConfig;
  mode: QuestionMode;
}

export const CycleLab: React.FC<CycleLabProps> = ({ config, mode }) => {
  const totalDays = config?.days || 12;
  const seriesList: CycleSeries[] = config?.series || [
    {
      id: "carrot",
      label: "Cà rốt",
      icon: "🥕",
      values: [2, 0, 3, 1],
    },
    {
      id: "cabbage",
      label: "Bắp cải",
      icon: "🥬",
      values: [1, 0, 0, 2, 0, 1],
    },
  ];

  // In Challenge mode, initial revealed days is max initial cycle length (e.g. 6)
  const initialRevealed = mode === "learn" ? totalDays : 6;
  const [revealedDays, setRevealedDays] = useState<number>(initialRevealed);
  const [highlightCycles, setHighlightCycles] = useState<boolean>(mode === "learn");
  const [showGuessModal, setShowGuessModal] = useState<boolean>(false);
  const [selectedCycles, setSelectedCycles] = useState<Record<string, number>>({});
  const [cycleFeedback, setCycleFeedback] = useState<Record<string, { ok: boolean; msg: string }>>({});

  const handleNextDay = () => {
    setRevealedDays((prev) => Math.min(prev + 1, totalDays));
  };

  const handleReset = () => {
    setRevealedDays(mode === "learn" ? totalDays : 6);
    setHighlightCycles(mode === "learn");
    setShowGuessModal(false);
    setSelectedCycles({});
    setCycleFeedback({});
  };

  const handleSelectCycleLength = (seriesId: string, len: number) => {
    const s = seriesList.find((item) => item.id === seriesId);
    if (!s) return;

    setSelectedCycles((prev) => ({ ...prev, [seriesId]: len }));

    const expectedLen = s.values.length;
    if (len === expectedLen) {
      setCycleFeedback((prev) => ({
        ...prev,
        [seriesId]: {
          ok: true,
          msg: `Chính xác! ${s.label} lặp lại chu kỳ sau mỗi ${expectedLen} ngày.`,
        },
      }));
    } else {
      setCycleFeedback((prev) => ({
        ...prev,
        [seriesId]: {
          ok: false,
          msg: `Chưa chuẩn. Hãy đối chiếu các ngày để tìm vị trí dãy số bắt đầu lặp lại.`,
        },
      }));
    }
  };

  // Color palette for grouped cycles
  const getCycleGroupStyle = (dayIdx: number, cycleLen: number, sIndex: number) => {
    if (!highlightCycles) return "bg-white border-slate-200 text-slate-800";

    const cycleIndex = Math.floor(dayIdx / cycleLen);
    const inCyclePosition = dayIdx % cycleLen;

    // Distinct soft colors for cycle chunks
    if (sIndex === 0) {
      // Carrot: alternates indigo / sky / violet
      const colors = [
        "bg-amber-50 border-amber-300 text-amber-950 font-bold",
        "bg-orange-50 border-orange-300 text-orange-950 font-bold",
        "bg-yellow-50 border-yellow-300 text-yellow-950 font-bold",
      ];
      const color = colors[cycleIndex % colors.length];
      const borderLeft = inCyclePosition === 0 ? "border-l-2 border-l-amber-500" : "";
      const borderRight = inCyclePosition === cycleLen - 1 ? "border-r-2 border-r-amber-500" : "";
      return `${color} ${borderLeft} ${borderRight}`;
    } else {
      // Cabbage: alternates emerald / teal / green
      const colors = [
        "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold",
        "bg-teal-50 border-teal-300 text-teal-950 font-bold",
      ];
      const color = colors[cycleIndex % colors.length];
      const borderLeft = inCyclePosition === 0 ? "border-l-2 border-l-emerald-500" : "";
      const borderRight = inCyclePosition === cycleLen - 1 ? "border-r-2 border-r-emerald-500" : "";
      return `${color} ${borderLeft} ${borderRight}`;
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-slate-50/70 to-white p-5 shadow-xs space-y-5">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mô phỏng tương tác
              </span>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-700">
                cycleLab
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Dòng thời gian Chu kỳ tuần hoàn (12 ngày)
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {mode === "challenge" && (
            <>
              {revealedDays < totalDays && (
                <button
                  onClick={handleNextDay}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span>Ngày tiếp theo ({revealedDays + 1}/{totalDays})</span>
                </button>
              )}

              <button
                onClick={() => setShowGuessModal(!showGuessModal)}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600 active:scale-95 transition"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Em đã phát hiện chu kỳ</span>
              </button>
            </>
          )}

          {mode === "learn" && (
            <button
              onClick={() => setHighlightCycles(!highlightCycles)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                highlightCycles
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Search className="h-3.5 w-3.5" />
              <span>{highlightCycles ? "Ẩn tô màu chu kỳ" : "🔍 Tô màu theo chu kỳ"}</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition"
            title="Làm lại từ đầu"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Làm lại</span>
          </button>
        </div>
      </div>

      {/* TIMELINE VISUALIZATION TABLE */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[580px] space-y-2.5">
          {/* Header row: Days 1 to 12 */}
          <div className="grid grid-cols-13 gap-1 text-center text-xs font-bold text-slate-500">
            <div className="col-span-1 text-left self-center font-mono text-[11px] text-slate-400">
              Ngày
            </div>
            {Array.from({ length: totalDays }).map((_, idx) => {
              const dayNum = idx + 1;
              const isRevealed = dayNum <= revealedDays;
              return (
                <div
                  key={dayNum}
                  className={`rounded-lg py-1 transition-all ${
                    isRevealed
                      ? "bg-slate-200 text-slate-800 font-extrabold"
                      : "bg-slate-100 text-slate-400 font-normal"
                  }`}
                >
                  {dayNum}
                </div>
              );
            })}
          </div>

          {/* Series Rows */}
          {seriesList.map((series, sIndex) => {
            const cycleLen = series.values.length;
            return (
              <div
                key={series.id}
                className="grid grid-cols-13 gap-1 text-center items-center text-xs"
              >
                {/* Series Label & Icon */}
                <div className="col-span-1 flex items-center gap-1 text-left font-bold text-slate-800 truncate">
                  <span className="text-base">{series.icon}</span>
                  <span className="text-[11px] truncate hidden sm:inline">{series.label}</span>
                </div>

                {/* Day values */}
                {Array.from({ length: totalDays }).map((_, dayIdx) => {
                  const dayNum = dayIdx + 1;
                  const isRevealed = dayNum <= revealedDays;
                  const value = series.values[dayIdx % cycleLen];

                  return (
                    <div
                      key={dayNum}
                      className={`flex h-10 items-center justify-center rounded-lg border text-sm transition-all ${
                        isRevealed
                          ? getCycleGroupStyle(dayIdx, cycleLen, sIndex)
                          : "border-dashed border-slate-200 bg-slate-50/50 text-slate-300"
                      }`}
                      title={
                        isRevealed
                          ? `Ngày ${dayNum}: ${series.label} ăn ${value} củ`
                          : `Ngày ${dayNum}: Chưa mở`
                      }
                    >
                      {isRevealed ? (
                        <span className="font-extrabold">{value}</span>
                      ) : (
                        <span className="text-slate-300 font-bold">?</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* CHALLENGE MODE: CYCLE DETECTION MODAL / ACCORDION */}
      {mode === "challenge" && showGuessModal && (
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span>Xác định độ dài chu kỳ lặp lại</span>
            </h4>
            <span className="text-[11px] text-amber-700">
              Chọn số ngày trước khi quy luật lặp lại từ đầu
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {seriesList.map((series) => {
              const selected = selectedCycles[series.id];
              const feedback = cycleFeedback[series.id];

              return (
                <div
                  key={series.id}
                  className="rounded-xl border border-amber-200 bg-white p-3 space-y-2"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                    <span>{series.icon}</span>
                    <span>Chu kỳ của {series.label}:</span>
                  </div>

                  {/* Buttons 1 to 6 */}
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleSelectCycleLength(series.id, num)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition active:scale-95 ${
                          selected === num
                            ? "border-amber-600 bg-amber-500 text-white shadow-xs"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-amber-400"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                    <span className="text-[11px] text-slate-400 ml-1">ngày</span>
                  </div>

                  {/* Feedback on cycle guess */}
                  {feedback && (
                    <p
                      className={`text-[11px] font-medium leading-snug ${
                        feedback.ok ? "text-emerald-700" : "text-amber-700"
                      }`}
                    >
                      {feedback.ok ? "✓ " : "• "}
                      {feedback.msg}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LEARN MODE: DETAILED BREAKDOWN & TEACHING POINT */}
      {mode === "learn" && (
        <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Phân tích cấu trúc chu kỳ trong 12 ngày</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-xl border border-emerald-200 bg-white p-3 space-y-1">
              <span className="font-bold text-amber-800 flex items-center gap-1">
                🥕 Cà rốt: Chu kỳ 4 ngày [2, 0, 3, 1]
              </span>
              <p className="text-slate-600">
                • Mỗi chu kỳ: 2 + 0 + 3 + 1 = <strong>6 củ</strong>
              </p>
              <p className="text-slate-600">
                • 12 ngày gồm 12 ÷ 4 = <strong>3 chu kỳ</strong>
              </p>
              <p className="font-extrabold text-indigo-700">
                → Tổng cà rốt = 3 chu kỳ × 6 = 18 củ
              </p>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-white p-3 space-y-1">
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                🥬 Bắp cải: Chu kỳ 6 ngày [1, 0, 0, 2, 0, 1]
              </span>
              <p className="text-slate-600">
                • Mỗi chu kỳ: 1 + 0 + 0 + 2 + 0 + 1 = <strong>4 củ</strong>
              </p>
              <p className="text-slate-600">
                • 12 ngày gồm 12 ÷ 6 = <strong>2 chu kỳ</strong>
              </p>
              <p className="font-extrabold text-indigo-700">
                → Tổng bắp cải = 2 chu kỳ × 4 = 8 củ
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-300 bg-white p-3 text-center">
            <span className="text-sm font-black text-slate-900">
              Tổng số củ trong 12 ngày = 18 + 8 = <span className="text-emerald-600 text-base font-black">26 củ</span>
            </span>
            <p className="text-xs text-emerald-800 font-bold mt-1">
              Teaching Point: “Khi một quy luật lặp lại, hãy tìm chu kỳ thay vì tính từng phần tử.”
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
