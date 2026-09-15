import React, { useState } from "react";
import {
  Grid,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BookmarkPlus,
  Eye,
  ChevronRight,
  ChevronLeft,
  Info,
} from "lucide-react";
import {
  isValidRow,
  isValidColumn,
  isValidSquare,
  enumerateLatinSquares,
  gridToKey,
} from "../utils/latinSquareUtils";

interface LatinSquareLabProps {
  mode: "challenge" | "learn";
  config?: any;
}

export const LatinSquareLab: React.FC<LatinSquareLabProps> = ({
  mode,
  config,
}) => {
  const size = (config?.size as number) || 3;
  const symbols = (config?.symbols as number[]) || [1, 2, 3];

  // Grid state: 3x3 array with 0 as empty
  const [grid, setGrid] = useState<number[][]>([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);

  // Selected cell for number input
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>({
    r: 0,
    c: 0,
  });

  // Saved valid squares in challenge mode
  const [savedSquares, setSavedSquares] = useState<number[][][]>([]);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Active check triggers
  const [showRowCheck, setShowRowCheck] = useState(false);
  const [showColCheck, setShowColCheck] = useState(false);

  // Learn mode state
  const [learnStep, setLearnStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedEnumeratedIdx, setSelectedEnumeratedIdx] = useState<number>(0);

  const allValidSquares = enumerateLatinSquares(size, symbols);

  // Handle setting a number in cell
  const handleSetNumber = (val: number) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    const newGrid = grid.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val : cell))
    );
    setGrid(newGrid);
    setSaveMessage(null);
  };

  // Cycle number on cell click
  const handleCellClick = (r: number, c: number) => {
    setSelectedCell({ r, c });
    // Cycle: 0 -> 1 -> 2 -> 3 -> 0
    const current = grid[r][c];
    const next = current >= 3 ? 0 : current + 1;
    const newGrid = grid.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? next : cell))
    );
    setGrid(newGrid);
    setSaveMessage(null);
  };

  const handleReset = () => {
    setGrid([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
    setSelectedCell({ r: 0, c: 0 });
    setSaveMessage(null);
    setShowRowCheck(false);
    setShowColCheck(false);
  };

  // Row validation details
  const rowIssues = [0, 1, 2].map((r) => {
    const row = grid[r];
    const filled = row.filter((x) => x > 0);
    const hasDup = new Set(filled).size < filled.length;
    const isComplete = row.every((x) => x > 0);
    const valid = isComplete && isValidRow(row, symbols);
    return { r, hasDup, isComplete, valid };
  });

  // Column validation details
  const colIssues = [0, 1, 2].map((c) => {
    const col = grid.map((row) => row[c]);
    const filled = col.filter((x) => x > 0);
    const hasDup = new Set(filled).size < filled.length;
    const isComplete = col.every((x) => x > 0);
    const valid = isComplete && isValidColumn(grid, c, symbols);
    return { c, hasDup, isComplete, valid };
  });

  const isGridFull = grid.every((row) => row.every((cell) => cell > 0));
  const isCurrentValid = isGridFull && isValidSquare(grid, symbols);

  // Save current square in Challenge mode
  const handleSaveCurrentSquare = () => {
    if (!isCurrentValid) {
      setSaveMessage("Bảng hiện tại chưa hoàn chỉnh hoặc còn vi phạm hàng/cột!");
      return;
    }
    const currentKey = gridToKey(grid);
    const alreadySaved = savedSquares.some((sq) => gridToKey(sq) === currentKey);

    if (alreadySaved) {
      setSaveMessage("Bảng này em đã lưu trước đó rồi! Hãy thử sắp xếp cách khác nhé.");
    } else {
      setSavedSquares((prev) => [...prev, grid]);
      setSaveMessage("✅ Tuyệt vời! Đã ghi nhận thêm 1 cách xếp hợp lệ mới!");
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-indigo-100 bg-white p-5 shadow-xs sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Grid className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Phòng Thí Nghiệm Bảng Số La-tinh 3×3
            </h3>
            <p className="text-xs text-slate-500">
              Điền các số 1, 2, 3 sao cho mỗi hàng và mỗi cột đều không bị lặp số
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Làm lại</span>
        </button>
      </div>

      {/* Main Interactive Workspace */}
      <div className="grid gap-6 md:grid-cols-12 items-start">
        {/* Left Column: 3x3 Board */}
        <div className="md:col-span-6 flex flex-col items-center justify-center space-y-4">
          <div className="relative rounded-2xl border-2 border-indigo-200 bg-indigo-50/40 p-4 shadow-xs">
            {/* 3x3 Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                  const rowHasDup = rowIssues[r].hasDup;
                  const colHasDup = colIssues[c].hasDup;
                  const hasConflict = rowHasDup || colHasDup;

                  let cellColor =
                    "border-slate-300 bg-white text-slate-800 hover:border-indigo-400";
                  if (hasConflict && cell > 0) {
                    cellColor =
                      "border-rose-400 bg-rose-50 text-rose-700 ring-2 ring-rose-200";
                  } else if (cell > 0) {
                    cellColor =
                      "border-indigo-300 bg-indigo-50 text-indigo-900 font-extrabold";
                  }

                  if (isSelected) {
                    cellColor += " ring-2 ring-indigo-500 scale-102";
                  }

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      className={`flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-xl border-2 text-2xl font-black shadow-2xs transition-all active:scale-95 ${cellColor}`}
                      title={`Hàng ${r + 1}, Cột ${c + 1}`}
                    >
                      {cell === 0 ? (
                        <span className="text-sm font-medium text-slate-300">•</span>
                      ) : (
                        cell
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Row Issue Warnings */}
            {rowIssues.some((r) => r.hasDup) && (
              <div className="mt-3 rounded-lg bg-rose-100 p-2 text-xs font-semibold text-rose-800 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>Trong một hàng đang có số xuất hiện hai lần!</span>
              </div>
            )}

            {/* Column Issue Warnings */}
            {colIssues.some((c) => c.hasDup) && (
              <div className="mt-2 rounded-lg bg-rose-100 p-2 text-xs font-semibold text-rose-800 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>Trong một cột đang có số xuất hiện hai lần!</span>
              </div>
            )}
          </div>

          {/* Quick Digit Selector for Selected Cell */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Điền số:</span>
            {[1, 2, 3].map((val) => (
              <button
                key={val}
                onClick={() => handleSetNumber(val)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-indigo-200 bg-white text-base font-black text-indigo-700 hover:bg-indigo-50 active:scale-95 transition shadow-2xs"
              >
                {val}
              </button>
            ))}
            <button
              onClick={() => handleSetNumber(0)}
              className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 active:scale-95 transition"
            >
              Xóa ô
            </button>
          </div>
        </div>

        {/* Right Column: Controls & Exploration */}
        <div className="md:col-span-6 space-y-4">
          {/* Quick Check Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowRowCheck((p) => !p)}
              className={`rounded-xl border px-3 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                showRowCheck
                  ? "border-indigo-400 bg-indigo-50 text-indigo-800"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Info className="h-3.5 w-3.5" />
              <span>Kiểm tra hàng</span>
            </button>

            <button
              onClick={() => setShowColCheck((p) => !p)}
              className={`rounded-xl border px-3 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                showColCheck
                  ? "border-indigo-400 bg-indigo-50 text-indigo-800"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Info className="h-3.5 w-3.5" />
              <span>Kiểm tra cột</span>
            </button>
          </div>

          {/* Validation Feedback Panels */}
          {showRowCheck && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-xs space-y-1">
              <span className="font-bold text-indigo-900 block">Tình trạng từng hàng:</span>
              {rowIssues.map((ri) => (
                <div key={ri.r} className="flex items-center justify-between">
                  <span>Hàng {ri.r + 1}: [{grid[ri.r].map((x) => (x > 0 ? x : "_")).join(", ")}]</span>
                  {ri.hasDup ? (
                    <span className="font-bold text-rose-600">Bị trùng lặp</span>
                  ) : ri.valid ? (
                    <span className="font-bold text-emerald-600">✅ Đủ 1, 2, 3</span>
                  ) : (
                    <span className="text-slate-400">Chưa đủ số</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {showColCheck && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-xs space-y-1">
              <span className="font-bold text-indigo-900 block">Tình trạng từng cột:</span>
              {colIssues.map((ci) => (
                <div key={ci.c} className="flex items-center justify-between">
                  <span>Cột {ci.c + 1}: [{grid.map((r) => r[ci.c]).map((x) => (x > 0 ? x : "_")).join(", ")}]</span>
                  {ci.hasDup ? (
                    <span className="font-bold text-rose-600">Bị trùng lặp</span>
                  ) : ci.valid ? (
                    <span className="font-bold text-emerald-600">✅ Đủ 1, 2, 3</span>
                  ) : (
                    <span className="text-slate-400">Chưa đủ số</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CHALLENGE MODE SECTION */}
          {mode === "challenge" && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Bộ sưu tập bảng của em:</span>
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-black text-indigo-800">
                  Đã tìm: {savedSquares.length} cách
                </span>
              </div>

              <button
                onClick={handleSaveCurrentSquare}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-black text-white hover:bg-indigo-700 active:scale-95 transition shadow-xs"
              >
                <BookmarkPlus className="h-4 w-4" />
                <span>Lưu cách này</span>
              </button>

              {saveMessage && (
                <p
                  className={`text-xs font-semibold p-2 rounded-lg ${
                    saveMessage.startsWith("✅")
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  {saveMessage}
                </p>
              )}

              {/* Mini previews of saved squares */}
              {savedSquares.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-500 block">
                    Các bảng hợp lệ em đã tạo:
                  </span>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                    {savedSquares.map((sq, idx) => (
                      <div
                        key={idx}
                        onClick={() => setGrid(sq)}
                        className="cursor-pointer rounded-lg border border-indigo-200 bg-white p-1.5 shadow-2xs hover:border-indigo-400 hover:scale-105 transition text-center"
                        title="Bấm để xem lại bảng này"
                      >
                        <div className="text-[9px] font-black text-indigo-700 mb-0.5">
                          Cách #{idx + 1}
                        </div>
                        <div className="grid grid-cols-3 gap-0.5">
                          {sq.map((r, ri) =>
                            r.map((c, ci) => (
                              <div
                                key={`${ri}-${ci}`}
                                className="flex h-3.5 w-3.5 items-center justify-center rounded-xs bg-indigo-50 text-[8px] font-bold text-slate-700"
                              >
                                {c}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LEARN MODE SECTION */}
          {mode === "learn" && (
            <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-b from-indigo-50/50 to-white p-4 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-xs">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span>Khám phá có hệ thống (Quy tắc đếm)</span>
              </div>

              {/* Step Navigator */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((st) => (
                  <button
                    key={st}
                    onClick={() => setLearnStep(st as 1 | 2 | 3 | 4)}
                    className={`flex-1 rounded-lg py-1 text-[11px] font-bold transition ${
                      learnStep === st
                        ? "bg-indigo-600 text-white shadow-2xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    Bước {st}
                  </button>
                ))}
              </div>

              {/* Step Explanations */}
              {learnStep === 1 && (
                <div className="text-xs text-slate-700 space-y-1.5 bg-white p-3 rounded-xl border border-indigo-100">
                  <strong className="text-indigo-900 block">
                    Bước 1: Chọn hàng đầu tiên
                  </strong>
                  <p>
                    Hàng đầu tiên là một hoán vị của bộ số {"{1, 2, 3}"}.
                  </p>
                  <p className="font-mono text-indigo-700">
                    Số cách xếp hàng 1 = 3! = 3 × 2 × 1 = <strong>6 cách</strong>.
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Ví dụ: (1, 2, 3), (1, 3, 2), (2, 1, 3), (2, 3, 1), (3, 1, 2), (3, 2, 1).
                  </p>
                </div>
              )}

              {learnStep === 2 && (
                <div className="text-xs text-slate-700 space-y-1.5 bg-white p-3 rounded-xl border border-indigo-100">
                  <strong className="text-indigo-900 block">
                    Bước 2: Chọn hàng thứ hai (Không trùng cột)
                  </strong>
                  <p>
                    Giả sử hàng 1 là (1, 2, 3). Khi đó hàng 2 không được có số nào trùng cột với hàng 1:
                  </p>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1">
                    <li>Hàng 2 không thể bắt đầu bằng 1.</li>
                    <li>Nếu bắt đầu bằng 2: chỉ có cách (2, 3, 1).</li>
                    <li>Nếu bắt đầu bằng 3: chỉ có cách (3, 1, 2).</li>
                  </ul>
                  <p className="font-mono text-indigo-700 font-bold">
                    → Với mỗi hàng đầu, luôn có đúng 2 cách chọn hàng 2!
                  </p>
                </div>
              )}

              {learnStep === 3 && (
                <div className="text-xs text-slate-700 space-y-1.5 bg-white p-3 rounded-xl border border-indigo-100">
                  <strong className="text-indigo-900 block">
                    Bước 3: Hàng thứ ba bị xác định duy nhất
                  </strong>
                  <p>
                    Mỗi cột ở hàng 1 và hàng 2 đã lấy mất 2 chữ số khác nhau. Vì vậy ở mỗi cột của hàng 3 chỉ còn đúng <strong>1 chữ số duy nhất</strong> chưa dùng.
                  </p>
                  <p className="font-mono text-indigo-700">
                    → Hàng 3 có đúng <strong>1 cách</strong> điền!
                  </p>
                </div>
              )}

              {learnStep === 4 && (
                <div className="text-xs text-slate-700 space-y-2 bg-white p-3 rounded-xl border border-indigo-100">
                  <strong className="text-indigo-900 block">
                    Tổng kết &amp; Toàn bộ 12 bảng hợp lệ:
                  </strong>
                  <p className="font-mono text-indigo-800 font-black">
                    Tổng số bảng = 6 (hàng 1) × 2 (hàng 2) × 1 (hàng 3) = 12 bảng.
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() =>
                        setSelectedEnumeratedIdx((p) =>
                          p > 0 ? p - 1 : allValidSquares.length - 1
                        )
                      }
                      className="rounded-lg border border-slate-200 p-1 hover:bg-slate-50"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[11px] font-bold text-slate-700">
                      Bảng mẫu {selectedEnumeratedIdx + 1} / 12
                    </span>
                    <button
                      onClick={() =>
                        setSelectedEnumeratedIdx((p) =>
                          p < allValidSquares.length - 1 ? p + 1 : 0
                        )
                      }
                      className="rounded-lg border border-slate-200 p-1 hover:bg-slate-50"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => setGrid(allValidSquares[selectedEnumeratedIdx])}
                    className="w-full rounded-lg bg-indigo-50 py-1.5 text-[11px] font-bold text-indigo-800 hover:bg-indigo-100 transition"
                  >
                    Xem bảng này trên mô phỏng →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
