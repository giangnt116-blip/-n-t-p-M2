import React, { useState, useMemo, useEffect } from "react";
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowUp,
  ArrowDown,
  Info,
  Play,
  Pause,
  Sliders,
} from "lucide-react";

interface TowerJourneyLabProps {
  mode: "challenge" | "learn";
  config?: any;
}

export const TowerJourneyLab: React.FC<TowerJourneyLabProps> = ({
  mode,
  config,
}) => {
  const bottomFloor = (config?.bottomFloor as number) || 1;
  const topFloor = (config?.topFloor as number) || 41;

  // The fixed reference distance between bottomFloor and topFloor
  const totalTowerDistance = topFloor - bottomFloor; // 40

  // State: Rabbit floor (R) and Hedgehog floor (H)
  // Default values for exploration:
  const [rabbitFloor, setRabbitFloor] = useState<number>(() => {
    return mode === "learn" ? 31 : 15;
  });
  const [hedgehogFloor, setHedgehogFloor] = useState<number>(() => {
    return mode === "learn" ? 21 : 10;
  });

  // Learn mode current step (1, 2, 3)
  const [learnStep, setLearnStep] = useState<1 | 2 | 3>(1);

  // Animation state for Learn Mode journey (1 -> R -> H)
  const [isPlayingAnimation, setIsPlayingAnimation] = useState<boolean>(false);
  const [animatedRabbitPos, setAnimatedRabbitPos] = useState<number>(1);
  const [animationLeg, setAnimationLeg] = useState<"idle" | "leg1" | "leg2">("idle");

  // Calculations
  // Segment 1: from bottomFloor to rabbitFloor
  const leg1Distance = Math.abs(rabbitFloor - bottomFloor);
  // Segment 2: from rabbitFloor to hedgehogFloor
  const leg2Distance = Math.abs(rabbitFloor - hedgehogFloor);
  // Total journey distance
  const totalJourneyDistance = leg1Distance + leg2Distance;

  // Distance from bottomFloor to hedgehogFloor
  const bottomToHedgehog = Math.abs(hedgehogFloor - bottomFloor);
  const doubleBottomToHedgehog = 2 * bottomToHedgehog;

  // Condition 1: Total journey distance == totalTowerDistance (40)
  const condition1Satisfied = totalJourneyDistance === totalTowerDistance;

  // Condition 2: Total journey distance == 2 * distance from 1 to hedgehog
  const condition2Satisfied = totalJourneyDistance === doubleBottomToHedgehog;

  // Both conditions satisfied
  const bothSatisfied = condition1Satisfied && condition2Satisfied;

  // Reset sliders
  const handleReset = () => {
    setRabbitFloor(15);
    setHedgehogFloor(10);
    setIsPlayingAnimation(false);
  };

  // Set optimal in Learn Mode
  const handleLoadOptimal = () => {
    setRabbitFloor(31);
    setHedgehogFloor(21);
  };

  // Animation loop in Learn Mode
  useEffect(() => {
    let timer: any;
    if (isPlayingAnimation) {
      // Step through: start at 1, go to 31, then go to 21
      let current = bottomFloor;
      setAnimatedRabbitPos(current);
      setAnimationLeg("leg1");

      const interval = setInterval(() => {
        setAnimatedRabbitPos((prev) => {
          if (prev < rabbitFloor && animationLeg !== "leg2") {
            setAnimationLeg("leg1");
            return prev + 1;
          } else if (prev === rabbitFloor && animationLeg === "leg1") {
            setAnimationLeg("leg2");
            return prev;
          } else if (animationLeg === "leg2") {
            if (rabbitFloor > hedgehogFloor) {
              if (prev > hedgehogFloor) return prev - 1;
              setIsPlayingAnimation(false);
              setAnimationLeg("idle");
              return hedgehogFloor;
            } else {
              if (prev < hedgehogFloor) return prev + 1;
              setIsPlayingAnimation(false);
              setAnimationLeg("idle");
              return hedgehogFloor;
            }
          }
          return prev;
        });
      }, 45);

      return () => clearInterval(interval);
    } else {
      setAnimatedRabbitPos(rabbitFloor);
      setAnimationLeg("idle");
    }
  }, [isPlayingAnimation, rabbitFloor, hedgehogFloor, bottomFloor, animationLeg]);

  return (
    <div className="w-full space-y-6">
      {/* 1. TOP METRICS DASHBOARD */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Metric 1: Condition 1 */}
        <div
          className={`rounded-2xl border p-4 shadow-2xs transition-all ${
            condition1Satisfied
              ? "border-emerald-200 bg-emerald-50/70"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Điều kiện 1: Tổng đường đi
            </span>
            {condition1Satisfied ? (
              <span className="flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Đạt
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800">
                <XCircle className="h-3.5 w-3.5 text-rose-600" /> Chưa đạt
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span
              className={`text-2xl font-black ${
                condition1Satisfied ? "text-emerald-700" : "text-slate-900"
              }`}
            >
              {totalJourneyDistance}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              / Mục tiêu: {totalTowerDistance} tầng
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            (Quãng đường từ tầng {bottomFloor} lên tầng {topFloor} là{" "}
            {totalTowerDistance})
          </p>
        </div>

        {/* Metric 2: Condition 2 */}
        <div
          className={`rounded-2xl border p-4 shadow-2xs transition-all ${
            condition2Satisfied
              ? "border-emerald-200 bg-emerald-50/70"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Điều kiện 2: Gấp đôi khoảng cách
            </span>
            {condition2Satisfied ? (
              <span className="flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Đạt
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800">
                <XCircle className="h-3.5 w-3.5 text-rose-600" /> Chưa đạt
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span
              className={`text-2xl font-black ${
                condition2Satisfied ? "text-emerald-700" : "text-slate-900"
              }`}
            >
              {totalJourneyDistance}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              = 2 × ({hedgehogFloor} - 1) = {doubleBottomToHedgehog}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Khoảng cách tầng 1 tới Nhím: {bottomToHedgehog} tầng
          </p>
        </div>

        {/* Metric 3: Overall Status */}
        <div
          className={`rounded-2xl border p-4 shadow-2xs flex flex-col justify-between ${
            bothSatisfied
              ? "border-emerald-300 bg-emerald-100/60"
              : "border-amber-200 bg-amber-50/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Kết quả đối chiếu
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            {bothSatisfied ? (
              <div className="space-y-0.5">
                <span className="flex items-center gap-1.5 text-sm font-black text-emerald-900">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  Em đã tìm được vị trí phù hợp!
                </span>
                <p className="text-[11px] text-emerald-700 font-medium">
                  Cả 2 điều kiện đều thỏa mãn chính xác.
                </p>
              </div>
            ) : (
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold text-amber-900">
                  Kéo hai marker để tìm vị trí
                </span>
                <p className="text-[11px] text-amber-700">
                  Cần làm cho cả 2 điều kiện cùng hiển thị ✅
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. TOWER VISUALIZATION & CONTROLS CONTAINER */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* LEFT / CENTER: VERTICAL TOWER (41 floors) */}
        <div className="lg:col-span-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">🏢</span>
              <h4 className="text-sm font-black text-slate-800">
                Tòa tháp 41 tầng
              </h4>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
              title="Đặt lại vị trí ban đầu"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>

          {/* Vertical representation of tower */}
          <div className="relative flex items-stretch gap-4 py-2">
            {/* Floor Scale Ruler */}
            <div className="w-14 flex flex-col justify-between py-1 text-[11px] font-mono font-bold text-slate-400 select-none text-right pr-2 border-r border-slate-200">
              <div className="flex items-center justify-end gap-1 text-slate-700 font-black">
                <span>41</span>
                <span className="h-1 w-2 bg-slate-400 rounded-xs" />
              </div>
              <div className="flex items-center justify-end gap-1">
                <span>31</span>
                <span className="h-0.5 w-1.5 bg-slate-300 rounded-xs" />
              </div>
              <div className="flex items-center justify-end gap-1">
                <span>21</span>
                <span className="h-0.5 w-1.5 bg-slate-300 rounded-xs" />
              </div>
              <div className="flex items-center justify-end gap-1">
                <span>11</span>
                <span className="h-0.5 w-1.5 bg-slate-300 rounded-xs" />
              </div>
              <div className="flex items-center justify-end gap-1 text-slate-700 font-black">
                <span>1</span>
                <span className="h-1 w-2 bg-slate-400 rounded-xs" />
              </div>
            </div>

            {/* Tower shaft */}
            <div className="relative flex-1 h-[380px] bg-slate-100 rounded-2xl border-2 border-slate-200 overflow-hidden flex flex-col justify-between p-2">
              {/* Floor gridlines background */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 p-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="border-b border-slate-500 w-full" />
                ))}
              </div>

              {/* Journey paths overlay */}
              {/* Bottom floor label */}
              <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-bold text-slate-400">
                Tầng 1 (Khởi hành)
              </div>

              {/* Top floor label */}
              <div className="absolute top-2 left-2 right-2 text-center text-[10px] font-bold text-slate-400">
                Tầng 41 (Đỉnh tháp)
              </div>

              {/* Markers positioned proportionally: floor 1 at bottom (0%), floor 41 at top (100%) */}
              {/* Hedgehog marker */}
              <div
                style={{
                  bottom: `${((hedgehogFloor - 1) / (topFloor - bottomFloor)) * 86 + 6}%`,
                }}
                className="absolute left-4 right-4 flex items-center justify-between pointer-events-none transition-all duration-200"
              >
                <div className="flex items-center gap-1.5 rounded-xl border border-amber-400 bg-amber-100/90 px-3 py-1 shadow-sm text-xs font-black text-amber-950">
                  <span className="text-base">🦔</span>
                  <span>Nhím: Tầng {hedgehogFloor}</span>
                </div>
                <div className="h-0.5 flex-1 border-b-2 border-dashed border-amber-400 mx-2" />
              </div>

              {/* Rabbit marker */}
              <div
                style={{
                  bottom: `${((rabbitFloor - 1) / (topFloor - bottomFloor)) * 86 + 6}%`,
                }}
                className="absolute left-4 right-4 flex items-center justify-between pointer-events-none transition-all duration-200"
              >
                <div className="flex items-center gap-1.5 rounded-xl border border-indigo-500 bg-indigo-600 px-3 py-1 shadow-sm text-xs font-black text-white">
                  <span className="text-base">🐰</span>
                  <span>Thỏ: Tầng {rabbitFloor}</span>
                </div>
                <div className="h-0.5 flex-1 border-b-2 border-dashed border-indigo-400 mx-2" />
              </div>

              {/* Animated Journey Rabbit (in Learn Mode) */}
              {mode === "learn" && isPlayingAnimation && (
                <div
                  style={{
                    bottom: `${((animatedRabbitPos - 1) / (topFloor - bottomFloor)) * 86 + 6}%`,
                  }}
                  className="absolute right-6 flex items-center justify-center pointer-events-none transition-all duration-100"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg ring-4 ring-rose-200 animate-bounce">
                    <span className="text-xl">🐰</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Journey breakdown note */}
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-700 font-bold">
              <span>Đoạn 1 (1 → Thỏ):</span>
              <span className="font-mono text-indigo-700">
                {rabbitFloor} - 1 = {leg1Distance} tầng
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-700 font-bold">
              <span>Đoạn 2 (Thỏ → Nhím):</span>
              <span className="font-mono text-amber-700">
                |{rabbitFloor} - {hedgehogFloor}| = {leg2Distance} tầng
              </span>
            </div>
            <div className="border-t border-slate-200 pt-1.5 flex items-center justify-between font-black text-slate-900">
              <span>Tổng hành trình:</span>
              <span className="text-sm text-indigo-900">
                {leg1Distance} + {leg2Distance} = {totalJourneyDistance} tầng
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: INTERACTIVE SLIDERS & CONTROLS */}
        <div className="lg:col-span-6 space-y-5">
          {/* SLIDERS CARD */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-indigo-600" />
                <h4 className="text-sm font-black text-slate-800">
                  Điều chỉnh vị trí các tầng (Kéo Marker)
                </h4>
              </div>
            </div>

            {/* Slider 1: Rabbit Floor */}
            <div className="space-y-2 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🐰</span>
                  <div>
                    <h5 className="text-xs font-black text-indigo-950">
                      Vị trí nhà Thỏ Trắng (R)
                    </h5>
                    <span className="text-[11px] text-slate-500">
                      Tầng {bottomFloor} đến tầng {topFloor}
                    </span>
                  </div>
                </div>
                <span className="rounded-xl bg-indigo-600 px-3 py-1 text-sm font-black text-white shadow-2xs">
                  Tầng {rabbitFloor}
                </span>
              </div>

              <input
                type="range"
                min={bottomFloor}
                max={topFloor}
                value={rabbitFloor}
                onChange={(e) => setRabbitFloor(Number(e.target.value))}
                className="w-full h-2.5 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />

              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Tầng 1</span>
                <span>Tầng 10</span>
                <span>Tầng 20</span>
                <span>Tầng 30</span>
                <span>Tầng 41</span>
              </div>
            </div>

            {/* Slider 2: Hedgehog Floor */}
            <div className="space-y-2 rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🦔</span>
                  <div>
                    <h5 className="text-xs font-black text-amber-950">
                      Vị trí nhà Nhím Nâu (H)
                    </h5>
                    <span className="text-[11px] text-slate-500">
                      Tầng {bottomFloor} đến tầng {topFloor}
                    </span>
                  </div>
                </div>
                <span className="rounded-xl bg-amber-500 px-3 py-1 text-sm font-black text-white shadow-2xs">
                  Tầng {hedgehogFloor}
                </span>
              </div>

              <input
                type="range"
                min={bottomFloor}
                max={topFloor}
                value={hedgehogFloor}
                onChange={(e) => setHedgehogFloor(Number(e.target.value))}
                className="w-full h-2.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />

              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Tầng 1</span>
                <span>Tầng 10</span>
                <span>Tầng 20</span>
                <span>Tầng 30</span>
                <span>Tầng 41</span>
              </div>
            </div>
          </div>

          {/* CHALLENGE HELPER TIPS */}
          {mode === "challenge" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 font-extrabold text-slate-800">
                <Info className="h-4 w-4 text-indigo-600" />
                <span>Mẹo quan sát khi kéo marker</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-600">
                <li>
                  Tổng quãng đường Thỏ đi là đoạn từ <strong>Tầng 1 → Nhà Thỏ</strong> cộng đoạn từ <strong>Nhà Thỏ → Nhà Nhím</strong>.
                </li>
                <li>
                  Khoảng cách từ tầng 1 lên tầng 41 là đúng <strong>40 tầng</strong>.
                </li>
                <li>
                  Khi kéo marker của Nhím, quan sát xem số tầng của Nhím có liên hệ thế nào với con số 40 này!
                </li>
              </ul>
            </div>
          )}

          {/* LEARN MODE: STEP-BY-STEP REASONING */}
          {mode === "learn" && (
            <div className="rounded-3xl border border-indigo-200 bg-indigo-50/50 p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  <h4 className="text-sm font-extrabold text-indigo-950">
                    Phân tích tư duy 3 bước
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLoadOptimal}
                    className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700 active:scale-95 transition"
                  >
                    <span>Nạp nghiệm (31, 21)</span>
                  </button>
                  <button
                    onClick={() => setIsPlayingAnimation(!isPlayingAnimation)}
                    className="flex items-center gap-1.5 rounded-xl border border-indigo-300 bg-white px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-2xs hover:bg-indigo-50 transition"
                  >
                    {isPlayingAnimation ? (
                      <>
                        <Pause className="h-3.5 w-3.5 text-rose-600" />
                        <span>Dừng</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Mô phỏng hành trình</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Step Navigation Tabs */}
              <div className="flex rounded-xl bg-white p-1 border border-indigo-200 text-xs font-bold">
                <button
                  onClick={() => setLearnStep(1)}
                  className={`flex-1 rounded-lg py-2 transition ${
                    learnStep === 1
                      ? "bg-indigo-600 text-white shadow-2xs font-extrabold"
                      : "text-slate-600 hover:text-indigo-600"
                  }`}
                >
                  Bước 1: Tìm tầng Nhím
                </button>
                <button
                  onClick={() => setLearnStep(2)}
                  className={`flex-1 rounded-lg py-2 transition ${
                    learnStep === 2
                      ? "bg-indigo-600 text-white shadow-2xs font-extrabold"
                      : "text-slate-600 hover:text-indigo-600"
                  }`}
                >
                  Bước 2: Xác định vị trí Thỏ
                </button>
                <button
                  onClick={() => setLearnStep(3)}
                  className={`flex-1 rounded-lg py-2 transition ${
                    learnStep === 3
                      ? "bg-indigo-600 text-white shadow-2xs font-extrabold"
                      : "text-slate-600 hover:text-indigo-600"
                  }`}
                >
                  Bước 3: Giải phương trình
                </button>
              </div>

              {/* Step Content */}
              <div className="rounded-2xl border border-indigo-100 bg-white p-4 text-xs text-slate-700 leading-relaxed space-y-3">
                {learnStep === 1 && (
                  <div className="space-y-2">
                    <p className="font-bold text-indigo-950 text-sm">
                      Bước 1: Xác định tầng nhà Nhím Nâu
                    </p>
                    <p>
                      • Quãng đường từ tầng 1 lên tầng 41 có độ dài:{" "}
                      <strong>41 - 1 = 40 (độ dài tầng)</strong>.
                    </p>
                    <p>
                      • Theo đề bài, tổng quãng đường Thỏ đi đúng bằng quãng đường từ tầng 1 lên tầng 41, tức là{" "}
                      <strong>Tổng quãng đường = 40</strong>.
                    </p>
                    <p>
                      • Lại có: Tổng quãng đường đó bằng <strong>2 lần</strong> khoảng cách từ tầng 1 đến nhà Nhím:
                    </p>
                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 font-mono text-[11px] text-amber-900 space-y-1">
                      <p>2 × (Khoảng cách từ tầng 1 đến Nhím) = 40</p>
                      <p className="font-bold text-amber-950">
                        ⇒ Khoảng cách từ tầng 1 đến Nhím = 40 : 2 = 20 (tầng)
                      </p>
                    </div>
                    <p className="font-bold text-slate-800">
                      👉 Vậy: Nhà Nhím ở tầng <strong>1 + 20 = 21</strong>.
                    </p>
                  </div>
                )}

                {learnStep === 2 && (
                  <div className="space-y-2">
                    <p className="font-bold text-indigo-950 text-sm">
                      Bước 2: Xác định tương quan vị trí giữa Thỏ và Nhím
                    </p>
                    <p>
                      Bây giờ ta biết Nhím ở tầng 21. Thỏ xuất phát từ tầng 1 đi qua nhà Thỏ (tầng R) rồi sang nhà Nhím (tầng 21):
                      Hành trình: <strong>1 → R → 21</strong>.
                    </p>
                    <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-[11px] text-rose-900 space-y-1">
                      <p className="font-bold text-rose-950">
                        Giả sử Thỏ ở dưới hoặc đúng tầng Nhím (R ≤ 21):
                      </p>
                      <p>
                        Khi Thỏ đi từ 1 lên R rồi từ R lên 21, Thỏ chỉ đi một mạch thẳng từ 1 lên 21.
                      </p>
                      <p className="font-mono font-bold">
                        Độ dài quãng đường = (R - 1) + (21 - R) = 20
                      </p>
                      <p>Con số 20 này không thể bằng 40!</p>
                    </div>
                    <p className="font-bold text-slate-800">
                      👉 <strong>Kết luận:</strong> Thỏ không thể ở dưới tầng 21. Thỏ bắt buộc phải sống ở{" "}
                      <strong>phía trên Nhím (R &gt; 21)</strong> (Thỏ đi vượt qua tầng Nhím lên nhà mình, rồi mới đi ngược xuống nhà Nhím).
                    </p>
                  </div>
                )}

                {learnStep === 3 && (
                  <div className="space-y-2">
                    <p className="font-bold text-indigo-950 text-sm">
                      Bước 3: Thiết lập phương trình và tìm tầng nhà Thỏ
                    </p>
                    <p>Vì Thỏ ở trên Nhím (R &gt; 21):</p>
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 font-mono text-[11px] space-y-1.5">
                      <p>• Đoạn 1 (1 → R): độ dài là <strong>R - 1</strong></p>
                      <p>• Đoạn 2 (R → 21): độ dài là <strong>R - 21</strong></p>
                      <div className="border-t border-slate-200 pt-1 text-indigo-700 font-bold">
                        (R - 1) + (R - 21) = 40
                      </div>
                      <p className="text-indigo-700 font-bold">
                        2R - 22 = 40
                      </p>
                      <p className="text-indigo-700 font-bold">
                        2R = 62  ⇒  R = 31
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-900 space-y-1">
                      <p className="font-bold text-emerald-950">Kiểm tra lại:</p>
                      <p>• Đi từ tầng 1 lên tầng 31: 31 - 1 = 30 tầng</p>
                      <p>• Đi từ tầng 31 xuống tầng 21: 31 - 21 = 10 tầng</p>
                      <p className="font-bold">
                        • Tổng quãng đường: 30 + 10 = 40 tầng (Đúng bằng tầng 1 lên tầng 41)
                      </p>
                      <p className="font-bold">
                        • Gấp đôi khoảng cách 1 tới 21: 2 × 20 = 40 tầng (Đúng)
                      </p>
                    </div>

                    <p className="font-bold text-slate-800 text-sm">
                      🎉 Kết luận: Thỏ Trắng sống ở <strong>tầng 31</strong>.
                    </p>
                  </div>
                )}
              </div>

              {/* Teaching Point */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Quy tắc tư duy cốt lõi (Teaching Point):</strong>
                  “Hãy chuyển câu chuyện về quãng đường thành các đoạn có độ dài cụ thể.”
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
