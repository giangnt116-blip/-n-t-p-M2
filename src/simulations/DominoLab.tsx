import React, { useState, useMemo } from "react";
import {
  RotateCcw,
  RotateCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Puzzle,
  Undo2,
  HelpCircle,
  Plus,
  Play,
  ArrowRight,
} from "lucide-react";
import { QuestionMode } from "../types/question";
import {
  DominoConfig,
  DominoPiece,
  PlacedPiece,
  getDegreeCounts,
  canConnect,
  findValidDominoChain,
} from "../utils/dominoUtils";

interface DominoLabProps {
  config?: DominoConfig;
  mode: QuestionMode;
}

export const DominoLab: React.FC<DominoLabProps> = ({ config, mode }) => {
  const pieces: DominoPiece[] = useMemo(
    () =>
      config?.pieces || [
        { id: "d1", a: 1, b: 2 },
        { id: "d2", a: 2, b: 3 },
        { id: "d3", a: 3, b: 1 },
        { id: "d4", a: 1, b: 4 },
        { id: "d5", a: 4, b: 2 },
      ],
    [config?.pieces]
  );

  // Current orientation in hand/pool for each piece
  const [pieceOrientations, setPieceOrientations] = useState<
    Record<string, { a: number; b: number; isFlipped: boolean }>
  >(() => {
    const initial: Record<string, { a: number; b: number; isFlipped: boolean }> =
      {};
    pieces.forEach((p) => {
      initial[p.id] = { a: p.a, b: p.b, isFlipped: false };
    });
    return initial;
  });

  // State
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [placedChain, setPlacedChain] = useState<PlacedPiece[]>([]);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  // Learn Mode states
  const [showEulerAnalysis, setShowEulerAnalysis] = useState<boolean>(
    mode === "learn"
  );
  const [hintText, setHintText] = useState<string | null>(null);

  // Pre-calculate Euler degrees
  const degreeCounts = useMemo(() => getDegreeCounts(pieces), [pieces]);
  const oddDegreeNumbers = useMemo(() => {
    return Object.entries(degreeCounts)
      .filter(([_, count]) => Number(count) % 2 !== 0)
      .map(([num]) => Number(num));
  }, [degreeCounts]);

  // Solver for Learn Mode
  const validFullChain = useMemo(() => {
    return findValidDominoChain(pieces);
  }, [pieces]);

  // Set of used piece IDs
  const usedPieceIds = useMemo(() => {
    return new Set(placedChain.map((p) => p.id));
  }, [placedChain]);

  // Last placed piece in the chain
  const lastPlaced = placedChain[placedChain.length - 1];

  // Rotate a piece in the source rack
  const handleRotatePiece = (pieceId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (usedPieceIds.has(pieceId)) return;

    setPieceOrientations((prev) => {
      const current = prev[pieceId];
      if (!current) return prev;
      return {
        ...prev,
        [pieceId]: {
          a: current.b,
          b: current.a,
          isFlipped: !current.isFlipped,
        },
      };
    });
    setFeedback(null);
  };

  // Select piece from pool
  const handleSelectPiece = (pieceId: string) => {
    if (usedPieceIds.has(pieceId)) return;
    setSelectedPieceId(pieceId === selectedPieceId ? null : pieceId);
    setFeedback(null);
  };

  // Add selected piece to chain
  const handleAddToChain = () => {
    if (!selectedPieceId) return;
    const currentOrientation = pieceOrientations[selectedPieceId];
    if (!currentOrientation) return;

    const originalPiece = pieces.find((p) => p.id === selectedPieceId);
    if (!originalPiece) return;

    // Check validity
    if (!canConnect(lastPlaced, currentOrientation.a)) {
      setFeedback({
        ok: false,
        text: `❌ Chưa hợp lệ: Đầu ${lastPlaced?.b} cần nối với một đầu ${lastPlaced?.b}. Quân bạn chọn đang có đầu trái là ${currentOrientation.a}. Hãy bấm nút xoay ↻ nếu muốn lật đầu!`,
      });
      return;
    }

    const nextPlacedPiece: PlacedPiece = {
      id: selectedPieceId,
      a: currentOrientation.a,
      b: currentOrientation.b,
      originalA: originalPiece.a,
      originalB: originalPiece.b,
      isFlipped: currentOrientation.isFlipped,
    };

    const nextChain = [...placedChain, nextPlacedPiece];
    setPlacedChain(nextChain);
    setSelectedPieceId(null);

    if (nextChain.length === pieces.length) {
      setFeedback({
        ok: true,
        text: `🎉 ✅ Hợp lệ: Em đã tạo được một chuỗi dùng tất cả domino!`,
      });
    } else {
      setFeedback({
        ok: true,
        text: `✅ Hợp lệ: Đã nối [${nextPlacedPiece.a}|${nextPlacedPiece.b}] vào chuỗi.`,
      });
    }
  };

  // Remove the last placed piece
  const handleUndoLast = () => {
    if (placedChain.length === 0) return;
    const removedPiece = placedChain[placedChain.length - 1];
    setPlacedChain((prev) => prev.slice(0, -1));
    setFeedback({
      ok: true,
      text: `Đã gỡ quân [${removedPiece.a}|${removedPiece.b}] khỏi cuối chuỗi.`,
    });
  };

  // Reset entire chain
  const handleReset = () => {
    setPlacedChain([]);
    setSelectedPieceId(null);
    setFeedback(null);
    setHintText(null);
    // Reset orientations
    const initial: Record<string, { a: number; b: number; isFlipped: boolean }> =
      {};
    pieces.forEach((p) => {
      initial[p.id] = { a: p.a, b: p.b, isFlipped: false };
    });
    setPieceOrientations(initial);
  };

  // Learn Mode: Hint first piece
  const handleShowHint = () => {
    if (oddDegreeNumbers.length > 0) {
      setHintText(
        `💡 Gợi ý chuỗi: Hãy thử bắt đầu bằng một quân có chứa số ${oddDegreeNumbers[0]} hoặc ${oddDegreeNumbers[1]} (các số xuất hiện số lần lẻ ở các đầu).`
      );
    } else {
      setHintText("💡 Gợi ý chuỗi: Bạn có thể bắt đầu bằng bất kỳ quân nào.");
    }
  };

  // Learn Mode: Load full solution
  const handleLoadFullSolution = () => {
    if (validFullChain) {
      setPlacedChain(validFullChain);
      setSelectedPieceId(null);
      setFeedback({
        ok: true,
        text: `Đang hiển thị một chuỗi hoàn chỉnh dùng đủ 5 quân Domino.`,
      });
    }
  };

  const selectedPiece = selectedPieceId
    ? pieces.find((p) => p.id === selectedPieceId)
    : null;
  const selectedOrientation = selectedPieceId
    ? pieceOrientations[selectedPieceId]
    : null;

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-slate-50/70 to-white p-5 shadow-xs space-y-5">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Puzzle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mô phỏng tương tác
              </span>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-700">
                dominoLab
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Ghép nối Chuỗi Domino liên tục
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {mode === "learn" && (
            <>
              <button
                onClick={handleShowHint}
                className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 shadow-2xs hover:bg-amber-100 active:scale-95 transition"
              >
                <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
                <span>Xem gợi ý chuỗi</span>
              </button>

              <button
                onClick={handleLoadFullSolution}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Xem lời giải từng bước</span>
              </button>
            </>
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

      {/* Hint Alert if triggered */}
      {hintText && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-900">
          <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
          <span>{hintText}</span>
        </div>
      )}

      {/* 1. SOURCE PIECES RACK */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Các quân Domino có sẵn (Chọn quân rồi thêm vào chuỗi):
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Đã dùng: {placedChain.length}/{pieces.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {pieces.map((piece) => {
            const isUsed = usedPieceIds.has(piece.id);
            const isSelected = selectedPieceId === piece.id;
            const orientation = pieceOrientations[piece.id] || {
              a: piece.a,
              b: piece.b,
            };

            return (
              <div
                key={piece.id}
                onClick={() => !isUsed && handleSelectPiece(piece.id)}
                className={`group relative flex items-center rounded-xl border-2 transition-all select-none ${
                  isUsed
                    ? "border-slate-200 bg-slate-100 opacity-40 cursor-not-allowed"
                    : isSelected
                    ? "border-indigo-600 bg-indigo-50/60 shadow-md ring-2 ring-indigo-300 scale-105 cursor-pointer"
                    : "border-slate-300 bg-slate-50 hover:border-indigo-300 hover:bg-white cursor-pointer shadow-2xs"
                }`}
              >
                {/* Domino Half A */}
                <div className="flex h-12 w-10 items-center justify-center border-r border-slate-300 text-lg font-black text-slate-800 font-mono">
                  {orientation.a}
                </div>
                {/* Domino Half B */}
                <div className="flex h-12 w-10 items-center justify-center text-lg font-black text-slate-800 font-mono">
                  {orientation.b}
                </div>

                {/* Rotate button for unplaced piece */}
                {!isUsed && (
                  <button
                    onClick={(e) => handleRotatePiece(piece.id, e)}
                    className="absolute -top-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-300 text-slate-600 shadow-2xs hover:bg-indigo-600 hover:text-white transition active:scale-90"
                    title="Xoay đảo 2 đầu quân này"
                  >
                    <RotateCw className="h-3 w-3" />
                  </button>
                )}

                {/* Used checkmark badge */}
                {isUsed && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 rounded-xl">
                    <span className="rounded-full bg-slate-700 text-white p-0.5">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Bar for Selected Piece */}
        {selectedPiece && selectedOrientation && !usedPieceIds.has(selectedPiece.id) && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50/50 p-3 mt-2">
            <div className="flex items-center gap-2 text-xs text-indigo-950 font-medium">
              <span>Đang chọn quân:</span>
              <span className="font-mono font-black text-sm bg-white px-2 py-0.5 rounded border border-indigo-200 text-indigo-700">
                [{selectedOrientation.a} | {selectedOrientation.b}]
              </span>
              <button
                onClick={(e) => handleRotatePiece(selectedPiece.id, e)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <RotateCw className="h-3 w-3 text-indigo-600" />
                <span>Xoay ↻</span>
              </button>
            </div>

            <button
              onClick={handleAddToChain}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm vào chuỗi</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. PLACED CHAIN DISPLAY */}
      <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-white p-5 space-y-3 min-h-[160px] flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Chuỗi Domino của em ({placedChain.length} quân):
          </span>
          {placedChain.length > 0 && (
            <button
              onClick={handleUndoLast}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              <Undo2 className="h-3 w-3" />
              <span>↶ Gỡ quân cuối</span>
            </button>
          )}
        </div>

        {placedChain.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400 space-y-1">
            <Puzzle className="h-8 w-8 text-slate-300" />
            <p className="text-xs font-medium">Chuỗi đang trống.</p>
            <p className="text-[11px] text-slate-400">
              Nhấn chọn một quân ở phía trên rồi bấm "Thêm vào chuỗi".
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 py-2">
            {placedChain.map((piece, index) => {
              const isFirst = index === 0;
              const isLast = index === placedChain.length - 1;

              return (
                <React.Fragment key={`${piece.id}-${index}`}>
                  <div
                    className={`flex items-center rounded-xl border-2 shadow-2xs select-none transition-all ${
                      isLast
                        ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200"
                        : "border-slate-700 bg-slate-900 text-white"
                    }`}
                  >
                    {/* Left half */}
                    <div
                      className={`flex h-12 w-10 items-center justify-center border-r font-mono text-lg font-black ${
                        isLast
                          ? "border-indigo-200 text-indigo-950 bg-white"
                          : "border-slate-700 text-white bg-slate-800"
                      } rounded-l-[10px]`}
                    >
                      {piece.a}
                    </div>
                    {/* Right half */}
                    <div
                      className={`flex h-12 w-10 items-center justify-center font-mono text-lg font-black ${
                        isLast
                          ? "text-indigo-950 bg-white"
                          : "text-white bg-slate-800"
                      } rounded-r-[10px]`}
                    >
                      {piece.b}
                    </div>
                  </div>

                  {/* Connect arrow if not last */}
                  {!isLast && (
                    <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Tail connection hint */}
        {placedChain.length > 0 && placedChain.length < pieces.length && (
          <div className="text-[11px] text-indigo-900 bg-indigo-50/60 p-2 rounded-lg font-medium">
            Đầu nối tiếp theo cần có số:{" "}
            <strong className="text-indigo-700 font-mono text-xs">
              [{lastPlaced?.b}]
            </strong>
          </div>
        )}
      </div>

      {/* FEEDBACK STATUS */}
      {feedback && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3 text-xs font-medium ${
            feedback.ok
              ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          {feedback.ok ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* LEARN MODE: EULER DEGREE ANALYSIS TABLE & TEACHING POINT */}
      {mode === "learn" && showEulerAnalysis && (
        <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Phân tích tính liên tục theo Bậc của các số (Ý tưởng Đường đi Euler)</span>
            </div>
            <span className="text-[11px] font-medium text-emerald-800">
              Chỉ 2 số xuất hiện lẻ lần: <strong>1</strong> và <strong>2</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bg-white rounded-xl overflow-hidden border border-emerald-200">
              <thead className="bg-emerald-100/70 text-emerald-950 font-black">
                <tr>
                  <th className="p-2.5">Con số</th>
                  <th className="p-2.5">Số lần xuất hiện ở các đầu quân</th>
                  <th className="p-2.5">Chẵn / Lẻ</th>
                  <th className="p-2.5">Ý nghĩa cấu trúc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 text-slate-700 font-medium">
                {Object.entries(degreeCounts)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([num, count]) => {
                    const isOdd = Number(count) % 2 !== 0;
                    return (
                      <tr
                        key={num}
                        className={isOdd ? "bg-amber-50/60 font-bold" : "hover:bg-emerald-50/30"}
                      >
                        <td className="p-2.5 font-mono text-sm font-black text-slate-900">
                          {num}
                        </td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700">
                          {count} lần
                        </td>
                        <td className="p-2.5">
                          {isOdd ? (
                            <span className="rounded-md bg-amber-200/80 px-2 py-0.5 text-[11px] text-amber-900 font-extrabold">
                              Số lẻ (Bậc lẻ)
                            </span>
                          ) : (
                            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] text-emerald-800">
                              Số chẵn (Bậc chẵn)
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-[11px] text-slate-600">
                          {isOdd
                            ? "→ Phải là điểm BẮT ĐẦU hoặc KẾT THÚC của chuỗi!"
                            : "→ Là điểm TRUNG GIAN (đi vào rồi lại đi ra)."}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-emerald-300 bg-white p-3 text-center space-y-1">
            <p className="text-xs font-bold text-emerald-900">
              Teaching Point: “Hai số xuất hiện lẻ lần có thể trở thành hai đầu của chuỗi. Em sẽ gặp ý tưởng này sâu hơn ở phần Graph (Đường đi Euler).”
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
