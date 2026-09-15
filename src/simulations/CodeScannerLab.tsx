import React, { useState } from "react";
import {
  Scan,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lightbulb,
} from "lucide-react";

interface CodeScannerLabProps {
  mode: "challenge" | "learn";
  config?: any;
}

export const CodeScannerLab: React.FC<CodeScannerLabProps> = ({
  mode,
  config,
}) => {
  const digits = (config?.digits as number[]) || [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const scanArray = (config?.scan as number[]) || [1, 2, 2, 2, 2, 2, 2, 2, 2];
  const correctPositionCount = (config?.correctPositionCount as number) ?? 0;

  // Track eliminated digits per position: position index (0..8) -> Set of eliminated digits
  const [eliminatedMap, setEliminatedMap] = useState<Record<number, number[]>>({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
  });

  // Currently focused position in challenge mode
  const [activePos, setActivePos] = useState<number>(0);

  // Learn mode step
  const [learnStep, setLearnStep] = useState<1 | 2 | 3>(1);

  const toggleElimination = (pos: number, digit: number) => {
    setEliminatedMap((prev) => {
      const currentList = prev[pos] || [];
      const isAlready = currentList.includes(digit);
      return {
        ...prev,
        [pos]: isAlready
          ? currentList.filter((d) => d !== digit)
          : [...currentList, digit],
      };
    });
  };

  const handleReset = () => {
    setEliminatedMap({
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
    });
    setActivePos(0);
  };

  // Quick helper to eliminate based on the scanner
  const handleAutoEliminateFromScan = () => {
    setEliminatedMap({
      0: [1],
      1: [2],
      2: [2],
      3: [2],
      4: [2],
      5: [2],
      6: [2],
      7: [2],
      8: [2],
    });
  };

  // Check if position 2..8 all eliminated digit 2
  const isDigit2EliminatedFrom2To9 = [1, 2, 3, 4, 5, 6, 7, 8].every((pos) =>
    (eliminatedMap[pos] || []).includes(2)
  );

  return (
    <div className="space-y-6 rounded-2xl border border-indigo-100 bg-white p-5 shadow-xs sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Scan className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Phòng Thí Nghiệm Máy Quét Mật Mã
            </h3>
            <p className="text-xs text-slate-500">
              Sử dụng tín hiệu quét thử nghiệm để loại trừ vị trí bất khả thi
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

      {/* Scanner Test Display Banner */}
      <div className="rounded-2xl border-2 border-slate-200 bg-slate-900 p-4 sm:p-5 text-white shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
            <Scan className="h-4 w-4 animate-pulse" /> Dãy số máy quét thử nghiệm:
          </span>
          <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-0.5 text-xs font-black text-rose-300">
            🚨 Kết quả: {correctPositionCount} vị trí đúng
          </span>
        </div>

        {/* 9 Positions of the Scan */}
        <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
          {scanArray.map((digit, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center rounded-xl bg-slate-800 border border-slate-700 p-2 text-center"
            >
              <span className="text-[10px] font-mono text-slate-400">
                Vị trí {idx + 1}
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-300 my-0.5">
                {digit}
              </span>
              <span className="text-[9px] font-bold text-rose-400 flex items-center gap-0.5">
                <XCircle className="h-2.5 w-2.5" /> Sai
              </span>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-slate-800/80 p-2.5 text-xs text-slate-300 flex items-start gap-2 border border-slate-700">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Thông báo từ máy: <em>“Không có chữ số nào nằm đúng vị trí.”</em> Điều này có nghĩa là
            <strong> không một số nào trong dãy thử nghiệm trên trùng khớp với số thật tại vị trí tương ứng</strong>.
          </span>
        </div>
      </div>

      {/* Secret Code Position Slots */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Bảng 9 vị trí mật mã bí mật (Click để soi xét):
          </span>
          {mode === "challenge" && (
            <button
              onClick={handleAutoEliminateFromScan}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              ⚡ Gạch nhanh các số sai từ máy quét
            </button>
          )}
        </div>

        <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
          {Array.from({ length: 9 }).map((_, idx) => {
            const isSelected = activePos === idx;
            const eliminatedInThisPos = eliminatedMap[idx] || [];
            const canBeDigit2 = !eliminatedInThisPos.includes(2);

            let borderStyle = "border-slate-200 bg-white text-slate-800";
            if (isSelected) {
              borderStyle = "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-300";
            }

            return (
              <button
                key={idx}
                onClick={() => setActivePos(idx)}
                className={`flex flex-col items-center justify-center rounded-xl border-2 p-2 sm:p-2.5 transition-all text-center ${borderStyle}`}
              >
                <span className="text-[10px] font-bold text-slate-400">
                  Ô #{idx + 1}
                </span>
                <div className="my-1 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-black text-slate-700">
                  {idx === 0 && isDigit2EliminatedFrom2To9 ? (
                    <span className="text-emerald-700 font-extrabold text-base">?</span>
                  ) : (
                    "?"
                  )}
                </div>
                <span className="text-[9px] text-slate-500">
                  Gạch: {eliminatedInThisPos.length}/9
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Elimination Palette for Active Position */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-800">
            Khả năng cho <strong>Vị trí #{activePos + 1}</strong> (Click để gạch bỏ hoặc khôi phục):
          </span>
          <span className="text-xs text-slate-500">
            Số thử nghiệm tại ô này là:{" "}
            <strong className="font-mono text-amber-600">{scanArray[activePos]}</strong>
          </span>
        </div>

        {/* 1..9 Digits */}
        <div className="flex flex-wrap items-center gap-2">
          {digits.map((d) => {
            const isEliminated = (eliminatedMap[activePos] || []).includes(d);
            const isScannedHere = scanArray[activePos] === d;

            let btnColor =
              "border-slate-300 bg-white text-slate-800 hover:border-indigo-400";
            if (isEliminated) {
              btnColor =
                "border-rose-300 bg-rose-50 text-rose-400 line-through opacity-70";
            } else if (isScannedHere) {
              btnColor = "border-amber-300 bg-amber-50 text-amber-900 font-bold";
            }

            return (
              <button
                key={d}
                onClick={() => toggleElimination(activePos, d)}
                className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl border-2 text-base font-black shadow-2xs transition active:scale-95 ${btnColor}`}
                title={
                  isEliminated
                    ? `Đã gạch số ${d} tại vị trí ${activePos + 1}`
                    : `Bấm để gạch số ${d}`
                }
              >
                {d}
              </button>
            );
          })}
        </div>

        {/* Micro-prompt for Challenge Mode */}
        {mode === "challenge" && (
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 text-xs text-indigo-950 flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Gợi ý suy nghĩ:</p>
              <p className="mt-0.5">
                “Chữ số <strong>2</strong> phải xuất hiện ở đâu đó trong mật mã. Những vị trí nào từ 2 đến 9 đã bị loại? Vậy số 2 chỉ còn duy nhất một nơi để ẩn nấp ở đâu?”
              </p>
            </div>
          </div>
        )}
      </div>

      {/* LEARN MODE SECTION */}
      {mode === "learn" && (
        <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-b from-indigo-50/50 to-white p-4 space-y-4">
          <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-xs">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>Phân tích Logic Từng Bước (Phương pháp Loại trừ)</span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3].map((step) => (
              <button
                key={step}
                onClick={() => setLearnStep(step as 1 | 2 | 3)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                  learnStep === step
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                Bước {step}
              </button>
            ))}
          </div>

          {learnStep === 1 && (
            <div className="text-xs text-slate-700 space-y-2 bg-white p-3.5 rounded-xl border border-indigo-100">
              <strong className="text-indigo-900 block text-sm">
                Bước 1: Khai thác thông tin từ dãy quét thử
              </strong>
              <p>
                Máy quét thử dãy: <span className="font-mono font-bold text-amber-700">1 2 2 2 2 2 2 2 2</span> và báo <strong>0 vị trí đúng</strong>.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>
                  Vị trí 1 thử số 1 và báo sai → <strong>Vị trí 1 không thể là số 1</strong>.
                </li>
                <li>
                  Vị trí 2 đến 9 đều thử số 2 và báo sai → <strong>Các vị trí từ 2 đến 9 đều KHÔNG THỂ là số 2</strong>!
                </li>
              </ul>
            </div>
          )}

          {learnStep === 2 && (
            <div className="text-xs text-slate-700 space-y-2 bg-white p-3.5 rounded-xl border border-indigo-100">
              <strong className="text-indigo-900 block text-sm">
                Bước 2: Ràng buộc bắt buộc của mật mã
              </strong>
              <p>
                Đề bài nêu rõ: Mật mã gồm 9 chữ số từ 1 đến 9, và <strong>mỗi chữ số xuất hiện đúng một lần</strong>.
              </p>
              <p className="rounded-lg bg-indigo-50 p-2 font-semibold text-indigo-900">
                → Chữ số <strong>2</strong> BẮT BUỘC phải có mặt tại đúng một vị trí trong số 9 vị trí!
              </p>
            </div>
          )}

          {learnStep === 3 && (
            <div className="text-xs text-slate-700 space-y-2 bg-white p-3.5 rounded-xl border border-indigo-100">
              <strong className="text-indigo-900 block text-sm">
                Bước 3: Kết luận vị trí duy nhất của chữ số 2
              </strong>
              <p>
                Ta có:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Số 2 không thể nằm ở vị trí 2, 3, 4, 5, 6, 7, 8, 9 (do bước 1).</li>
                <li>Số 2 bắt buộc phải nằm ở một trong các vị trí từ 1 đến 9 (do bước 2).</li>
              </ul>
              <p className="text-sm font-black text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                ✅ Vậy chữ số 2 CHỈ CÒN DUY NHẤT một vị trí để đứng: đó là <strong>Vị trí 1</strong>!
              </p>
              <p className="text-slate-600">
                Đáp án: Chữ số đầu tiên của mật mã là <strong>2</strong>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
