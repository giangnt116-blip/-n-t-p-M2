import React, { useState, useMemo } from "react";
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Users,
  Eye,
  ListOrdered,
  Layers,
  HelpCircle,
  X,
} from "lucide-react";
import { QuestionMode } from "../types/question";
import {
  ArrangementConfig,
  ArrangementRule,
  validateAllRules,
  findAllValidArrangements,
  analyzeByPivotPosition,
} from "../utils/arrangementUtils";

interface ArrangementLabProps {
  config?: ArrangementConfig;
  mode: QuestionMode;
}

export const ArrangementLab: React.FC<ArrangementLabProps> = ({ config, mode }) => {
  const items: string[] = useMemo(
    () => config?.items || ["A", "B", "C", "D", "E"],
    [config?.items]
  );

  const rules: ArrangementRule[] = useMemo(
    () =>
      config?.rules || [
        {
          type: "before",
          a: "A",
          b: "B",
          text: "A phải đứng bên trái B",
        },
        {
          type: "notAdjacent",
          a: "C",
          b: "A",
          text: "C không được đứng cạnh A",
        },
        {
          type: "notAdjacent",
          a: "C",
          b: "B",
          text: "C không được đứng cạnh B",
        },
      ],
    [config?.rules]
  );

  const totalSlots = items.length;

  // State: slots representing positions 1..totalSlots (array of string or null)
  const [slots, setSlots] = useState<(string | null)[]>(
    Array(totalSlots).fill(null)
  );

  // Selected item from unplaced pool or slots
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Validation feedback state
  const [checkResult, setCheckResult] = useState<{
    checked: boolean;
    valid?: boolean;
    detailed?: boolean;
    results?: Array<{ rule: ArrangementRule; satisfied: boolean; message: string }>;
  }>({ checked: false });

  // Learn Mode states
  const [showPivotAnalysis, setShowPivotAnalysis] = useState<boolean>(
    mode === "learn"
  );
  const [selectedPivotCase, setSelectedPivotCase] = useState<number | null>(null);
  const [showAllValidWays, setShowAllValidWays] = useState<boolean>(false);

  // Unplaced items in the pool
  const placedItems = useMemo(
    () => new Set(slots.filter((item): item is string => item !== null)),
    [slots]
  );
  const unplacedItems = useMemo(
    () => items.filter((item) => !placedItems.has(item)),
    [items, placedItems]
  );

  // Pre-calculate all valid ways & pivot breakdown for Learn Mode
  const allValidWays = useMemo(
    () => findAllValidArrangements(items, rules),
    [items, rules]
  );

  const pivotCases = useMemo(
    () => analyzeByPivotPosition(items, rules, "C"),
    [items, rules]
  );

  // Handlers for user interactions
  const handleSelectPoolItem = (item: string) => {
    setSelectedItem(selectedItem === item ? null : item);
    setCheckResult({ checked: false });
  };

  const handleSlotClick = (index: number) => {
    const currentOccupant = slots[index];

    // If an item is currently selected from pool or another slot
    if (selectedItem) {
      const sourceSlotIndex = slots.indexOf(selectedItem);
      const newSlots = [...slots];

      if (sourceSlotIndex !== -1) {
        // Swap or move from another slot
        newSlots[sourceSlotIndex] = currentOccupant;
        newSlots[index] = selectedItem;
      } else {
        // Place from pool into this slot
        newSlots[index] = selectedItem;
      }

      setSlots(newSlots);
      setSelectedItem(null);
      setCheckResult({ checked: false });
      return;
    }

    // If no item selected and clicking an occupied slot, select it to move
    if (currentOccupant) {
      setSelectedItem(currentOccupant);
      setCheckResult({ checked: false });
    }
  };

  const handleRemoveFromSlot = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);
    setSelectedItem(null);
    setCheckResult({ checked: false });
  };

  const handleReset = () => {
    setSlots(Array(totalSlots).fill(null));
    setSelectedItem(null);
    setCheckResult({ checked: false });
    setSelectedPivotCase(null);
    setShowAllValidWays(false);
  };

  // Check arrangement
  const handleCheckArrangement = (showDetails: boolean = false) => {
    const isComplete = slots.every((s) => s !== null);
    if (!isComplete) {
      setCheckResult({
        checked: true,
        valid: false,
        detailed: false,
        results: [],
      });
      return;
    }

    const { valid, results } = validateAllRules(
      rules,
      slots as string[]
    );

    setCheckResult({
      checked: true,
      valid,
      detailed: showDetails,
      results,
    });
  };

  // Learn Mode: Load a sample valid way
  const handleLoadSample = (sampleArr: string[]) => {
    setSlots([...sampleArr]);
    setSelectedItem(null);
    setCheckResult({
      checked: true,
      valid: true,
      detailed: true,
      results: rules.map((r) => ({
        rule: r,
        satisfied: true,
        message: `Thỏa mãn: ${r.text}`,
      })),
    });
  };

  const isFull = slots.every((s) => s !== null);

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-slate-50/70 to-white p-5 shadow-xs space-y-5">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mô phỏng tương tác
              </span>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-700">
                arrangementLab
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Xếp hàng & Thử nghiệm Ràng buộc (A, B, C, D, E)
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {mode === "learn" && (
            <>
              <button
                onClick={() => setShowPivotAnalysis(!showPivotAnalysis)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                  showPivotAnalysis
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Khám phá theo vị trí của C</span>
              </button>

              <button
                onClick={() => setShowAllValidWays(!showAllValidWays)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                  showAllValidWays
                    ? "bg-indigo-700 text-white shadow-xs"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <ListOrdered className="h-3.5 w-3.5" />
                <span>Xem tất cả cách ({allValidWays.length})</span>
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

      {/* RULES OVERVIEW PANEL */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Các điều kiện cần thỏa mãn:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 font-medium shadow-2xs"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-bold font-mono">
                {idx + 1}
              </span>
              <span>{rule.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 1. SOURCE ITEMS POOL */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Các thẻ bạn (Chọn thẻ rồi bấm vào vị trí muốn đặt):
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Chưa xếp: {unplacedItems.length}/{items.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {items.map((item) => {
            const isPlaced = placedItems.has(item);
            const isSelected = selectedItem === item;

            return (
              <button
                key={item}
                onClick={() => !isPlaced && handleSelectPoolItem(item)}
                disabled={isPlaced}
                className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 font-mono text-xl font-black transition-all active:scale-95 select-none ${
                  isPlaced
                    ? "border-slate-200 bg-slate-100 text-slate-300 opacity-40 cursor-not-allowed"
                    : isSelected
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md ring-2 ring-indigo-300 scale-105"
                    : "border-slate-300 bg-white text-slate-800 hover:border-indigo-300 hover:bg-slate-50 shadow-2xs"
                }`}
              >
                <span>{item}</span>
                {isPlaced && (
                  <span className="absolute bottom-1 text-[9px] font-sans font-bold text-slate-400">
                    đã xếp
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {selectedItem && (
          <div className="text-xs font-medium text-indigo-700 bg-indigo-50 p-2 rounded-lg border border-indigo-200 flex items-center justify-between">
            <span>
              Đang chọn thẻ <strong>{selectedItem}</strong>. Bấm vào một ô trống dưới hàng để xếp thẻ vào!
            </span>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-[11px] text-slate-500 underline hover:text-slate-800"
            >
              Hủy chọn
            </button>
          </div>
        )}
      </div>

      {/* 2. THE ROW SLOTS (5 POSITIONS) */}
      <div className="rounded-2xl border-2 border-indigo-200 bg-white p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span>Hàng xếp thực tế (Từ trái sang phải):</span>
          <span className="text-slate-400 font-medium text-[11px]">
            Vị trí 1 là bên trái nhất • Vị trí 5 là bên phải nhất
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {slots.map((occupant, index) => {
            const slotPos = index + 1;
            const isSelected = selectedItem === occupant && occupant !== null;

            return (
              <div
                key={index}
                onClick={() => handleSlotClick(index)}
                className={`relative flex flex-col items-center justify-between rounded-2xl border-2 p-2 aspect-square cursor-pointer transition-all duration-200 select-none ${
                  occupant
                    ? isSelected
                      ? "border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-300 scale-105"
                      : "border-slate-800 bg-slate-900 text-white shadow-xs"
                    : selectedItem
                    ? "border-dashed border-indigo-400 bg-indigo-50/40 hover:bg-indigo-100/50"
                    : "border-dashed border-slate-300 bg-slate-50 hover:border-slate-400"
                }`}
              >
                {/* Slot Position Label */}
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    occupant && !isSelected ? "text-slate-400" : "text-slate-400"
                  }`}
                >
                  Vị trí {slotPos}
                </span>

                {/* Occupant Content */}
                <div className="flex items-center justify-center flex-1">
                  {occupant ? (
                    <span
                      className={`font-mono text-2xl sm:text-3xl font-black ${
                        isSelected ? "text-indigo-700" : "text-white"
                      }`}
                    >
                      {occupant}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-300">Trống</span>
                  )}
                </div>

                {/* Remove button if occupied */}
                {occupant && (
                  <button
                    onClick={(e) => handleRemoveFromSlot(index, e)}
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs hover:bg-rose-600 transition"
                    title="Gỡ thẻ này ra khỏi hàng"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* VALIDATION ACTION CONTROLS */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCheckArrangement(false)}
              disabled={!isFull}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Kiểm tra cách xếp</span>
            </button>

            <button
              onClick={() => handleCheckArrangement(true)}
              disabled={!isFull}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition shadow-2xs"
            >
              <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
              <span>Kiểm tra từng điều kiện</span>
            </button>
          </div>

          <span className="text-xs text-slate-500">
            {isFull ? "Đã xếp đủ 5 vị trí." : `Còn thiếu ${unplacedItems.length} bạn.`}
          </span>
        </div>

        {/* FEEDBACK DISPLAY */}
        {checkResult.checked && (
          <div className="space-y-2 pt-2">
            {!isFull ? (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-900">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>Vui lòng xếp đủ cả 5 bạn vào các vị trí trước khi kiểm tra!</span>
              </div>
            ) : checkResult.valid ? (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-900">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>✅ Hợp lệ: Cách xếp này thỏa mãn tất cả điều kiện! ({slots.join(" - ")})</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-900">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>❌ Cách xếp này chưa thỏa mãn tất cả điều kiện.</span>
                </div>

                {/* If detailed check requested, show breakdown */}
                {checkResult.detailed && checkResult.results && (
                  <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">
                      Chi tiết từng điều kiện:
                    </span>
                    {checkResult.results.map((r, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between rounded-lg p-2 ${
                          r.satisfied
                            ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                            : "bg-rose-50 text-rose-900 border border-rose-200 font-semibold"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{r.satisfied ? "✅" : "❌"}</span>
                          <span>{r.rule.text}</span>
                        </div>
                        <span className="text-[11px]">{r.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* LEARN MODE: EXPLORE BY PIVOT C POSITION */}
      {mode === "learn" && showPivotAnalysis && (
        <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="flex items-center justify-between border-b border-emerald-200/70 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Khám phá theo 5 trường hợp vị trí của C</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-800">
              Tổng số cách: <strong>18 cách</strong>
            </span>
          </div>

          <div className="grid gap-2 sm:grid-cols-5">
            {pivotCases.map((c) => {
              const isSelected = selectedPivotCase === c.position;
              return (
                <button
                  key={c.position}
                  onClick={() => setSelectedPivotCase(c.position)}
                  className={`rounded-xl border p-2.5 text-left text-xs transition active:scale-95 space-y-1 ${
                    isSelected
                      ? "border-emerald-600 bg-white shadow-xs ring-2 ring-emerald-300"
                      : "border-emerald-200 bg-white/80 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-emerald-950">
                    <span>C ở vị trí {c.position}</span>
                    <span className="font-mono text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                      {c.validCount} cách
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span
                        key={idx}
                        className={`inline-block px-1 mx-0.5 rounded ${
                          idx + 1 === c.position
                            ? "bg-indigo-600 text-white font-bold"
                            : (Object.values(c.forbiddenSlotsForOthers) as number[][]).some((arr) =>
                                arr.includes(idx + 1)
                              )
                            ? "bg-rose-100 text-rose-700 font-bold"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {idx + 1 === c.position ? "C" : idx + 1 === 1 && c.position === 1 ? "✕" : "_"}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Details for Selected Case */}
          {selectedPivotCase && (
            <div className="rounded-xl border border-emerald-300 bg-white p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-emerald-950 border-b border-slate-100 pb-1.5">
                <span>
                  Phân tích chi tiết: Khi C đứng ở vị trí {selectedPivotCase} (
                  {pivotCases.find((c) => c.position === selectedPivotCase)?.validCount} cách)
                </span>
                <span className="text-[11px] text-slate-500 font-normal">
                  (Bấm mẫu để thử nạp lên hàng)
                </span>
              </div>

              <div className="text-slate-600 space-y-1">
                {selectedPivotCase === 1 || selectedPivotCase === 5 ? (
                  <p>
                    • C đứng ở mép ngoài: vị trí kề cạnh C chỉ có 1 vị trí (không được là A hoặc B) → Bắt buộc phải là D hoặc E (2 lựa chọn). Ba vị trí còn lại xếp {`{A, B, người còn lại}`}, do A đứng trước B nên có 3 × 1 = 3 cách. Tổng = 2 × 3 = <strong>6 cách</strong>.
                  </p>
                ) : (
                  <p>
                    • C đứng ở giữa: có 2 vị trí kề hai bên C. Cả hai vị trí này đều không được là A hoặc B → Bắt buộc phải là D và E (2! = 2 cách đổi chỗ). Hai vị trí còn lại xếp A và B (A đứng trước B nên chỉ 1 cách duy nhất). Tổng = 2 × 1 = <strong>2 cách</strong>.
                  </p>
                )}
              </div>

              {/* Sample buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-slate-400">Cách mẫu:</span>
                {pivotCases
                  .find((c) => c.position === selectedPivotCase)
                  ?.sampleValid.map((sampleStr, sIdx) => {
                    const sampleArr = sampleStr.split(" - ");
                    return (
                      <button
                        key={sIdx}
                        onClick={() => handleLoadSample(sampleArr)}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs font-bold text-indigo-700 hover:bg-indigo-50"
                      >
                        {sampleStr} 👆
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-emerald-300 bg-white p-3 text-center space-y-1">
            <p className="text-xs font-bold text-emerald-900">
              Teaching Point: “Chia bài toán thành các trường hợp nhỏ giúp ta đếm có hệ thống.”
            </p>
          </div>
        </div>
      )}

      {/* LEARN MODE: ALL 18 VALID PERMUTATIONS GRID */}
      {mode === "learn" && showAllValidWays && (
        <div className="space-y-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
          <div className="flex items-center justify-between border-b border-indigo-200/80 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
              <Eye className="h-4 w-4 text-indigo-600" />
              <span>Toàn bộ 18 cách xếp hàng hợp lệ (Bấm vào để thử nghiệm):</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-indigo-700">
              18/120 hoán vị
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {allValidWays.map((way, idx) => (
              <button
                key={idx}
                onClick={() => handleLoadSample(way)}
                className="rounded-xl border border-indigo-100 bg-white p-2 text-center font-mono text-xs font-extrabold text-slate-800 shadow-2xs hover:border-indigo-400 hover:bg-indigo-50/50 transition active:scale-95"
              >
                <div className="text-[10px] text-slate-400 font-sans mb-0.5">
                  Cách {idx + 1}
                </div>
                <div>{way.join(" - ")}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
