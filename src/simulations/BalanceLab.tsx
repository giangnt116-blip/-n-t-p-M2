import React, { useState } from "react";
import { RotateCcw, Play, Check, AlertCircle, Sparkles, Scale } from "lucide-react";
import { QuestionMode } from "../types/question";

interface BalanceItem {
  id?: string;
  type: string;
  icon: string;
}

interface BalanceLabConfig {
  left?: BalanceItem[];
  right?: BalanceItem[];
}

interface BalanceLabProps {
  config?: BalanceLabConfig;
  mode: QuestionMode;
}

export const BalanceLab: React.FC<BalanceLabProps> = ({ config, mode }) => {
  // Initialize items with unique IDs for selection & animation
  const initialLeft: (BalanceItem & { uid: string })[] = (config?.left || [
    { type: "apple", icon: "🍎" },
    { type: "pear", icon: "🍐" },
    { type: "pear", icon: "🍐" },
  ]).map((item, idx) => ({ ...item, uid: `left-${idx}-${item.type}` }));

  const initialRight: (BalanceItem & { uid: string })[] = (config?.right || [
    { type: "apple", icon: "🍎" },
    { type: "apple", icon: "🍎" },
    { type: "pear", icon: "🍐" },
  ]).map((item, idx) => ({ ...item, uid: `right-${idx}-${item.type}` }));

  const [leftItems, setLeftItems] = useState(initialLeft);
  const [rightItems, setRightItems] = useState(initialRight);
  const [selectedLeftUid, setSelectedLeftUid] = useState<string | null>(null);
  const [selectedRightUid, setSelectedRightUid] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isMatch, setIsMatch] = useState<boolean>(false);
  const [stepHistory, setStepHistory] = useState<string[]>([]);
  const [learnStep, setLearnStep] = useState<number>(0);

  const selectedLeftItem = leftItems.find((i) => i.uid === selectedLeftUid);
  const selectedRightItem = rightItems.find((i) => i.uid === selectedRightUid);

  const handleSelectLeft = (uid: string) => {
    const nextUid = selectedLeftUid === uid ? null : uid;
    setSelectedLeftUid(nextUid);
    checkPair(nextUid, selectedRightUid);
  };

  const handleSelectRight = (uid: string) => {
    const nextUid = selectedRightUid === uid ? null : uid;
    setSelectedRightUid(nextUid);
    checkPair(selectedLeftUid, nextUid);
  };

  const checkPair = (leftUid: string | null, rightUid: string | null) => {
    if (!leftUid || !rightUid) {
      setFeedbackMsg(null);
      setIsMatch(false);
      return;
    }
    const left = leftItems.find((i) => i.uid === leftUid);
    const right = rightItems.find((i) => i.uid === rightUid);

    if (left && right) {
      if (left.type === right.type) {
        setIsMatch(true);
        const name = left.type === "apple" ? "Táo" : "Lê";
        setFeedbackMsg(`Đã chọn 2 quả ${name} giống nhau ở cả hai đĩa.`);
      } else {
        setIsMatch(false);
        if (mode === "challenge") {
          setFeedbackMsg("Chưa thể loại bỏ cặp này.");
        } else {
          setFeedbackMsg("Muốn giữ cân bằng, em cần loại bỏ cùng một loại vật ở hai phía.");
        }
      }
    }
  };

  const handleEliminatePair = () => {
    if (!selectedLeftUid || !selectedRightUid || !isMatch) return;

    const left = leftItems.find((i) => i.uid === selectedLeftUid);
    const right = rightItems.find((i) => i.uid === selectedRightUid);
    if (!left || !right) return;

    const itemLabel = left.type === "apple" ? "1 Quả Táo 🍎" : "1 Quả Lê 🍐";
    setStepHistory((prev) => [...prev, `Đã bớt đồng thời ${itemLabel} ở cả 2 đĩa`]);

    setLeftItems((prev) => prev.filter((i) => i.uid !== selectedLeftUid));
    setRightItems((prev) => prev.filter((i) => i.uid !== selectedRightUid));
    setSelectedLeftUid(null);
    setSelectedRightUid(null);
    setIsMatch(false);
    setFeedbackMsg(null);
  };

  const handleReset = () => {
    setLeftItems(initialLeft);
    setRightItems(initialRight);
    setSelectedLeftUid(null);
    setSelectedRightUid(null);
    setFeedbackMsg(null);
    setIsMatch(false);
    setStepHistory([]);
    setLearnStep(0);
  };

  // Step-by-step auto demo for Learn Mode
  const handleNextLearnStep = () => {
    if (learnStep === 0) {
      // Step 1: select Apple on left and Apple on right
      const appleLeft = leftItems.find((i) => i.type === "apple");
      const appleRight = rightItems.find((i) => i.type === "apple");
      if (appleLeft && appleRight) {
        setSelectedLeftUid(appleLeft.uid);
        setSelectedRightUid(appleRight.uid);
        setIsMatch(true);
        setFeedbackMsg("Bước 1: Chọn đồng thời 1 Táo ở đĩa trái và 1 Táo ở đĩa phải.");
        setLearnStep(1);
      }
    } else if (learnStep === 1) {
      // Eliminate Apple pair
      handleEliminatePair();
      setLearnStep(2);
    } else if (learnStep === 2) {
      // Step 2: select Pear on left and Pear on right
      const pearLeft = leftItems.find((i) => i.type === "pear");
      const pearRight = rightItems.find((i) => i.type === "pear");
      if (pearLeft && pearRight) {
        setSelectedLeftUid(pearLeft.uid);
        setSelectedRightUid(pearRight.uid);
        setIsMatch(true);
        setFeedbackMsg("Bước 2: Chọn tiếp 1 Lê ở đĩa trái và 1 Lê ở đĩa phải.");
        setLearnStep(3);
      }
    } else if (learnStep === 3) {
      handleEliminatePair();
      setLearnStep(4);
    }
  };

  const isSimplified = leftItems.length === 1 && rightItems.length === 1;

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-slate-50/70 to-white p-5 shadow-xs space-y-5">
      {/* Simulation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mô phỏng tương tác
              </span>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-700">
                balanceLab
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Chiếc cân thăng bằng tương đương
            </h3>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {mode === "learn" && learnStep < 4 && (
            <button
              onClick={handleNextLearnStep}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>
                {learnStep === 0
                  ? "Xem từng bước"
                  : learnStep === 1 || learnStep === 3
                  ? "Bớt cặp này"
                  : "Bước tiếp theo"}
              </span>
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

      {/* BALANCE SCALE VISUALIZATION */}
      <div className="relative mx-auto max-w-xl py-6 px-4">
        {/* Fulcrum and Beam */}
        <div className="relative flex flex-col items-center">
          {/* Horizontal Beam */}
          <div className="relative h-2.5 w-full rounded-full bg-slate-700 shadow-sm">
            <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-indigo-600 shadow-xs" />
          </div>

          {/* Fulcrum Triangle */}
          <div className="h-0 w-0 border-x-[22px] border-b-[36px] border-x-transparent border-b-slate-600" />
          <div className="h-3 w-28 rounded-sm bg-slate-800" />
        </div>

        {/* Hanging Pans */}
        <div className="grid grid-cols-2 gap-4 sm:gap-10 -mt-11">
          {/* LEFT PAN */}
          <div className="flex flex-col items-center space-y-2">
            {/* Hanging String */}
            <div className="h-10 w-0.5 bg-slate-400" />
            {/* Pan Container */}
            <div className="w-full rounded-2xl border-2 border-indigo-200 bg-indigo-50/60 p-3 shadow-xs min-h-[120px] flex flex-col items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wide">
                Đĩa Trái ({leftItems.length} quả)
              </span>

              {/* Items */}
              <div className="flex flex-wrap items-center justify-center gap-2 py-2">
                {leftItems.map((item) => {
                  const isSelected = selectedLeftUid === item.uid;
                  return (
                    <button
                      key={item.uid}
                      onClick={() => handleSelectLeft(item.uid)}
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-all active:scale-95 ${
                        isSelected
                          ? "border-2 border-indigo-600 bg-white shadow-md ring-2 ring-indigo-300 scale-105"
                          : "border border-slate-200 bg-white shadow-2xs hover:border-indigo-300 hover:bg-indigo-50/30"
                      }`}
                      title={`Chọn ${item.type === "apple" ? "Táo" : "Lê"} ở đĩa trái`}
                    >
                      {item.icon}
                    </button>
                  );
                })}
              </div>

              <span className="text-[10px] text-slate-500 font-medium">
                {leftItems.length === 0 ? "Trống" : "Nhấn để chọn quả"}
              </span>
            </div>
          </div>

          {/* RIGHT PAN */}
          <div className="flex flex-col items-center space-y-2">
            {/* Hanging String */}
            <div className="h-10 w-0.5 bg-slate-400" />
            {/* Pan Container */}
            <div className="w-full rounded-2xl border-2 border-indigo-200 bg-indigo-50/60 p-3 shadow-xs min-h-[120px] flex flex-col items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wide">
                Đĩa Phải ({rightItems.length} quả)
              </span>

              {/* Items */}
              <div className="flex flex-wrap items-center justify-center gap-2 py-2">
                {rightItems.map((item) => {
                  const isSelected = selectedRightUid === item.uid;
                  return (
                    <button
                      key={item.uid}
                      onClick={() => handleSelectRight(item.uid)}
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-all active:scale-95 ${
                        isSelected
                          ? "border-2 border-indigo-600 bg-white shadow-md ring-2 ring-indigo-300 scale-105"
                          : "border border-slate-200 bg-white shadow-2xs hover:border-indigo-300 hover:bg-indigo-50/30"
                      }`}
                      title={`Chọn ${item.type === "apple" ? "Táo" : "Lê"} ở đĩa phải`}
                    >
                      {item.icon}
                    </button>
                  );
                })}
              </div>

              <span className="text-[10px] text-slate-500 font-medium">
                {rightItems.length === 0 ? "Trống" : "Nhấn để chọn quả"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ELIMINATION CONTROL BAR */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-700">
            {selectedLeftItem && selectedRightItem ? (
              <span className="font-semibold">
                Đang chọn: Đĩa trái {selectedLeftItem.icon} + Đĩa phải {selectedRightItem.icon}
              </span>
            ) : selectedLeftItem ? (
              <span className="text-slate-500">
                Đã chọn đĩa trái {selectedLeftItem.icon}. Hãy chọn tiếp 1 quả ở đĩa phải.
              </span>
            ) : selectedRightItem ? (
              <span className="text-slate-500">
                Đã chọn đĩa phải {selectedRightItem.icon}. Hãy chọn tiếp 1 quả ở đĩa trái.
              </span>
            ) : (
              <span className="text-slate-500">
                💡 Hướng dẫn: Nhấn chọn 1 quả ở đĩa trái và 1 quả cùng loại ở đĩa phải để loại bỏ.
              </span>
            )}
          </div>

          {/* Button to eliminate pair */}
          {selectedLeftUid && selectedRightUid && (
            <button
              onClick={handleEliminatePair}
              disabled={!isMatch}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition active:scale-95 ${
                isMatch
                  ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
              }`}
            >
              <Check className="h-3.5 w-3.5" />
              <span>Loại bỏ cặp này</span>
            </button>
          )}
        </div>

        {/* Feedback Message */}
        {feedbackMsg && (
          <div
            className={`flex items-center gap-2 rounded-lg p-2.5 text-xs font-medium ${
              isMatch
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            {isMatch ? (
              <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            )}
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* STEP HISTORY */}
      {stepHistory.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Các thao tác đã thực hiện:
          </span>
          <div className="flex flex-wrap gap-2">
            {stepHistory.map((step, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100/70 px-2.5 py-1 text-xs text-slate-700 font-medium"
              >
                <span>✓ {step}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* FINAL CONCLUSION (LEARN MODE ONLY) */}
      {mode === "learn" && isSimplified && (
        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/70 p-4 text-center space-y-1">
          <div className="text-xl font-black text-emerald-950 flex items-center justify-center gap-3">
            <span>🍐 1 Quả Lê</span>
            <span className="text-emerald-600">=</span>
            <span>🍎 1 Quả Táo</span>
          </div>
          <p className="text-xs font-bold text-emerald-800">
            Teaching Point: “Cân bằng nghĩa là tổng hai vế bằng nhau. Ta có thể loại bỏ phần giống nhau ở hai phía mà vẫn bảo toàn trạng thái cân bằng.”
          </p>
        </div>
      )}
    </div>
  );
};
