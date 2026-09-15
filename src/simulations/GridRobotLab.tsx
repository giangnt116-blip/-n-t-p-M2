import React, { useState, useEffect, useRef } from "react";
import {
  RotateCcw,
  Play,
  FastForward,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Compass,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  Bot,
  Zap,
} from "lucide-react";
import { QuestionMode } from "../types/question";

export type RobotDirection = "up" | "right" | "down" | "left";

interface GridRobotConfig {
  rows?: number;
  cols?: number;
  startCell?: number;
  startDirection?: RobotDirection;
  repeat?: number;
  rule?: {
    forwardBeforeTurn?: number;
    divisor?: number;
    ifDivisible?: "left" | "right";
    ifNotDivisible?: "left" | "right";
    forwardAfterTurn?: number;
  };
}

interface GridRobotLabProps {
  config?: GridRobotConfig;
  mode: QuestionMode;
}

interface StepLog {
  round: number;
  action: string;
  fromCell: number;
  toCell: number;
  direction: RobotDirection;
  note?: string;
}

interface RoundSummary {
  round: number;
  afterStep1: number;
  divisible: string;
  turn: string;
  endCell: number;
}

export const GridRobotLab: React.FC<GridRobotLabProps> = ({ config, mode }) => {
  const rows = config?.rows || 7;
  const cols = config?.cols || 7;
  const startCell = config?.startCell || 25;
  const startDirection: RobotDirection = config?.startDirection || "up";
  const totalRounds = config?.repeat || 3;
  const forwardBefore = config?.rule?.forwardBeforeTurn || 1;
  const divisor = config?.rule?.divisor || 3;
  const ifDiv = config?.rule?.ifDivisible || "left";
  const ifNotDiv = config?.rule?.ifNotDivisible || "right";
  const forwardAfter = config?.rule?.forwardAfterTurn || 2;

  // Robot dynamic state
  const [currentCell, setCurrentCell] = useState<number>(startCell);
  const [direction, setDirection] = useState<RobotDirection>(startDirection);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [phase, setPhase] = useState<
    | "IDLE_START"
    | "WAIT_STEP1"
    | "PREDICT_DIVISOR"
    | "WAIT_TURN"
    | "WAIT_FORWARD_AFTER_1"
    | "WAIT_FORWARD_AFTER_2"
    | "ROUND_DONE"
    | "ALL_DONE"
  >("IDLE_START");

  // Speed factor: 0.5x = 800ms, 1x = 400ms, 2x = 200ms
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const autoPlayTargetRef = useRef<"step" | "round" | "all" | null>(null);

  // History & Prediction
  const [history, setHistory] = useState<StepLog[]>([
    {
      round: 0,
      action: "Xuất phát",
      fromCell: startCell,
      toCell: startCell,
      direction: startDirection,
      note: "Vị trí bắt đầu",
    },
  ]);
  const [visitedCells, setVisitedCells] = useState<number[]>([startCell]);
  const [roundSummaries, setRoundSummaries] = useState<RoundSummary[]>([]);
  const [predictionFeedback, setPredictionFeedback] = useState<{
    ok?: boolean;
    text: string;
  } | null>(null);

  // Cleanup timers on unmount
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Helper math for directions
  const turnDirection = (dir: RobotDirection, turn: "left" | "right"): RobotDirection => {
    const clock: RobotDirection[] = ["up", "right", "down", "left"];
    const idx = clock.indexOf(dir);
    if (turn === "right") {
      return clock[(idx + 1) % 4];
    } else {
      return clock[(idx + 3) % 4];
    }
  };

  const getNextCell = (cell: number, dir: RobotDirection): number => {
    const r = Math.floor((cell - 1) / cols);
    const c = (cell - 1) % cols;

    let nr = r;
    let nc = c;
    if (dir === "up") nr = r - 1;
    else if (dir === "down") nr = r + 1;
    else if (dir === "left") nc = c - 1;
    else if (dir === "right") nc = c + 1;

    // Bounds check
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
      return cell; // Boundary clamp
    }
    return nr * cols + nc + 1;
  };

  const getDirectionArrow = (dir: RobotDirection) => {
    switch (dir) {
      case "up":
        return <ArrowUp className="h-4 w-4" />;
      case "right":
        return <ArrowRight className="h-4 w-4" />;
      case "down":
        return <ArrowDown className="h-4 w-4" />;
      case "left":
        return <ArrowLeft className="h-4 w-4" />;
    }
  };

  const getDirectionName = (dir: RobotDirection) => {
    switch (dir) {
      case "up":
        return "Bắc (↑)";
      case "right":
        return "Đông (→)";
      case "down":
        return "Nam (↓)";
      case "left":
        return "Tây (←)";
    }
  };

  // EXECUTE ONE ATOMIC STEP OF SIMULATION
  const executeNextStep = () => {
    if (phase === "ALL_DONE") return;

    if (phase === "IDLE_START" || phase === "ROUND_DONE") {
      // Step 1: Forward 1
      const nextC = getNextCell(currentCell, direction);
      setCurrentCell(nextC);
      setVisitedCells((prev) => [...prev, nextC]);
      setHistory((prev) => [
        ...prev,
        {
          round: currentRound,
          action: "Tiến 1 ô",
          fromCell: currentCell,
          toCell: nextC,
          direction,
          note: `Từ ô ${currentCell} → ${nextC}`,
        },
      ]);
      setPhase("PREDICT_DIVISOR");
      setPredictionFeedback(null);
    } else if (phase === "PREDICT_DIVISOR") {
      if (mode === "challenge") {
        // In challenge mode, wait for user answer on divisor
        setPredictionFeedback({
          text: `Hãy bấm dự đoán: Ô ${currentCell} có chia hết cho ${divisor} không?`,
        });
        return;
      }
      // Learn mode auto-passes divisor check
      handleDivisorDecision(currentCell % divisor === 0);
    } else if (phase === "WAIT_TURN") {
      // Execute turn
      const isDiv = currentCell % divisor === 0;
      const turnType = isDiv ? ifDiv : ifNotDiv;
      const nextDir = turnDirection(direction, turnType);
      setDirection(nextDir);
      setHistory((prev) => [
        ...prev,
        {
          round: currentRound,
          action: `Quay ${turnType === "left" ? "Trái" : "Phải"} 90°`,
          fromCell: currentCell,
          toCell: currentCell,
          direction: nextDir,
          note: `Vì ô ${currentCell} ${isDiv ? "chia hết" : "không chia hết"} cho ${divisor}`,
        },
      ]);
      setPhase("WAIT_FORWARD_AFTER_1");
    } else if (phase === "WAIT_FORWARD_AFTER_1") {
      // Forward after turn - Step 1/2
      const nextC = getNextCell(currentCell, direction);
      setCurrentCell(nextC);
      setVisitedCells((prev) => [...prev, nextC]);
      setHistory((prev) => [
        ...prev,
        {
          round: currentRound,
          action: "Tiến ô thứ 1 (sau khi quay)",
          fromCell: currentCell,
          toCell: nextC,
          direction,
          note: `Đang tiến 2 ô: tới ô ${nextC}`,
        },
      ]);
      setPhase("WAIT_FORWARD_AFTER_2");
    } else if (phase === "WAIT_FORWARD_AFTER_2") {
      // Forward after turn - Step 2/2
      const nextC = getNextCell(currentCell, direction);
      setCurrentCell(nextC);
      setVisitedCells((prev) => [...prev, nextC]);

      // Record round summary
      const step1History = history.find(
        (h) => h.round === currentRound && h.action === "Tiến 1 ô"
      );
      const after1Cell = step1History ? step1History.toCell : currentCell;
      const isDiv = after1Cell % divisor === 0;

      const summary: RoundSummary = {
        round: currentRound,
        afterStep1: after1Cell,
        divisible: isDiv ? "Có" : "Không",
        turn: isDiv ? "Trái" : "Phải",
        endCell: nextC,
      };
      setRoundSummaries((prev) => [...prev, summary]);

      setHistory((prev) => [
        ...prev,
        {
          round: currentRound,
          action: "Tiến ô thứ 2 (hoàn thành vòng)",
          fromCell: currentCell,
          toCell: nextC,
          direction,
          note: `Kết thúc vòng ${currentRound} tại ô ${nextC}`,
        },
      ]);

      if (currentRound < totalRounds) {
        setCurrentRound((r) => r + 1);
        setPhase("ROUND_DONE");
      } else {
        setPhase("ALL_DONE");
        setIsAutoPlaying(false);
      }
    }
  };

  // Prediction answer handler
  const handleDivisorDecision = (userSaidDivisible: boolean) => {
    const isActuallyDivisible = currentCell % divisor === 0;
    if (userSaidDivisible === isActuallyDivisible) {
      setPredictionFeedback({
        ok: true,
        text: `Chính xác! ${currentCell} ${isActuallyDivisible ? "chia hết" : "không chia hết"} cho ${divisor}. Robot sẽ quay ${
          isActuallyDivisible ? "TRÁI" : "PHẢI"
        } 90°.`,
      });
      setPhase("WAIT_TURN");
    } else {
      setPredictionFeedback({
        ok: false,
        text: `Kiểm tra lại phép chia: ${currentCell} chia cho ${divisor} = ${(currentCell / divisor).toFixed(1)}. Hãy thử lại!`,
      });
    }
  };

  // Reset all
  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentCell(startCell);
    setDirection(startDirection);
    setCurrentRound(1);
    setPhase("IDLE_START");
    setHistory([
      {
        round: 0,
        action: "Xuất phát",
        fromCell: startCell,
        toCell: startCell,
        direction: startDirection,
        note: "Vị trí bắt đầu",
      },
    ]);
    setVisitedCells([startCell]);
    setRoundSummaries([]);
    setPredictionFeedback(null);
    setIsAutoPlaying(false);
    autoPlayTargetRef.current = null;
  };

  // Autoplay loop for Learn Mode
  useEffect(() => {
    if (!isAutoPlaying) return;

    const baseDelay = 450 / speedMultiplier;

    timerRef.current = setTimeout(() => {
      if (phase === "ALL_DONE") {
        setIsAutoPlaying(false);
        autoPlayTargetRef.current = null;
        return;
      }

      if (autoPlayTargetRef.current === "round" && phase === "ROUND_DONE") {
        setIsAutoPlaying(false);
        autoPlayTargetRef.current = null;
        return;
      }

      executeNextStep();
    }, baseDelay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAutoPlaying, phase, speedMultiplier, currentCell, direction, currentRound]);

  const handlePlayOneStep = () => {
    setIsAutoPlaying(false);
    autoPlayTargetRef.current = null;
    executeNextStep();
  };

  const handlePlayOneRound = () => {
    autoPlayTargetRef.current = "round";
    setIsAutoPlaying(true);
  };

  const handlePlayAll = () => {
    autoPlayTargetRef.current = "all";
    setIsAutoPlaying(true);
  };

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-slate-50/70 to-white p-5 shadow-xs space-y-5">
      {/* SIMULATION HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mô phỏng tương tác
              </span>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-700">
                gridRobotLab
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Robot trên Bảng số {rows} × {cols}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {mode === "challenge" && phase !== "ALL_DONE" && (
            <button
              onClick={executeNextStep}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>Thực hiện bước tiếp theo</span>
            </button>
          )}

          {mode === "learn" && phase !== "ALL_DONE" && (
            <>
              <button
                onClick={handlePlayOneStep}
                className="flex items-center gap-1 rounded-xl bg-indigo-600 px-2.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition"
                title="Chạy 1 bước"
              >
                <Play className="h-3 w-3 fill-white" />
                <span>1 bước</span>
              </button>

              <button
                onClick={handlePlayOneRound}
                className="flex items-center gap-1 rounded-xl bg-indigo-700 px-2.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-800 active:scale-95 transition"
                title="Chạy 1 vòng"
              >
                <FastForward className="h-3 w-3" />
                <span>1 vòng</span>
              </button>

              <button
                onClick={handlePlayAll}
                className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition"
                title="Chạy toàn bộ đến ô 38"
              >
                <Zap className="h-3 w-3" />
                <span>Toàn bộ</span>
              </button>

              {/* Speed Toggles */}
              <div className="flex items-center rounded-lg border border-slate-300 bg-white p-0.5 text-[11px] font-bold">
                <button
                  onClick={() => setSpeedMultiplier(0.5)}
                  className={`rounded px-1.5 py-0.5 transition ${
                    speedMultiplier === 0.5
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Tốc độ 0.5x"
                >
                  🐢 0.5x
                </button>
                <button
                  onClick={() => setSpeedMultiplier(1)}
                  className={`rounded px-1.5 py-0.5 transition ${
                    speedMultiplier === 1
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Tốc độ chuẩn 1x"
                >
                  ▶ 1x
                </button>
                <button
                  onClick={() => setSpeedMultiplier(2)}
                  className={`rounded px-1.5 py-0.5 transition ${
                    speedMultiplier === 2
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Tốc độ nhanh 2x"
                >
                  ⚡ 2x
                </button>
              </div>
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

      {/* MAIN LAYOUT: GRID ON LEFT (OR TOP ON MOBILE), STATUS PANEL ON RIGHT (OR BOTTOM) */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* 1. 7x7 NUMBER GRID */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="w-full max-w-[420px] rounded-2xl border-2 border-slate-200 bg-slate-100 p-2 sm:p-3 shadow-inner">
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {Array.from({ length: rows * cols }).map((_, idx) => {
                const cellNum = idx + 1;
                const isCurrent = cellNum === currentCell;
                const isStart = cellNum === startCell;
                const isVisited = visitedCells.includes(cellNum);
                const isTargetCell = cellNum === 38;

                let cellStyle = "bg-white text-slate-700 border-slate-200";
                if (isCurrent) {
                  cellStyle =
                    "bg-indigo-600 text-white font-black border-indigo-700 ring-2 ring-indigo-300 shadow-md scale-105 z-10";
                } else if (isVisited) {
                  cellStyle = "bg-indigo-50 text-indigo-900 font-bold border-indigo-200";
                } else if (isStart) {
                  cellStyle = "bg-amber-50 text-amber-900 font-bold border-amber-300";
                }

                return (
                  <div
                    key={cellNum}
                    className={`relative flex aspect-square items-center justify-center rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-300 select-none ${cellStyle}`}
                  >
                    {/* Cell Number */}
                    <span>{cellNum}</span>

                    {/* Robot indicator */}
                    {isCurrent && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-600 rounded-xl text-white">
                        <span className="text-base sm:text-lg leading-none">🤖</span>
                        <span className="text-[10px] leading-none mt-0.5 flex items-center justify-center font-bold">
                          {getDirectionArrow(direction)}
                        </span>
                      </div>
                    )}

                    {/* Target preview badge in Learn Mode */}
                    {mode === "learn" && isTargetCell && !isCurrent && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border border-white" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-md bg-indigo-600" /> Vị trí Robot
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-md bg-indigo-100 border border-indigo-200" /> Ô đã đi qua
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-md bg-amber-100 border border-amber-300" /> Ô xuất phát (25)
            </span>
          </div>
        </div>

        {/* 2. STATE PANEL & INTERACTION */}
        <div className="lg:col-span-5 space-y-4">
          {/* Current State Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Bảng Trạng Thái Robot (State)
            </span>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">
                  Vị trí
                </span>
                <strong className="text-xl font-black text-indigo-700">
                  {currentCell}
                </strong>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">
                  Hướng
                </span>
                <strong className="text-base font-black text-slate-800 flex items-center justify-center gap-1">
                  {getDirectionArrow(direction)}
                  <span>{getDirectionName(direction).split(" ")[0]}</span>
                </strong>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">
                  Vòng lặp
                </span>
                <strong className="text-base font-black text-slate-800">
                  {phase === "ALL_DONE" ? 3 : currentRound - (phase === "ROUND_DONE" ? 1 : 0)} / {totalRounds}
                </strong>
              </div>
            </div>

            {/* Current Action description */}
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-2.5 text-xs text-indigo-950">
              <strong className="text-indigo-800">Trạng thái: </strong>
              {phase === "IDLE_START" && "Robot ở ô 25 hướng Bắc (↑), sẵn sàng tiến 1 ô."}
              {phase === "PREDICT_DIVISOR" && `Đang ở ô ${currentCell}. Cần kiểm tra chia hết cho ${divisor}.`}
              {phase === "WAIT_TURN" && `Đã xác nhận kiểm tra chia hết. Chuẩn bị quay.`}
              {phase === "WAIT_FORWARD_AFTER_1" && "Đã quay hướng mới. Bắt đầu tiến 2 ô (ô 1/2)."}
              {phase === "WAIT_FORWARD_AFTER_2" && "Đang tiến 2 ô (ô 2/2)."}
              {phase === "ROUND_DONE" && `Hoàn thành vòng ${currentRound - 1}. Sẵn sàng cho vòng tiếp theo.`}
              {phase === "ALL_DONE" && `Hoàn thành trọn vẹn 3 vòng lặp! Robot dừng tại ô ${currentCell}.`}
            </div>
          </div>

          {/* CHALLENGE PREDICTION BOX */}
          {phase === "PREDICT_DIVISOR" && (
            <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <HelpCircle className="h-4 w-4 text-amber-600" />
                <span>Thử thách tư duy: Kiểm tra tính chia hết</span>
              </div>
              <p className="text-xs text-slate-700">
                Số <strong>{currentCell}</strong> có chia hết cho <strong>{divisor}</strong> không?
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleDivisorDecision(true)}
                  className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition"
                >
                  ✅ Có chia hết (Quay Trái)
                </button>
                <button
                  onClick={() => handleDivisorDecision(false)}
                  className="flex-1 rounded-xl bg-slate-700 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 active:scale-95 transition"
                >
                  ❌ Không chia hết (Quay Phải)
                </button>
              </div>

              {predictionFeedback && (
                <div
                  className={`mt-2 flex items-center gap-2 rounded-lg p-2 text-xs ${
                    predictionFeedback.ok
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {predictionFeedback.ok ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  )}
                  <span>{predictionFeedback.text}</span>
                </div>
              )}
            </div>
          )}

          {/* TIMELINE HISTORY (Collapsible/Scrollable) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Lịch sử các bước di chuyển
            </span>
            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5 border border-slate-100"
                >
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="text-indigo-600">{getDirectionArrow(item.direction)}</span>
                    <span>{item.action}</span>
                  </span>
                  <span className="font-mono text-indigo-700 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {item.toCell}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LEARN MODE SUMMARY TABLE & TEACHING POINT */}
      {mode === "learn" && roundSummaries.length > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Bảng tổng hợp trạng thái sau 3 vòng lặp</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bg-white rounded-xl overflow-hidden border border-emerald-200">
              <thead className="bg-emerald-100/70 text-emerald-950 font-black">
                <tr>
                  <th className="p-2.5">Lượt</th>
                  <th className="p-2.5">Sau bước 1 (Tiến 1 ô)</th>
                  <th className="p-2.5">Chia hết cho 3?</th>
                  <th className="p-2.5">Hướng quay</th>
                  <th className="p-2.5">Kết thúc (Tiến 2 ô)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 text-slate-700">
                {roundSummaries.map((s) => (
                  <tr key={s.round} className="hover:bg-emerald-50/40">
                    <td className="p-2.5 font-bold text-slate-900">Vòng {s.round}</td>
                    <td className="p-2.5 font-mono font-bold text-indigo-700">{s.afterStep1}</td>
                    <td className="p-2.5">{s.divisible}</td>
                    <td className="p-2.5 font-semibold text-indigo-900">{s.turn}</td>
                    <td className="p-2.5 font-mono font-black text-emerald-700">{s.endCell}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {phase === "ALL_DONE" && (
            <div className="rounded-xl border border-emerald-300 bg-white p-3 text-center space-y-1">
              <span className="text-sm font-black text-slate-900">
                Điểm dừng cuối cùng của Robot: <span className="text-emerald-600 text-base font-black">Ô số 38</span>
              </span>
              <p className="text-xs text-emerald-800 font-bold">
                Teaching Point: “Robot không đoán. Robot chỉ thực hiện từng lệnh. Muốn mô phỏng đúng, hãy theo dõi trạng thái sau mỗi bước.”
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
