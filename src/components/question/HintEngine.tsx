import React, { useState } from "react";
import { Lightbulb, ChevronDown, ChevronUp, Lock, Sparkles } from "lucide-react";
import { QuestionHint } from "../../types/question";

interface HintEngineProps {
  hints: QuestionHint[];
  questionId: string;
  unlockedHints: number[];
  onUnlockHint: (level: 1 | 2 | 3) => void;
}

export const HintEngine: React.FC<HintEngineProps> = ({
  hints,
  questionId,
  unlockedHints,
  onUnlockHint,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const unlockedCount = unlockedHints.length;
  const nextHintLevel = (unlockedCount + 1) as 1 | 2 | 3;

  const handleUnlockNext = () => {
    if (nextHintLevel <= 3) {
      onUnlockHint(nextHintLevel);
      setIsOpen(true);
    }
  };

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 transition-all">
      {/* Trigger Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-950 text-sm">Trợ lý Gợi ý (3 cấp độ)</span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                Đã mở: {unlockedCount}/3
              </span>
            </div>
            <p className="text-[11px] text-amber-700">
              Gợi ý giúp em tự suy luận, không làm lộ đáp án trực tiếp.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unlockedCount < 3 && (
            <button
              onClick={handleUnlockNext}
              className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700 active:scale-95 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Mở gợi ý {nextHintLevel}</span>
            </button>
          )}

          {unlockedCount > 0 && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-300 bg-white text-amber-800 hover:bg-amber-50 transition"
              title={isOpen ? "Thu gọn gợi ý" : "Xem gợi ý đã mở"}
            >
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Unlocked Hints List */}
      {isOpen && unlockedCount > 0 && (
        <div className="mt-4 space-y-2.5 border-t border-amber-200/80 pt-3">
          {hints.map((h) => {
            const isUnlocked = unlockedHints.includes(h.level);

            if (!isUnlocked) {
              return (
                <div
                  key={h.level}
                  className="flex items-center justify-between rounded-xl border border-dashed border-amber-300/80 bg-amber-100/40 px-3.5 py-2 text-xs text-amber-700"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Lock className="h-3.5 w-3.5 text-amber-500" />
                    Gợi ý cấp độ {h.level} (Đang khóa)
                  </span>
                  {h.level === nextHintLevel && (
                    <button
                      onClick={() => onUnlockHint(h.level)}
                      className="font-bold text-amber-800 hover:underline"
                    >
                      Nhấn để mở khóa
                    </button>
                  )}
                </div>
              );
            }

            return (
              <div
                key={h.level}
                className="rounded-xl border border-amber-300/80 bg-white p-3 text-xs text-slate-800 shadow-xs"
              >
                <div className="mb-1 flex items-center justify-between font-bold text-amber-800">
                  <span className="flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
                    Gợi ý {h.level}:
                  </span>
                  <span className="text-[10px] text-amber-600 font-mono">Cấp {h.level}/3</span>
                </div>
                <p className="leading-relaxed text-slate-700">{h.text}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
