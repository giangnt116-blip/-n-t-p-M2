import React, { useState, useMemo } from "react";
import {
  RotateCcw,
  Sparkles,
  Plus,
  Minus,
  Layers,
  ChevronRight,
  TrendingUp,
  Table as TableIcon,
} from "lucide-react";
import { QuestionMode } from "../types/question";
import {
  TableMergeConfig,
  calculateSeatsForRow,
  getMergePatternTable,
} from "../utils/tableUtils";

interface TableMergeLabProps {
  config?: TableMergeConfig;
  mode: QuestionMode;
}

export const TableMergeLab: React.FC<TableMergeLabProps> = ({ config, mode }) => {
  const maxTableCount = config?.tableCount || 7;
  const seatsPerSide = config?.seatsPerSide || 1;

  // State: number of tables merged in the row
  const [mergedCount, setMergedCount] = useState<number>(1);
  const [showPatternAnalysis, setShowPatternAnalysis] = useState<boolean>(
    mode === "learn"
  );

  // Derived calculations
  const currentSeats = useMemo(() => {
    return calculateSeatsForRow(mergedCount, seatsPerSide);
  }, [mergedCount, seatsPerSide]);

  const patternTable = useMemo(() => {
    return getMergePatternTable(maxTableCount, seatsPerSide);
  }, [maxTableCount, seatsPerSide]);

  // Handlers
  const handleAddTable = () => {
    if (mergedCount < maxTableCount) {
      setMergedCount((prev) => prev + 1);
    }
  };

  const handleRemoveTable = () => {
    if (mergedCount > 1) {
      setMergedCount((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setMergedCount(1);
    setShowPatternAnalysis(mode === "learn");
  };

  const isFull = mergedCount === maxTableCount;

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-slate-50/70 to-white p-5 shadow-xs space-y-5">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <TableIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mô phỏng tương tác
              </span>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-700">
                tableMergeLab
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Ghép bàn tiệc & Vị trí ngồi
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {mode === "learn" && (
            <button
              onClick={() => setShowPatternAnalysis(!showPatternAnalysis)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                showPatternAnalysis
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{showPatternAnalysis ? "Ẩn quy luật" : "▶ Xem quy luật"}</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition"
            title="Tách tất cả bàn về 1 bàn ban đầu"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>↺ Tách tất cả bàn</span>
          </button>
        </div>
      </div>

      {/* STATS COUNTER BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Số bàn đã ghép
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">{mergedCount}</span>
            <span className="text-xs font-bold text-slate-400">/ {maxTableCount} bàn</span>
          </div>
        </div>

        <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-3 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
            Số chỗ ngồi hiện tại
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-indigo-600">{currentSeats}</span>
            <span className="text-xs font-bold text-indigo-500">chỗ ngồi</span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs flex flex-col justify-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Trạng thái hàng bàn
          </div>
          <div className="mt-1 text-xs font-extrabold text-slate-700">
            {isFull ? (
              <span className="text-emerald-700 font-bold">✓ Đã ghép đủ {maxTableCount} bàn</span>
            ) : (
              <span className="text-slate-500 font-medium">
                Còn {maxTableCount - mergedCount} bàn chưa ghép
              </span>
            )}
          </div>
        </div>
      </div>

      {/* INTERACTIVE MERGE CANVAS / SCROLLABLE DISPLAY */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700">
            Minh họa hàng bàn thực tế ({mergedCount} bàn ghép thẳng hàng):
          </span>
          <span className="text-[11px] text-slate-400">
            ● Chấm xanh = ghế ngồi hợp lệ
          </span>
        </div>

        {/* Scrollable Container for Row of Tables */}
        <div className="w-full overflow-x-auto py-4 px-2 scrollbar-thin">
          <div className="inline-flex items-center gap-1 min-w-full justify-start sm:justify-center">
            {Array.from({ length: mergedCount }).map((_, index) => {
              const isFirst = index === 0;
              const isLast = index === mergedCount - 1;
              const hasLeftSeat = isFirst;
              const hasRightSeat = isLast;

              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center justify-center p-2 transition-all duration-300 transform"
                >
                  {/* Top Seat */}
                  <div className="h-5 flex items-center justify-center mb-1">
                    <span
                      className="h-4 w-4 rounded-full bg-emerald-500 shadow-xs flex items-center justify-center text-[10px] text-white font-bold animate-in fade-in"
                      title="Ghế ngồi phía trên"
                    >
                      ●
                    </span>
                  </div>

                  {/* Middle row: [Left Seat (if first)] + [Square Table Box] + [Right Seat (if last)] */}
                  <div className="flex items-center gap-1">
                    {/* Left Seat: only if first table in the row */}
                    <div className="w-5 flex items-center justify-center">
                      {hasLeftSeat ? (
                        <span
                          className="h-4 w-4 rounded-full bg-emerald-500 shadow-xs flex items-center justify-center text-[10px] text-white font-bold animate-in fade-in"
                          title="Ghế ngồi đầu hàng (bên trái)"
                        >
                          ●
                        </span>
                      ) : (
                        /* Merged joint indicator between tables */
                        <div className="h-8 w-1 bg-amber-300/80 rounded-full" title="Mép ghép tiếp xúc - không còn chỗ ngồi" />
                      )}
                    </div>

                    {/* The Square Table Surface */}
                    <div
                      className={`relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl border-2 font-black text-xs select-none shadow-xs transition-all duration-300 ${
                        isLast && mergedCount > 1
                          ? "border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200"
                          : "border-slate-400 bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span>Bàn {index + 1}</span>

                      {/* Small badge indicating exposed sides for this table */}
                      <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 rounded bg-white/90 text-slate-500 border border-slate-200">
                        {isFirst && isLast
                          ? "4 chỗ"
                          : isFirst || isLast
                          ? "3 chỗ"
                          : "2 chỗ"}
                      </span>
                    </div>

                    {/* Right Seat: only if last table in row */}
                    <div className="w-5 flex items-center justify-center">
                      {hasRightSeat ? (
                        <span
                          className="h-4 w-4 rounded-full bg-emerald-500 shadow-xs flex items-center justify-center text-[10px] text-white font-bold animate-in fade-in"
                          title="Ghế ngồi cuối hàng (bên phải)"
                        >
                          ●
                        </span>
                      ) : (
                        <div className="h-8 w-1 bg-amber-300/80 rounded-full" title="Mép ghép tiếp xúc - không còn chỗ ngồi" />
                      )}
                    </div>
                  </div>

                  {/* Bottom Seat */}
                  <div className="h-5 flex items-center justify-center mt-1">
                    <span
                      className="h-4 w-4 rounded-full bg-emerald-500 shadow-xs flex items-center justify-center text-[10px] text-white font-bold animate-in fade-in"
                      title="Ghế ngồi phía dưới"
                    >
                      ●
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CONTROLS BUTTONS */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRemoveTable}
              disabled={mergedCount <= 1}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition shadow-2xs"
            >
              <Minus className="h-3.5 w-3.5 text-slate-500" />
              <span>Bớt 1 bàn</span>
            </button>

            <button
              onClick={handleAddTable}
              disabled={isFull}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Ghép thêm 1 bàn (+2 chỗ)</span>
            </button>
          </div>

          <div className="text-xs text-slate-600 font-medium">
            {isFull ? (
              <span className="font-bold text-indigo-700">
                🎉 Em đã ghép đủ {maxTableCount} bàn.
              </span>
            ) : (
              <span>Bấm &ldquo;Ghép thêm 1 bàn&rdquo; để quan sát số chỗ thay đổi.</span>
            )}
          </div>
        </div>
      </div>

      {/* LEARN MODE: PATTERN TABLE & TEACHING POINT */}
      {mode === "learn" && showPatternAnalysis && (
        <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="flex items-center justify-between border-b border-emerald-200/70 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Bảng quy luật tăng trưởng số chỗ ngồi</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-800">
              Quy luật: 2n + 2
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bg-white rounded-xl overflow-hidden border border-emerald-200">
              <thead className="bg-emerald-100/70 text-emerald-950 font-black">
                <tr>
                  <th className="p-2.5">Số bàn (n)</th>
                  <th className="p-2.5">Số chỗ ngồi</th>
                  <th className="p-2.5">Chênh lệch (Tăng thêm)</th>
                  <th className="p-2.5">Cách tính chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 text-slate-700 font-medium">
                {patternTable.map((row) => {
                  const isCurrent = row.tables === mergedCount;
                  return (
                    <tr
                      key={row.tables}
                      className={
                        isCurrent
                          ? "bg-emerald-100/60 font-bold"
                          : "hover:bg-emerald-50/30"
                      }
                    >
                      <td className="p-2.5 font-bold font-mono">
                        {row.tables} bàn {isCurrent && "👈"}
                      </td>
                      <td className="p-2.5 font-bold font-mono text-indigo-700 text-sm">
                        {row.seats} chỗ
                      </td>
                      <td className="p-2.5 font-mono text-emerald-800">
                        {row.tables === 1 ? "4 (ban đầu)" : `+${row.delta} chỗ`}
                      </td>
                      <td className="p-2.5 text-[11px] text-slate-500 font-mono">
                        {row.tables === 1
                          ? "4 cạnh ngoài"
                          : `2 × ${row.tables} (trên+dưới) + 2 (hai đầu) = ${row.seats}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-emerald-300 bg-white p-3 space-y-2 text-xs text-slate-700">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <span>💡 Nhận xét then chốt:</span>
              <span className="text-emerald-700">
                Mỗi bàn ghép thêm chỉ làm tăng 2 chỗ ngồi (ở hai phía trên và dưới), vì 2 cạnh bên đã tiếp xúc nhau.
              </span>
            </div>
            <div className="rounded-lg bg-emerald-50 p-2 font-mono text-xs text-emerald-900 border border-emerald-200">
              Công thức tổng quát cho n bàn ghép thẳng: <strong>Số chỗ = 2n + 2</strong> (Với n = {maxTableCount} bàn → 2 × {maxTableCount} + 2 = {calculateSeatsForRow(maxTableCount, seatsPerSide)} chỗ).
            </div>
            <p className="text-xs font-bold text-emerald-900 text-center pt-1">
              Teaching Point: “Khi ghép các đối tượng, phần tiếp xúc có thể không còn được tính.”
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
