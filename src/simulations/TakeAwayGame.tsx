import React, { useState, useMemo } from "react";
import {
  RotateCcw,
  Sparkles,
  BookOpen,
  User,
  Bot,
  Trophy,
  History,
  TrendingDown,
  Lightbulb,
  Play,
  CheckCircle2,
} from "lucide-react";
import { QuestionMode } from "../types/question";
import {
  TakeAwayConfig,
  getCycleSize,
  getWinningRemainder,
  calculateOptimalMove,
  getAIMove,
} from "../utils/gameUtils";

interface TakeAwayGameProps {
  config?: TakeAwayConfig;
  mode: QuestionMode;
}

interface MoveHistoryItem {
  player: "student" | "ai";
  taken: number;
  remaining: number;
}

export const TakeAwayGame: React.FC<TakeAwayGameProps> = ({ config, mode }) => {
  const initialItems = config?.initialItems || 18;
  const minTake = config?.minTake || 1;
  const maxTake = config?.maxTake || 4;

  // Game state
  const [currentItems, setCurrentItems] = useState<number>(initialItems);
  const [currentTurn, setCurrentTurn] = useState<"student" | "ai">("student");
  const [winner, setWinner] = useState<"student" | "ai" | null>(null);
  const [moveHistory, setMoveHistory] = useState<MoveHistoryItem[]>([]);
  const [aiMode, setAiMode] = useState<"random" | "optimal">(
    mode === "learn" ? "optimal" : "random"
  );
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [completedGamesCount, setCompletedGamesCount] = useState<number>(0);

  // Learn Mode toggles
  const [showStrategyMap, setShowStrategyMap] = useState<boolean>(mode === "learn");

  const cycleSize = useMemo(
    () => getCycleSize(minTake, maxTake),
    [minTake, maxTake]
  );

  const winningFirstMove = useMemo(
    () => getWinningRemainder(initialItems, minTake, maxTake),
    [initialItems, minTake, maxTake]
  );

  // Handle student move
  const handleStudentTake = (count: number) => {
    if (winner || currentTurn !== "student" || count > currentItems) return;

    const remaining = currentItems - count;
    const newHistory: MoveHistoryItem[] = [
      ...moveHistory,
      { player: "student", taken: count, remaining },
    ];

    setCurrentItems(remaining);
    setMoveHistory(newHistory);

    if (remaining === 0) {
      setWinner("student");
      setCompletedGamesCount((prev) => prev + 1);
      return;
    }

    // Pass turn to AI
    setCurrentTurn("ai");
    setIsAiThinking(true);

    setTimeout(() => {
      handleAIMove(remaining, newHistory);
    }, 600);
  };

  // Handle AI turn
  const handleAIMove = (remaining: number, history: MoveHistoryItem[]) => {
    const aiTake = getAIMove(remaining, aiMode, minTake, maxTake);
    const afterAi = remaining - aiTake;

    const updatedHistory: MoveHistoryItem[] = [
      ...history,
      { player: "ai", taken: aiTake, remaining: afterAi },
    ];

    setCurrentItems(afterAi);
    setMoveHistory(updatedHistory);
    setIsAiThinking(false);

    if (afterAi === 0) {
      setWinner("ai");
      setCompletedGamesCount((prev) => prev + 1);
    } else {
      setCurrentTurn("student");
    }
  };

  const handleResetGame = () => {
    setCurrentItems(initialItems);
    setCurrentTurn("student");
    setWinner(null);
    setMoveHistory([]);
    setIsAiThinking(false);
  };

  // Generate buttons for available moves
  const availableMoves = useMemo(() => {
    const moves: number[] = [];
    for (let i = minTake; i <= maxTake; i++) {
      if (i <= currentItems) {
        moves.push(i);
      }
    }
    return moves;
  }, [currentItems, minTake, maxTake]);

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-slate-50/70 to-white p-5 shadow-xs space-y-5">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mô phỏng trò chơi đối kháng
              </span>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-700">
                takeAwayGame
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Đấu trường Chiến thuật Bốc sách (18 quyển)
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* AI Difficulty Selector */}
          <div className="flex items-center rounded-xl border border-slate-300 bg-white p-0.5 text-xs font-bold">
            <button
              onClick={() => {
                setAiMode("random");
                handleResetGame();
              }}
              className={`rounded-lg px-2.5 py-1 transition ${
                aiMode === "random"
                  ? "bg-indigo-100 text-indigo-800 font-extrabold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Đối thủ tập chơi
            </button>
            <button
              onClick={() => {
                setAiMode("optimal");
                handleResetGame();
              }}
              className={`rounded-lg px-2.5 py-1 transition ${
                aiMode === "optimal"
                  ? "bg-indigo-600 text-white shadow-xs font-extrabold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Đối thủ hoàn hảo (Pro)
            </button>
          </div>

          {mode === "learn" && (
            <button
              onClick={() => setShowStrategyMap(!showStrategyMap)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                showStrategyMap
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              <span>Bí quyết chiến thắng</span>
            </button>
          )}

          <button
            onClick={handleResetGame}
            className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition"
            title="Chơi lại ván mới"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Ván mới</span>
          </button>
        </div>
      </div>

      {/* GAME STATUS / SCOREBOARD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Số sách còn lại
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-indigo-700">
              {currentItems}
            </span>
            <span className="text-xs font-bold text-slate-400">
              / {initialItems} quyển
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Lượt bốc hiện tại
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs font-extrabold text-slate-800">
            {winner ? (
              <span className="text-slate-400">Ván đấu đã xong</span>
            ) : currentTurn === "student" ? (
              <span className="flex items-center gap-1 text-emerald-700">
                <User className="h-4 w-4" /> Bạn (Đi trước)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-700">
                <Bot className="h-4 w-4" /> Máy {isAiThinking ? "đang nghĩ..." : ""}
              </span>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Mỗi lượt được bốc
          </div>
          <div className="mt-1 text-xs font-extrabold text-slate-800 font-mono">
            {minTake} đến {maxTake} quyển sách
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Trạng thái ván đấu
          </div>
          <div className="mt-1 text-xs font-extrabold">
            {winner === "student" ? (
              <span className="text-emerald-700 font-black flex items-center gap-1">
                <Trophy className="h-4 w-4 text-emerald-600" /> Bạn đã thắng!
              </span>
            ) : winner === "ai" ? (
              <span className="text-rose-700 font-bold">Máy đã thắng</span>
            ) : (
              <span className="text-indigo-600 font-semibold">Đang thi đấu</span>
            )}
          </div>
        </div>
      </div>

      {/* BOOKS PILE VISUALIZATION */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span>Sách trên bàn ({currentItems} quyển):</span>
          <span className="text-[11px] font-mono text-slate-400">
            {currentItems > 0
              ? mode === "learn"
                ? `${currentItems} quyển (chia 5 dư ${currentItems % 5})`
                : `${currentItems} quyển`
              : "Đã hết sách"}
          </span>
        </div>

        {/* Visual Books Grid */}
        <div className="flex flex-wrap gap-2.5 p-4 rounded-xl bg-slate-50 border border-slate-200 min-h-[100px] items-center justify-center">
          {currentItems === 0 ? (
            <div className="text-xs text-slate-400 font-medium italic">
              Bàn đã hết sách!
            </div>
          ) : (
            Array.from({ length: currentItems }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center h-12 w-9 rounded-lg border-2 border-indigo-400 bg-white text-indigo-800 shadow-xs font-black text-xs select-none animate-in fade-in zoom-in-90"
              >
                <BookOpen className="h-4 w-4 text-indigo-500 mb-0.5" />
                <span className="text-[9px] font-mono text-slate-400">
                  #{idx + 1}
                </span>
              </div>
            ))
          )}
        </div>

        {/* PLAYER ACTION CONTROLS */}
        <div className="border-t border-slate-100 pt-3 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-700">
                {winner
                  ? "Bấm 'Ván mới' để chơi lại và thử chiến thuật khác!"
                  : currentTurn === "student"
                  ? "Lượt của bạn: Hãy chọn số quyển sách bạn muốn bốc:"
                  : "Đang đợi đối thủ bốc..."}
              </div>
              {!winner && (
                <div className="text-[11px] text-slate-500 italic">
                  💡 {mode === "learn" || completedGamesCount >= 2
                    ? "Có những số lượng sách nào khiến người đến lượt gặp bất lợi không?"
                    : "Em hãy thử chơi vài ván. Có những số lượng sách nào khiến người đến lượt gặp bất lợi không?"}
                </div>
              )}
            </div>

            {/* Take Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {availableMoves.map((count) => (
                <button
                  key={count}
                  onClick={() => handleStudentTake(count)}
                  disabled={winner !== null || currentTurn !== "student"}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition"
                >
                  <span>Bốc {count} quyển</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOVE HISTORY LOG */}
      {moveHistory.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <History className="h-4 w-4 text-slate-500" />
            <span>Nhật ký các lượt bốc:</span>
          </div>

          <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
            {moveHistory.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-white border border-slate-200 font-medium"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-400">
                    Lượt {idx + 1}:
                  </span>
                  <span
                    className={
                      item.player === "student"
                        ? "text-emerald-700 font-bold flex items-center gap-1"
                        : "text-amber-700 font-bold flex items-center gap-1"
                    }
                  >
                    {item.player === "student" ? "Bạn" : "Máy"}
                  </span>
                  <span>bốc <strong>{item.taken}</strong> quyển</span>
                </div>

                <div className="font-mono text-slate-500 text-[11px]">
                  Còn lại: <strong>{item.remaining}</strong> quyển
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEARN MODE / STRATEGY GUIDE */}
      {mode === "learn" && showStrategyMap && (
        <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="flex items-center justify-between border-b border-emerald-200/70 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Bí quyết chiến thuật trò chơi bốc sỏi / bốc sách (Quy tắc số bù 5)</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-800">
              Chu kỳ = 1 + 4 = 5
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-emerald-200 bg-white p-3 space-y-1.5 shadow-2xs">
              <span className="font-bold text-emerald-950 block">
                1. Nguyên tắc bù trừ
              </span>
              <p className="text-slate-600">
                Vì mỗi người chỉ được bốc từ 1 đến 4 quyển, nên sau khi đối phương bốc k quyển, ta luôn có thể bốc <strong>(5 - k)</strong> quyển.
              </p>
              <div className="font-mono text-[11px] text-emerald-700 bg-emerald-50 p-1.5 rounded">
                k + (5 - k) = 5 trong mỗi vòng!
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-white p-3 space-y-1.5 shadow-2xs">
              <span className="font-bold text-emerald-950 block">
                2. Vị trí an toàn (bội số của 5)
              </span>
              <p className="text-slate-600">
                Những số sách là bội số của 5: <strong>{`{0, 5, 10, 15}`}</strong> là các &quot;vị trí thua cuộc&quot; đối với người đến lượt. Nếu em để lại bội số của 5 cho đối thủ, em chắc chắn thắng!
              </p>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-white p-3 space-y-1.5 shadow-2xs">
              <span className="font-bold text-emerald-950 block">
                3. Lượt bốc mở màn
              </span>
              <p className="text-slate-600">
                Ban đầu có 18 quyển. Ta có: <strong>18 = 3 × 5 + 3</strong> (dư 3).
              </p>
              <div className="font-bold text-indigo-700 bg-indigo-50 p-1.5 rounded border border-indigo-200">
                👉 Ở lượt đầu tiên, bốc đúng <strong>{winningFirstMove} quyển</strong> để để lại đúng 15 quyển!
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-300 bg-white p-3 text-center space-y-1">
            <p className="text-xs font-bold text-emerald-900">
              Teaching Point: “Tìm trạng thái mà em muốn để lại cho đối thủ. Nếu Bob bốc x quyển thì Alice bốc 5 - x quyển để giữ vững các mốc an toàn 15, 10, 5.”
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
