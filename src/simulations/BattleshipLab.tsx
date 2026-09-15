import React, { useState, useMemo, useEffect } from "react";
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Crosshair,
  Shield,
  HelpCircle,
  Eye,
  Dice5,
  Play,
  ChevronLeft,
  ChevronRight,
  Target,
  Waves,
} from "lucide-react";
import { QuestionMode } from "../types/question";
import {
  BattleshipConfig,
  CellCoord,
  ShipPlacement,
  generateShipPlacements,
  evaluateCoverage,
  getCounterexample,
  isSameCoord,
  isCellShot,
} from "../utils/battleshipUtils";

interface BattleshipLabProps {
  config?: BattleshipConfig;
  mode: QuestionMode;
}

export const BattleshipLab: React.FC<BattleshipLabProps> = ({ config, mode }) => {
  const rows = config?.rows ?? 4;
  const cols = config?.cols ?? 4;
  const shipLength = config?.shipLength ?? 3;
  const orientations = config?.orientations ?? ["horizontal", "vertical"];

  // Generate all ship placements based strictly on config
  const allPlacements = useMemo<ShipPlacement[]>(() => {
    return generateShipPlacements(rows, cols, shipLength, orientations);
  }, [rows, cols, shipLength, orientations]);

  // Tab State: "guaranteed" (🎯 ĐẢM BẢO TRÚNG - default) vs "play" (🎮 CHƠI THỬ)
  const [activeTab, setActiveTab] = useState<"guaranteed" | "play">("guaranteed");

  // ==================== TAB 2: ĐẢM BẢO TRÚNG (Selected Shots) ====================
  const [selectedShots, setSelectedShots] = useState<CellCoord[]>([]);
  const [hasCheckedStrategy, setHasCheckedStrategy] = useState<boolean>(false);
  const [highlightedUncoveredShip, setHighlightedUncoveredShip] = useState<ShipPlacement | null>(null);

  // Auto clear counterexample highlight after 4 seconds
  useEffect(() => {
    if (highlightedUncoveredShip) {
      const timer = setTimeout(() => {
        setHighlightedUncoveredShip(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [highlightedUncoveredShip]);

  // Coverage evaluation for Tab 2
  const coverage = useMemo(() => {
    return evaluateCoverage(allPlacements, selectedShots);
  }, [allPlacements, selectedShots]);

  const toggleShot = (r: number, c: number) => {
    setHasCheckedStrategy(false);
    setHighlightedUncoveredShip(null);
    setSelectedShots((prev) => {
      const exists = prev.some((s) => s.r === r && s.c === c);
      if (exists) {
        return prev.filter((s) => !(s.r === r && s.c === c));
      } else {
        return [...prev, { r, c }];
      }
    });
  };

  const handleCheckStrategy = () => {
    setHasCheckedStrategy(true);
    setHighlightedUncoveredShip(null);
  };

  const handleShowCounterexample = () => {
    const counter = getCounterexample(allPlacements, selectedShots);
    if (counter) {
      setHighlightedUncoveredShip(counter);
    }
  };

  const handleResetShots = () => {
    setSelectedShots([]);
    setHasCheckedStrategy(false);
    setHighlightedUncoveredShip(null);
  };

  // ==================== TAB 1: CHƠI THỬ (Interactive Mini-game) ====================
  const [hiddenShip, setHiddenShip] = useState<ShipPlacement | null>(null);
  const [playShots, setPlayShots] = useState<CellCoord[]>([]);

  // Randomize hidden ship
  const randomizeHiddenShip = () => {
    if (allPlacements.length === 0) return;
    const randomIndex = Math.floor(Math.random() * allPlacements.length);
    setHiddenShip(allPlacements[randomIndex]);
    setPlayShots([]);
  };

  // Initialize hidden ship on mount
  useEffect(() => {
    if (!hiddenShip && allPlacements.length > 0) {
      randomizeHiddenShip();
    }
  }, [allPlacements]);

  const handlePlayFire = (r: number, c: number) => {
    if (playShots.some((s) => s.r === r && s.c === c)) return;
    setPlayShots((prev) => [...prev, { r, c }]);
  };

  const playHitCount = useMemo(() => {
    if (!hiddenShip) return 0;
    return hiddenShip.cells.filter((cell) => isCellShot(cell, playShots)).length;
  }, [hiddenShip, playShots]);

  const isPlayWon = hiddenShip ? playHitCount === hiddenShip.cells.length : false;

  // ==================== LEARN MODE (5-Step Progressive Proof) ====================
  const [learnStep, setLearnStep] = useState<number>(mode === "learn" ? 1 : 0);

  // Solution 5 shots for step 5
  // (1,2), (2,1), (2,4), (3,3), (4,2) in 1-based indexing = (0,1), (1,0), (1,3), (2,2), (3,1) in 0-based
  const sampleSolutionShots: CellCoord[] = useMemo(
    () => [
      { r: 0, c: 1 }, // Hàng 1, Cột 2
      { r: 1, c: 0 }, // Hàng 2, Cột 1
      { r: 1, c: 3 }, // Hàng 2, Cột 4
      { r: 2, c: 2 }, // Hàng 3, Cột 3
      { r: 3, c: 1 }, // Hàng 4, Cột 2
    ],
    []
  );

  const applySolutionShotsToTab = () => {
    setSelectedShots([...sampleSolutionShots]);
    setActiveTab("guaranteed");
    setHasCheckedStrategy(true);
    setHighlightedUncoveredShip(null);
  };

  return (
    <div className="rounded-2xl border border-sky-100 bg-gradient-to-b from-sky-50/40 via-white to-slate-50/70 p-5 shadow-xs space-y-5">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
            <Crosshair className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mô phỏng tương tác
              </span>
              <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-mono font-bold text-sky-700">
                battleshipLab
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Chiến trường Bắn tàu: Tìm Chiến thuật Chắc chắn Thắng
            </h3>
          </div>
        </div>

        {/* Tab Switcher & Learn Mode Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tabs */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab("guaranteed")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 transition ${
                activeTab === "guaranteed"
                  ? "bg-white text-sky-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Target className="h-3.5 w-3.5" />
              <span>🎯 Đảm bảo trúng</span>
            </button>
            <button
              onClick={() => setActiveTab("play")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 transition ${
                activeTab === "play"
                  ? "bg-white text-indigo-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Play className="h-3.5 w-3.5" />
              <span>🎮 Chơi thử</span>
            </button>
          </div>

          {/* Learn Mode Toggle */}
          {mode === "learn" && (
            <button
              onClick={() => setLearnStep(learnStep > 0 ? 0 : 1)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                learnStep > 0
                  ? "bg-sky-600 text-white shadow-xs"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{learnStep > 0 ? "Ẩn phân tích" : "🔍 Vì sao cần ít nhất 5 phát?"}</span>
            </button>
          )}

          {activeTab === "guaranteed" ? (
            <button
              onClick={handleResetShots}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition shadow-2xs"
              title="Xóa tất cả các phát bắn đã chọn"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>↺ Xóa chọn</span>
            </button>
          ) : (
            <button
              onClick={randomizeHiddenShip}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition shadow-2xs"
              title="Giấu một con tàu mới ở vị trí ngẫu nhiên"
            >
              <Dice5 className="h-3.5 w-3.5" />
              <span>🎲 Giấu tàu mới</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 2: ĐẢM BẢO TRÚNG (CORE PEDAGOGICAL VIEW) */}
      {/* ========================================================================= */}
      {activeTab === "guaranteed" && (
        <div className="space-y-4">
          {/* STATS STRIP */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Shots Selected */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Số phát đã chọn
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-sky-700 font-mono">
                  {selectedShots.length}
                </span>
                <span className="text-xs font-bold text-slate-400">ô bắn</span>
              </div>
            </div>

            {/* Coverage Counter */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Khả năng chặn tàu
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black font-mono text-slate-800">
                  {coverage.coveredCount}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  / {allPlacements.length} vị trí tàu
                </span>
              </div>
            </div>

            {/* Certainty Status */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Độ chắc chắn
              </div>
              <div className="flex items-center gap-1.5 text-xs font-extrabold">
                {coverage.coversAll ? (
                  <span className="flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ✅ Chắc chắn trúng 100%
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-700">
                    <Shield className="h-4 w-4 text-amber-600 shrink-0" />
                    Chưa đảm bảo mọi trường hợp
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* MAIN GRID & CONTROLS: Two-column on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT: 4x4 Interactive Battleship Board */}
            <div className="lg:col-span-6 rounded-2xl border border-sky-200/80 bg-sky-900/5 p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Bảng tọa độ {rows} × {cols}:</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Click vào ô để đánh dấu vị trí bắn
                </span>
              </div>

              {/* Grid Canvas */}
              <div className="flex flex-col items-center">
                {/* Column coordinates labels */}
                <div className="grid grid-cols-4 w-64 sm:w-80 mb-1 text-center font-mono text-xs font-bold text-slate-400">
                  <span>C1</span>
                  <span>C2</span>
                  <span>C3</span>
                  <span>C4</span>
                </div>

                <div className="flex">
                  {/* Row coordinates labels */}
                  <div className="flex flex-col justify-around pr-2 font-mono text-xs font-bold text-slate-400">
                    <span>H1</span>
                    <span>H2</span>
                    <span>H3</span>
                    <span>H4</span>
                  </div>

                  {/* 4x4 Cells */}
                  <div className="grid grid-cols-4 gap-2 w-64 sm:w-80 h-64 sm:h-80 bg-sky-950 p-2.5 rounded-2xl shadow-inner border border-sky-900">
                    {Array.from({ length: rows }).map((_, r) =>
                      Array.from({ length: cols }).map((_, c) => {
                        const isShot = selectedShots.some((s) => s.r === r && s.c === c);
                        const isCounterpart =
                          highlightedUncoveredShip &&
                          highlightedUncoveredShip.cells.some((cell) => cell.r === r && cell.c === c);

                        return (
                          <button
                            key={`${r}-${c}`}
                            onClick={() => toggleShot(r, c)}
                            aria-label={`Hàng ${r + 1} cột ${c + 1}`}
                            className={`relative flex items-center justify-center rounded-xl transition-all font-mono font-bold text-base select-none ${
                              isShot
                                ? "bg-amber-400 text-amber-950 shadow-md ring-2 ring-amber-300 scale-95"
                                : isCounterpart
                                ? "bg-rose-500 text-white animate-pulse ring-2 ring-rose-300"
                                : "bg-sky-800/80 text-sky-200 hover:bg-sky-700/90 active:scale-95 border border-sky-700/50"
                            }`}
                          >
                            {isShot ? (
                              <span className="flex flex-col items-center text-xs font-extrabold">
                                <Crosshair className="h-5 w-5 text-amber-950" />
                                <span className="text-[10px] mt-0.5">Bắn</span>
                              </span>
                            ) : isCounterpart ? (
                              <span className="flex flex-col items-center text-xs font-extrabold text-white">
                                <span className="text-lg">🚢</span>
                                <span className="text-[9px]">Tàu né</span>
                              </span>
                            ) : (
                              <span className="text-xs text-sky-400/60 opacity-60">
                                {r + 1},{c + 1}
                              </span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-3.5 w-3.5 rounded bg-amber-400 border border-amber-500 inline-block" />
                  <span>Ô đã chọn bắn</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3.5 w-3.5 rounded bg-rose-500 border border-rose-600 inline-block" />
                  <span>Vị trí tàu trốn thoát (phản ví dụ)</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Validation Controls, Feedback & Counterexample Inspector */}
            <div className="lg:col-span-6 space-y-4">
              {/* Guidance card */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  🎯 Nhiệm vụ tư duy chiến lược
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Con tàu chiếm đúng <strong>3 ô liên tiếp</strong> (ngang 1×3 hoặc dọc 3×1). Hãy chọn các ô bắn sao cho <strong>dù đối phương giấu tàu ở bất kỳ đâu trong {allPlacements.length} vị trí có thể</strong>, con tàu cũng chắc chắn bị bắn trúng ít nhất 1 ô!
                </p>

                {/* Primary Action Button */}
                <div className="pt-2 flex flex-wrap gap-2 items-center">
                  <button
                    onClick={handleCheckStrategy}
                    className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-sky-700 active:scale-95 transition"
                  >
                    <Crosshair className="h-4 w-4" />
                    <span>Kiểm tra có chắc chắn trúng không?</span>
                  </button>

                  {!coverage.coversAll && selectedShots.length > 0 && (
                    <button
                      onClick={handleShowCounterexample}
                      className="flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-800 shadow-2xs hover:bg-rose-100 active:scale-95 transition"
                    >
                      <Eye className="h-3.5 w-3.5 text-rose-600" />
                      <span>👀 Cho em xem một cách tàu có thể trốn</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Strategy Results Alert */}
              {hasCheckedStrategy && (
                <div className="space-y-3">
                  {coverage.coversAll ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-900 space-y-2 animate-in fade-in">
                      <div className="flex items-center gap-2 font-bold text-sm text-emerald-950">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                        <span>✅ Chiến thuật này đảm bảo trúng tàu trong mọi trường hợp!</span>
                      </div>
                      <p>
                        Toàn bộ <strong>{coverage.coveredCount}/{allPlacements.length} vị trí tàu</strong> (cả ngang lẫn dọc) đều bị chặn đứng bởi các phát bắn của em. Không còn bất kỳ vị trí tàu 3 ô nào có thể lọt qua!
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-950 space-y-2 animate-in fade-in">
                      <div className="flex items-center gap-2 font-bold text-sm text-rose-800">
                        <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                        <span>❌ Chưa đảm bảo trúng!</span>
                      </div>
                      <p>
                        Vẫn có tàu 1x3 tránh được tất cả các phát bắn của em!
                      </p>
                      <p className="text-[11px] text-rose-700">
                        Hiện tại chiến thuật của em mới chỉ chặn được <strong>{coverage.coveredCount} / {allPlacements.length}</strong> vị trí có thể đặt tàu.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Counterexample Highlight Card */}
              {highlightedUncoveredShip && (
                <div className="rounded-xl border border-rose-300 bg-white p-3.5 shadow-xs space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-xs text-rose-800">
                    <span className="text-base">🚢</span>
                    <span>Phản ví dụ tìm thấy:</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Nếu đối phương giấu tàu tại <strong>{highlightedUncoveredShip.label}</strong> (các ô màu đỏ đang chớp trên bàn cờ), thì con tàu hoàn toàn <strong>né được toàn bộ</strong> các phát bắn hiện tại của em!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: CHƠI THỬ (MINI-GAME TO BUILD INTUITION) */}
      {/* ========================================================================= */}
      {activeTab === "play" && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                🎮 Chơi thử: Dự đoán & Tìm tàu đang ẩn nấp
              </h4>
              <p className="text-[11px] text-slate-500">
                Máy đã bí mật giấu 1 con tàu dài 3 ô. Hãy thử bắn từng ô để cảm nhận xác suất trúng/trượt.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="text-slate-600">Đã bắn: {playShots.length} phát</span>
              <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Trúng: {playHitCount} / 3 ô
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-2">
            {/* Play Board */}
            <div className="grid grid-cols-4 gap-2 w-64 h-64 bg-slate-900 p-2.5 rounded-2xl shadow-inner border border-slate-800">
              {Array.from({ length: rows }).map((_, r) =>
                Array.from({ length: cols }).map((_, c) => {
                  const isShot = playShots.some((s) => s.r === r && s.c === c);
                  const isHit =
                    hiddenShip &&
                    isShot &&
                    hiddenShip.cells.some((cell) => cell.r === r && cell.c === c);

                  return (
                    <button
                      key={`play-${r}-${c}`}
                      onClick={() => handlePlayFire(r, c)}
                      disabled={isShot || isPlayWon}
                      aria-label={`Bắn ô hàng ${r + 1} cột ${c + 1}`}
                      className={`flex items-center justify-center rounded-xl transition-all font-mono font-bold select-none ${
                        isHit
                          ? "bg-rose-500 text-white shadow-md animate-bounce ring-2 ring-rose-300"
                          : isShot
                          ? "bg-slate-700 text-slate-400"
                          : "bg-indigo-900/80 text-indigo-200 hover:bg-indigo-800 active:scale-95 border border-indigo-700/50 cursor-crosshair"
                      }`}
                    >
                      {isHit ? (
                        <span className="text-xl">🎯</span>
                      ) : isShot ? (
                        <span className="text-lg text-sky-300">💦</span>
                      ) : (
                        <span className="text-xs text-indigo-400/50">?</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Play Status Box */}
            <div className="w-full sm:w-64 space-y-3">
              {isPlayWon ? (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-950 font-bold space-y-2">
                  <div className="flex items-center gap-1.5 text-sm text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>🎉 Bắn chìm tàu thành công!</span>
                  </div>
                  <p className="font-normal text-slate-700">
                    Em đã tìm thấy cả 3 ô của con tàu sau <strong>{playShots.length}</strong> phát bắn!
                  </p>
                  <button
                    onClick={randomizeHiddenShip}
                    className="w-full rounded-lg bg-emerald-600 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    Chơi ván mới
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Waves className="h-4 w-4 text-sky-500" />
                    <span>Tình hình chiến sự:</span>
                  </div>
                  <p>
                    {playShots.length === 0
                      ? "Chưa bắn phát nào. Hãy nhấp vào một ô bất kỳ để thăm dò!"
                      : playHitCount > 0
                      ? "🎯 Trúng tàu rồi! Tiếp tục tìm các ô liền kề!"
                      : "💦 Trượt rồi! Tàu không ở ô này."}
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-[11px] text-indigo-900 space-y-1">
                <span className="font-bold">💡 Nhận xét sư phạm:</span>
                <p>
                  Chơi thử có thể may mắn trúng sớm, nhưng chiến thuật Logic M2 đòi hỏi em phải tìm ra một tập hợp các phát bắn <strong>bảo đảm chắc chắn trúng trong mọi trường hợp</strong> (chuyển sang tab 🎯 Đảm bảo trúng)!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEARN MODE: 5-STEP PEDAGOGICAL PROOF */}
      {/* ========================================================================= */}
      {mode === "learn" && learnStep > 0 && (
        <div className="space-y-4 rounded-2xl border border-sky-200 bg-sky-50/50 p-4">
          {/* Header & Step navigation */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-200/70 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-950">
              <Sparkles className="h-4 w-4 text-sky-600" />
              <span>Chứng minh Toán học: Vì sao cần ít nhất 5 phát bắn?</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold">
              <button
                onClick={() => setLearnStep((s) => Math.max(1, s - 1))}
                disabled={learnStep === 1}
                className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-30"
              >
                <ChevronLeft className="h-3 w-3" />
                <span>Trước</span>
              </button>
              <span className="px-2 text-slate-600">
                Bước {learnStep} / 5
              </span>
              <button
                onClick={() => setLearnStep((s) => Math.min(5, s + 1))}
                disabled={learnStep === 5}
                className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-sky-600 text-white disabled:opacity-30"
              >
                <span>Tiếp</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* BƯỚC 1: Xét riêng các tàu nằm ngang */}
          {learnStep === 1 && (
            <div className="space-y-3 rounded-xl border border-sky-300 bg-white p-4 text-xs text-slate-700 animate-in fade-in">
              <div className="flex items-center justify-between font-bold text-sky-950 border-b border-slate-100 pb-2">
                <span className="text-sm">Bước 1: Khảo sát các con tàu nằm ngang</span>
                <span className="text-[11px] text-slate-400 font-normal">Hàng dài 4 ô, tàu dài 3 ô</span>
              </div>
              <p className="leading-relaxed">
                Trong mỗi hàng ngang dài 4 ô, một con tàu dài 3 ô chỉ có đúng <strong>2 vị trí có thể đặt</strong>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
                  <strong className="text-slate-800 block mb-1 font-sans">Vị trí 1 (chiếm cột 1, 2, 3):</strong>
                  <div className="flex gap-1">
                    <span className="px-2 py-1 rounded bg-sky-600 text-white font-bold">[1]</span>
                    <span className="px-2 py-1 rounded bg-sky-600 text-white font-bold">[2]</span>
                    <span className="px-2 py-1 rounded bg-sky-600 text-white font-bold">[3]</span>
                    <span className="px-2 py-1 rounded bg-slate-200 text-slate-400">[.]</span>
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
                  <strong className="text-slate-800 block mb-1 font-sans">Vị trí 2 (chiếm cột 2, 3, 4):</strong>
                  <div className="flex gap-1">
                    <span className="px-2 py-1 rounded bg-slate-200 text-slate-400">[.]</span>
                    <span className="px-2 py-1 rounded bg-sky-600 text-white font-bold">[2]</span>
                    <span className="px-2 py-1 rounded bg-sky-600 text-white font-bold">[3]</span>
                    <span className="px-2 py-1 rounded bg-sky-600 text-white font-bold">[4]</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 text-[11px]">
                Với 4 hàng ngang, có tổng cộng <strong>4 × 2 = 8 vị trí tàu ngang</strong>. Tương tự với 4 cột dọc, có <strong>4 × 2 = 8 vị trí tàu dọc</strong>. Tổng cộng là <strong>16 vị trí tàu có thể</strong>.
              </p>
            </div>
          )}

          {/* BƯỚC 2: Ràng buộc số phát trên 4 hàng ngang */}
          {learnStep === 2 && (
            <div className="space-y-3 rounded-xl border border-sky-300 bg-white p-4 text-xs text-slate-700 animate-in fade-in">
              <div className="flex items-center justify-between font-bold text-sky-950 border-b border-slate-100 pb-2">
                <span className="text-sm">Bước 2: Mỗi hàng ngang bắt buộc phải có ít nhất 1 phát bắn</span>
                <span className="text-[11px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded">4 hàng → Cần ít nhất 4 phát</span>
              </div>
              <p className="leading-relaxed">
                Nếu một hàng ngang nào đó <strong>hoàn toàn không có phát bắn nào</strong>, đối phương có thể thong thả đặt tàu ngang dài 3 ô vào hàng đó mà không hề bị trúng!
              </p>
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-800">
                  Suy ra: Muốn chặn được các tàu ngang ở cả 4 hàng:
                </div>
                <p className="text-slate-600">
                  • Hàng 1 bắt buộc phải có ít nhất 1 phát bắn.<br />
                  • Hàng 2 bắt buộc phải có ít nhất 1 phát bắn.<br />
                  • Hàng 3 bắt buộc phải có ít nhất 1 phát bắn.<br />
                  • Hàng 4 bắt buộc phải có ít nhất 1 phát bắn.
                </p>
                <div className="font-bold text-sky-800 pt-1">
                  👉 Do đó, nếu ta chỉ dùng <strong>đúng 4 phát bắn</strong>, thì bắt buộc <strong>mỗi hàng phải có đúng 1 phát bắn</strong>!
                </div>
              </div>
            </div>
          )}

          {/* BƯỚC 3: Vị trí của phát bắn trong mỗi hàng */}
          {learnStep === 3 && (
            <div className="space-y-3 rounded-xl border border-sky-300 bg-white p-4 text-xs text-slate-700 animate-in fade-in">
              <div className="flex items-center justify-between font-bold text-sky-950 border-b border-slate-100 pb-2">
                <span className="text-sm">Bước 3: Phát bắn duy nhất trong hàng phải nằm ở đâu?</span>
                <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Giao của 2 vị trí</span>
              </div>
              <p className="leading-relaxed">
                Trong một hàng, tàu có thể nằm ở [1, 2, 3] hoặc [2, 3, 4]. Nếu ta chỉ bắn <strong>1 phát duy nhất</strong> trong hàng đó, phát bắn này muốn trúng cả 2 khả năng thì bắt buộc phải thuộc vào <strong>giao của hai vị trí</strong>:
              </p>
              <div className="rounded-lg bg-amber-50 p-3 border border-amber-200 text-amber-950 font-mono space-y-1">
                <div>[1, 2, 3] ∩ [2, 3, 4] = &#123; Cột 2, Cột 3 &#125;</div>
                <div className="font-sans font-normal text-xs text-amber-900 pt-1">
                  • Nếu bắn vào Cột 1: Tàu ở [2, 3, 4] sẽ né được.<br />
                  • Nếu bắn vào Cột 4: Tàu ở [1, 2, 3] sẽ né được.
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200 font-bold text-slate-800">
                👉 Kết luận: Nếu chỉ dùng 4 phát, thì <strong>cả 4 phát bắn đều bắt buộc phải nằm ở Cột 2 hoặc Cột 3</strong>!
              </div>
            </div>
          )}

          {/* BƯỚC 4: Lỗ hổng chết người của 4 phát bắn */}
          {learnStep === 4 && (
            <div className="space-y-3 rounded-xl border border-sky-300 bg-white p-4 text-xs text-slate-700 animate-in fade-in">
              <div className="flex items-center justify-between font-bold text-sky-950 border-b border-slate-100 pb-2">
                <span className="text-sm">Bước 4: Vì sao 4 phát bắn CHẮC CHẮN THẤT BẠI?</span>
                <span className="text-[11px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded">4 phát không đủ</span>
              </div>
              <p className="leading-relaxed">
                Vì cả 4 phát bắn đều bắt buộc phải dồn vào Cột 2 và Cột 3, điều đó có nghĩa là:
              </p>
              <div className="rounded-lg bg-rose-50 p-3 border border-rose-200 text-rose-950 space-y-1.5">
                <div className="font-bold text-rose-800">
                  ⚠️ Cột 1 và Cột 4 hoàn toàn không có bất kỳ phát bắn nào!
                </div>
                <p className="text-xs">
                  Cột 1 và Cột 4 dài 4 ô, hoàn toàn trống trơn. Đối phương chỉ việc đặt một con <strong>tàu dọc 3 ô</strong> vào Cột 1 hoặc Cột 4 là hoàn toàn né tránh được toàn bộ 4 phát bắn!
                </p>
              </div>
              <div className="rounded-lg bg-slate-100 p-2.5 font-bold text-center text-slate-900 border border-slate-300">
                🛑 Kết luận bước 1: 4 phát bắn không thể đảm bảo thắng trong mọi trường hợp. Do đó, cần ÍT NHẤT 5 PHÁT BẮN!
              </div>
            </div>
          )}

          {/* BƯỚC 5: Chỉ ra phương án 5 phát bắn đảm bảo thắng */}
          {learnStep === 5 && (
            <div className="space-y-3 rounded-xl border border-emerald-300 bg-white p-4 text-xs text-slate-700 animate-in fade-in">
              <div className="flex items-center justify-between font-bold text-emerald-950 border-b border-slate-100 pb-2">
                <span className="text-sm">Bước 5: Chỉ ra phương án 5 phát bắn ĐẢM BẢO TRÚNG 100%</span>
                <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">Tối ưu: 5 phát</span>
              </div>
              <p className="leading-relaxed">
                Chứng minh &ldquo;4 phát không đủ&rdquo; mới là một nửa bài toán. Ta cần chỉ ra một cách chọn <strong>đúng 5 phát bắn</strong> chặn đứng cả 16 vị trí tàu:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 space-y-1 text-xs">
                  <div className="font-bold text-slate-800">Tọa độ 5 phát bắn mẫu:</div>
                  <div className="font-mono text-emerald-700">
                    • Hàng 1, Cột 2 (1, 2)<br />
                    • Hàng 2, Cột 1 (2, 1)<br />
                    • Hàng 2, Cột 4 (2, 4)<br />
                    • Hàng 3, Cột 3 (3, 3)<br />
                    • Hàng 4, Cột 2 (4, 2)
                  </div>
                  <button
                    onClick={applySolutionShotsToTab}
                    className="mt-2 w-full rounded-lg bg-sky-600 py-1.5 text-xs font-bold text-white hover:bg-sky-700"
                  >
                    Nạp 5 phát này vào bàn cờ 🎯
                  </button>
                </div>

                <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                  <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Độ bao phủ thực tế:</span>
                  </div>
                  <p>
                    • Chặn đứng: <strong>16 / 16 vị trí tàu</strong> (8 ngang + 8 dọc).<br />
                    • Không còn bất kỳ vị trí tàu 3 ô nào lọt qua được!
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-3 text-center font-bold text-emerald-950">
                🎉 Kết luận tối ưu: Vì 4 phát không đủ và 5 phát đảm bảo chắc chắn trúng, nên số phát bắn ít nhất là 5!
              </div>
            </div>
          )}

          {/* TEACHING POINT */}
          <div className="rounded-xl border border-sky-300 bg-white p-3 space-y-1 text-center text-xs">
            <p className="font-extrabold text-sky-950">
              Teaching Point: “Muốn CHẮC CHẮN trúng, không được để sót bất kỳ vị trí hợp lệ nào của con tàu.”
            </p>
            <p className="text-[11px] text-sky-700 font-semibold">
              “Để chứng minh 5 phát là ít nhất: 1. Chứng minh 4 phát luôn để sót cột trống. 2. Chỉ ra cách đặt 5 phát chặn đứng toàn bộ 16 vị trí.”
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
