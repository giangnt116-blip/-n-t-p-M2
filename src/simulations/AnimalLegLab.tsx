import React, { useState, useMemo } from "react";
import {
  Trophy,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookmarkPlus,
  Info,
  ChevronRight,
  TrendingDown,
  Lock,
} from "lucide-react";

interface AnimalConfig {
  id: string;
  label: string;
  icon: string;
  legs: number;
  minimum: number;
}

interface AnimalLegLabProps {
  mode: "challenge" | "learn";
  config?: any;
}

export const AnimalLegLab: React.FC<AnimalLegLabProps> = ({ mode, config }) => {
  const targetTotalLegs = (config?.totalLegs as number) || 260;

  const defaultAnimals: AnimalConfig[] = [
    { id: "chicken", label: "Gà", icon: "🐔", legs: 2, minimum: 6 },
    { id: "pig", label: "Heo", icon: "🐷", legs: 4, minimum: 6 },
    { id: "spider", label: "Nhện", icon: "🕷️", legs: 8, minimum: 6 },
  ];

  const animals: AnimalConfig[] = (config?.animals as AnimalConfig[]) || defaultAnimals;

  // State: counts per animal, initialized to minimums
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    animals.forEach((a) => {
      initial[a.id] = a.minimum;
    });
    return initial;
  });

  // Challenge saved plans history
  const [savedPlans, setSavedPlans] = useState<
    Array<{
      id: string;
      counts: Record<string, number>;
      totalAnimals: number;
      totalLegs: number;
    }>
  >([]);

  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Learn mode active step (1, 2, 3)
  const [learnStep, setLearnStep] = useState<1 | 2 | 3>(1);

  // Calculations
  const currentTotalLegs = useMemo(() => {
    return animals.reduce((sum, a) => sum + (counts[a.id] || 0) * a.legs, 0);
  }, [animals, counts]);

  const currentTotalAnimals = useMemo(() => {
    return animals.reduce((sum, a) => sum + (counts[a.id] || 0), 0);
  }, [animals, counts]);

  const diffLegs = currentTotalLegs - targetTotalLegs;
  const isValid = currentTotalLegs === targetTotalLegs;

  // Best record in challenge mode (minimum total animals found by user so far)
  const bestRecord = useMemo(() => {
    if (savedPlans.length === 0) return null;
    return Math.min(...savedPlans.map((p) => p.totalAnimals));
  }, [savedPlans]);

  // Adjust count
  const handleUpdateCount = (animalId: string, delta: number) => {
    const animal = animals.find((a) => a.id === animalId);
    if (!animal) return;
    const current = counts[animalId] || 0;
    const next = Math.max(animal.minimum, current + delta);
    setCounts((prev) => ({
      ...prev,
      [animalId]: next,
    }));
    setSaveMessage(null);
  };

  // Reset to minimums
  const handleReset = () => {
    const initial: Record<string, number> = {};
    animals.forEach((a) => {
      initial[a.id] = a.minimum;
    });
    setCounts(initial);
    setSaveMessage(null);
  };

  // Save current configuration (only if legs === target)
  const handleSavePlan = () => {
    if (!isValid) return;

    // Check if already saved
    const exists = savedPlans.some(
      (p) =>
        p.counts.chicken === counts.chicken &&
        p.counts.pig === counts.pig &&
        p.counts.spider === counts.spider
    );

    if (exists) {
      setSaveMessage("Phương án này đã được lưu trước đó!");
      return;
    }

    const newPlan = {
      id: `${Date.now()}`,
      counts: { ...counts },
      totalAnimals: currentTotalAnimals,
      totalLegs: currentTotalLegs,
    };

    setSavedPlans((prev) => [newPlan, ...prev]);

    if (bestRecord === null || currentTotalAnimals < bestRecord) {
      setSaveMessage(`🎉 Kỷ lục mới! Bạn vừa đạt ${currentTotalAnimals} con vật với đúng ${targetTotalLegs} chân!`);
    } else {
      setSaveMessage(`Đã lưu phương án: ${currentTotalAnimals} con vật.`);
    }
  };

  // Load optimal into visualizer (Learn Mode)
  const handleLoadOptimal = () => {
    setCounts({
      chicken: 6,
      pig: 6,
      spider: 28,
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. TOP METRIC DASHBOARD */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Total Animals */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng số con
            </span>
            <span className="rounded-lg bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">
              Cần tối thiểu hóa
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {currentTotalAnimals}
            </span>
            <span className="text-xs font-semibold text-slate-500">con vật</span>
          </div>
        </div>

        {/* Total Legs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng số chân
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Mục tiêu: <strong>{targetTotalLegs}</strong>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-3xl font-black ${
                isValid
                  ? "text-emerald-600"
                  : diffLegs > 0
                  ? "text-rose-600"
                  : "text-amber-600"
              }`}
            >
              {currentTotalLegs}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              / {targetTotalLegs} chiếc
            </span>
          </div>
        </div>

        {/* Status Indicator */}
        <div
          className={`rounded-2xl border p-4 shadow-2xs flex flex-col justify-between ${
            isValid
              ? "border-emerald-200 bg-emerald-50/70"
              : diffLegs > 0
              ? "border-rose-200 bg-rose-50/70"
              : "border-amber-200 bg-amber-50/70"
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Trạng thái số chân
          </span>
          <div className="mt-2 flex items-center gap-2 font-bold text-sm">
            {isValid ? (
              <span className="flex items-center gap-1.5 text-emerald-800 font-extrabold">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                ✅ Đúng {targetTotalLegs} chân
              </span>
            ) : diffLegs < 0 ? (
              <span className="flex items-center gap-1.5 text-amber-800 font-extrabold">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                Thiếu {Math.abs(diffLegs)} chân
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-800 font-extrabold">
                <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
                ❌ Vượt quá {diffLegs} chân
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. TROPHY & RECORD BANNER (Challenge Mode) */}
      {mode === "challenge" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-2xs">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-900 block">
                🏆 Kỷ lục ít con nhất của em:
              </span>
              <strong className="text-base text-amber-950 font-black">
                {bestRecord !== null ? `${bestRecord} con vật` : "Chưa có (Hãy tạo phương án đúng 260 chân)"}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSavePlan}
              disabled={!isValid}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-extrabold transition-all shadow-2xs ${
                isValid
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <BookmarkPlus className="h-4 w-4" />
              <span>Lưu phương án</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              title="Đặt lại mức tối thiểu 6 con"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>
        </div>
      )}

      {saveMessage && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-xs font-bold text-indigo-900 animate-fade-in">
          {saveMessage}
        </div>
      )}

      {/* 3. ANIMAL CONTROLS (Steppers) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 className="text-sm font-extrabold text-slate-800">
            Điều chỉnh số lượng từng loài con vật
          </h4>
          <span className="text-xs text-slate-500 font-medium">
            (Ràng buộc: Mỗi loài tối thiểu 6 con)
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {animals.map((animal) => {
            const count = counts[animal.id] || animal.minimum;
            const subtotalLegs = count * animal.legs;
            const isAtMinimum = count <= animal.minimum;

            return (
              <div
                key={animal.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-slate-300 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{animal.icon}</span>
                    <div>
                      <h5 className="text-sm font-black text-slate-800">
                        {animal.label}
                      </h5>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {animal.legs} chân / con
                      </span>
                    </div>
                  </div>
                  <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600 border border-slate-200">
                    Tối thiểu {animal.minimum}
                  </span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleUpdateCount(animal.id, -5)}
                      disabled={count - 5 < animal.minimum}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-xs font-extrabold text-slate-700 shadow-2xs hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                      title="-5 con"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => handleUpdateCount(animal.id, -1)}
                      disabled={isAtMinimum}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-base font-extrabold text-slate-700 shadow-2xs hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                      title="-1 con"
                    >
                      -
                    </button>
                  </div>

                  <div className="text-center min-w-[50px]">
                    <span className="text-2xl font-black text-slate-900 block">
                      {count}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      = {subtotalLegs} chân
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleUpdateCount(animal.id, 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 text-base font-extrabold text-indigo-700 shadow-2xs hover:bg-indigo-100 active:scale-95"
                      title="+1 con"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleUpdateCount(animal.id, 5)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-xs font-extrabold text-indigo-700 shadow-2xs hover:bg-indigo-100 active:scale-95"
                      title="+5 con"
                    >
                      +5
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Breakdown bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Phân bố đóng góp số chân:</span>
            <span>
              🐔 {(counts.chicken || 0) * 2} + 🐷 {(counts.pig || 0) * 4} + 🕷️{" "}
              {(counts.spider || 0) * 8} = {currentTotalLegs} chân
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 flex">
            <div
              style={{
                width: `${Math.min(100, (((counts.chicken || 0) * 2) / targetTotalLegs) * 100)}%`,
              }}
              className="bg-amber-400 transition-all duration-300"
              title={`Gà: ${(counts.chicken || 0) * 2} chân`}
            />
            <div
              style={{
                width: `${Math.min(100, (((counts.pig || 0) * 4) / targetTotalLegs) * 100)}%`,
              }}
              className="bg-rose-400 transition-all duration-300"
              title={`Heo: ${(counts.pig || 0) * 4} chân`}
            />
            <div
              style={{
                width: `${Math.min(100, (((counts.spider || 0) * 8) / targetTotalLegs) * 100)}%`,
              }}
              className="bg-indigo-600 transition-all duration-300"
              title={`Nhện: ${(counts.spider || 0) * 8} chân`}
            />
          </div>
        </div>
      </div>

      {/* 4. SAVED PLANS TABLE (Challenge Mode) */}
      {mode === "challenge" && savedPlans.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Các phương án hợp lệ đã tìm được ({savedPlans.length})
            </h5>
            <span className="text-xs text-slate-500 font-medium">
              Phương án có số con ít nhất sẽ là lời giải tối ưu!
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {savedPlans.map((plan, idx) => {
              const isBest = plan.totalAnimals === bestRecord;
              return (
                <div
                  key={plan.id}
                  className={`flex items-center justify-between rounded-xl border p-2.5 text-xs transition ${
                    isBest
                      ? "border-amber-300 bg-amber-50/70 font-bold"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-slate-500">#{idx + 1}</span>
                    <span className="text-slate-800">
                      🐔 {plan.counts.chicken} Gà • 🐷 {plan.counts.pig} Heo • 🕷️{" "}
                      {plan.counts.spider} Nhện
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 font-semibold">
                      = 260 chân
                    </span>
                    <span
                      className={`rounded-lg px-2.5 py-1 font-black ${
                        isBest
                          ? "bg-amber-500 text-white shadow-2xs"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {plan.totalAnimals} con {isBest && "🏆 Kỷ lục!"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. LEARN MODE: STEP-BY-STEP EXPLANATION */}
      {mode === "learn" && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <h4 className="text-sm font-extrabold text-indigo-950">
                Phương pháp giải toán tối ưu: Cực trị &amp; Giả thiết tạm
              </h4>
            </div>

            <button
              onClick={handleLoadOptimal}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700 active:scale-95 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Nạp cấu hình tối ưu (6, 6, 28)</span>
            </button>
          </div>

          {/* Step buttons */}
          <div className="flex rounded-xl bg-white p-1 border border-indigo-200 text-xs font-bold">
            <button
              onClick={() => setLearnStep(1)}
              className={`flex-1 rounded-lg py-2 transition ${
                learnStep === 1
                  ? "bg-indigo-600 text-white shadow-2xs font-extrabold"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Bước 1: Ưu tiên loài nhiều chân
            </button>
            <button
              onClick={() => setLearnStep(2)}
              className={`flex-1 rounded-lg py-2 transition ${
                learnStep === 2
                  ? "bg-indigo-600 text-white shadow-2xs font-extrabold"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Bước 2: Thiết lập Bất đẳng thức
            </button>
            <button
              onClick={() => setLearnStep(3)}
              className={`flex-1 rounded-lg py-2 transition ${
                learnStep === 3
                  ? "bg-indigo-600 text-white shadow-2xs font-extrabold"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Bước 3: Chỉ ra phương án tối ưu
            </button>
          </div>

          {/* Step Content */}
          <div className="rounded-xl border border-indigo-100 bg-white p-4 text-xs text-slate-700 leading-relaxed space-y-3">
            {learnStep === 1 && (
              <div className="space-y-2">
                <p className="font-bold text-indigo-900 text-sm">
                  Bước 1: Nhận diện nguyên lý cực trị (Loài tạo ra nhiều giá trị nhất)
                </p>
                <p>
                  Muốn tổng số con vật là <strong>ít nhất</strong> trong khi tổng số chân cố định ở{" "}
                  <strong>260 chân</strong>, mỗi con vật cần đóng góp càng nhiều chân càng tốt.
                </p>
                <div className="grid grid-cols-3 gap-2 py-1">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center">
                    <span className="text-base">🐔</span>
                    <p className="font-bold text-slate-800">Gà: 2 chân</p>
                    <p className="text-[10px] text-slate-500">Ít chân nhất</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center">
                    <span className="text-base">🐷</span>
                    <p className="font-bold text-slate-800">Heo: 4 chân</p>
                    <p className="text-[10px] text-slate-500">Trung bình</p>
                  </div>
                  <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-2 text-center">
                    <span className="text-base">🕷️</span>
                    <p className="font-bold text-emerald-800">Nhện: 8 chân</p>
                    <p className="text-[10px] text-emerald-600 font-bold">Nhiều chân nhất ⭐</p>
                  </div>
                </div>
                <p>
                  👉 <strong>Nhận xét:</strong> 1 con Nhện đóng góp bằng 4 con Gà hoặc 2 con Heo.
                  Do đó, ta cần <strong>tối đa hóa số lượng Nhện</strong> và <strong>giảm thiểu số lượng Gà và Heo</strong>.
                </p>
              </div>
            )}

            {learnStep === 2 && (
              <div className="space-y-2">
                <p className="font-bold text-indigo-900 text-sm">
                  Bước 2: Xử lý ràng buộc tối thiểu &amp; Thiết lập Bất đẳng thức
                </p>
                <p>
                  Đề bài bắt buộc mỗi loại có <strong>ít nhất 6 con</strong>:
                  cần có ít nhất <strong>6 Gà</strong> và <strong>6 Heo</strong>.
                </p>
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 space-y-1 font-mono text-[11px]">
                  <p>• Gọi N là tổng số con vật trong trang trại.</p>
                  <p>• Nếu tất cả N con đều là Nhện, tổng số chân tối đa là: <strong>8N</strong>.</p>
                  <p>• 6 con Gà (thay vì Nhện) làm giảm: 6 × (8 - 2) = <strong>36 chân</strong>.</p>
                  <p>• 6 con Heo (thay vì Nhện) làm giảm: 6 × (8 - 4) = <strong>24 chân</strong>.</p>
                  <p>• Tổng mức giảm ít nhất: 36 + 24 = <strong>60 chân</strong>.</p>
                  <p className="text-indigo-700 font-bold">
                    ⇒ 8N - 60 ≥ 260
                  </p>
                  <p className="text-indigo-700 font-bold">
                    ⇒ 8N ≥ 320  ⇒  N ≥ 40
                  </p>
                </div>
                <p>
                  Như vậy, tổng số con vật <strong>không thể nào nhỏ hơn 40 con</strong>.
                </p>
              </div>
            )}

            {learnStep === 3 && (
              <div className="space-y-2">
                <p className="font-bold text-indigo-900 text-sm">
                  Bước 3: Chỉ ra phương án tối ưu đạt đúng 40 con
                </p>
                <p>
                  Để đạt đúng cận dưới N = 40 con, ta giữ Gà và Heo ở mức tối thiểu 6 con, phần còn lại dành hết cho Nhện:
                </p>
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 space-y-1.5">
                  <p className="font-bold text-emerald-900">
                    • Số Gà = 6 con (6 × 2 = 12 chân)
                  </p>
                  <p className="font-bold text-emerald-900">
                    • Số Heo = 6 con (6 × 4 = 24 chân)
                  </p>
                  <p className="font-bold text-emerald-900">
                    • Số chân còn lại cho Nhện = 260 - (12 + 24) = 224 chân
                  </p>
                  <p className="font-bold text-emerald-900">
                    • Số Nhện = 224 : 8 = <strong>28 con</strong> (thỏa mãn ≥ 6 con)
                  </p>
                  <div className="border-t border-emerald-200 pt-1.5 mt-1 text-slate-800">
                    <strong>Kiểm tra:</strong> 6 × 2 + 6 × 4 + 28 × 8 = 12 + 24 + 224 = <strong>260 chân</strong>.
                    <br />
                    <strong>Tổng số con:</strong> 6 + 6 + 28 = <strong>40 con</strong>.
                  </div>
                </div>
                <p className="font-bold text-slate-800">
                  🎉 Kết luận: Tổng số con vật ít nhất có thể là <strong>40 con</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Teaching point */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Quy tắc tư duy cốt lõi (Teaching Point):</strong>
              “Khi cần ít đối tượng nhất nhưng tổng giá trị cố định, hãy ưu tiên đối tượng tạo ra nhiều giá trị nhất, đồng thời vẫn phải thỏa các điều kiện tối thiểu.”
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
