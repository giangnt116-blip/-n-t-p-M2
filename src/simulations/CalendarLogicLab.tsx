import React, { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Sparkles,
  Star,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Info,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

interface CalendarLogicLabProps {
  mode: "challenge" | "learn";
  config?: {
    month?: number;
    days?: number;
    targetWeekday?: string;
    condition?: {
      type: string;
      count: number;
    };
    queryDate?: number;
  };
}

// 0: Monday, 1: Tuesday, ..., 6: Sunday
const WEEKDAY_NAMES = [
  { id: 0, key: "Monday", label: "Thứ Hai", short: "T2" },
  { id: 1, key: "Tuesday", label: "Thứ Ba", short: "T3" },
  { id: 2, key: "Wednesday", label: "Thứ Tư", short: "T4" },
  { id: 3, key: "Thursday", label: "Thứ Năm", short: "T5" },
  { id: 4, key: "Friday", label: "Thứ Sáu", short: "T6" },
  { id: 5, key: "Saturday", label: "Thứ Bảy", short: "T7" },
  { id: 6, key: "Sunday", label: "Chủ Nhật", short: "CN" },
];

export const CalendarLogicLab: React.FC<CalendarLogicLabProps> = ({ mode, config }) => {
  const monthNumber = config?.month ?? 8;
  const totalDays = config?.days ?? 31;
  const targetWeekdayKey = config?.targetWeekday ?? "Sunday";
  const requiredEvenCount = config?.condition?.count ?? 3;
  const queryDate = config?.queryDate ?? 9;

  // Day index for targetWeekday (6 for Sunday)
  const targetWeekdayIndex = useMemo(() => {
    const found = WEEKDAY_NAMES.findIndex(
      (w) => w.key.toLowerCase() === targetWeekdayKey.toLowerCase()
    );
    return found >= 0 ? found : 6;
  }, [targetWeekdayKey]);

  // Selected weekday for the 1st of August (default: 0 = Thứ Hai)
  const [firstDayWeekday, setFirstDayWeekday] = useState<number>(0);

  // Learn mode step: 1, 2, or 3
  const [learnStep, setLearnStep] = useState<1 | 2 | 3>(1);

  // Compute full calendar dates and weekday mapping
  // Weekdays: 0 (Monday) to 6 (Sunday)
  const calendarData = useMemo(() => {
    // For date d (1 to totalDays):
    // weekday = (firstDayWeekday + (d - 1)) % 7
    const daysList = [];
    const targetDates: number[] = [];
    const evenTargetDates: number[] = [];
    const oddTargetDates: number[] = [];

    for (let d = 1; d <= totalDays; d++) {
      const weekday = (firstDayWeekday + (d - 1)) % 7;
      const isTargetWeekday = weekday === targetWeekdayIndex;
      const isEven = d % 2 === 0;

      if (isTargetWeekday) {
        targetDates.push(d);
        if (isEven) {
          evenTargetDates.push(d);
        } else {
          oddTargetDates.push(d);
        }
      }

      daysList.push({
        date: d,
        weekday,
        isTargetWeekday,
        isEven,
        isQueryDate: d === queryDate,
      });
    }

    return {
      daysList,
      targetDates,
      evenTargetDates,
      oddTargetDates,
      evenCount: evenTargetDates.length,
      totalTargetCount: targetDates.length,
      isConditionMet: evenTargetDates.length === requiredEvenCount,
    };
  }, [firstDayWeekday, totalDays, targetWeekdayIndex, requiredEvenCount, queryDate]);

  // Calendar cells including leading empty slots for grid alignment
  const gridCells = useMemo(() => {
    const leadingSlots = firstDayWeekday; // Empty cells before day 1
    return {
      leadingSlots,
      days: calendarData.daysList,
    };
  }, [firstDayWeekday, calendarData.daysList]);

  // Helper to switch 1st day for Learn mode step 3 interactive test
  const handleSetLearnFirstSundayCase = (firstSundayDate: 1 | 2 | 3) => {
    // If Sunday is on date S:
    // Sunday (index 6) = (firstDayWeekday + (S - 1)) % 7
    // => firstDayWeekday = (6 - (S - 1) + 7) % 7
    const computedStart = (6 - (firstSundayDate - 1) + 7) % 7;
    setFirstDayWeekday(computedStart);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50/70 via-white to-amber-50/50 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-xs">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>Phòng thí nghiệm Lịch Tháng {monthNumber}</span>
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                {totalDays} ngày
              </span>
            </h3>
            <p className="text-xs text-slate-600">
              Khảo sát quy luật chu kỳ 7 ngày và tính chẵn/lẻ của ngày trong tháng
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setFirstDayWeekday(0);
            setLearnStep(1);
          }}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 active:scale-95 transition"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
          <span>Đặt lại</span>
        </button>
      </div>

      {/* SELECTOR FOR DAY 1 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <span>📅 Ngày 1 tháng {monthNumber} là:</span>
          </label>
          <span className="text-xs font-medium text-slate-500">
            (Bấm vào thứ để xoay lịch tháng {monthNumber})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {WEEKDAY_NAMES.map((w) => {
            const isSelected = firstDayWeekday === w.id;
            const isSunday = w.id === 6;
            return (
              <button
                key={w.id}
                onClick={() => setFirstDayWeekday(w.id)}
                className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-bold transition-all ${
                  isSelected
                    ? isSunday
                      ? "bg-rose-600 text-white shadow-sm ring-2 ring-rose-300 scale-[1.02]"
                      : "bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300 scale-[1.02]"
                    : "border border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-80">{w.short}</span>
                <span className="text-xs sm:text-sm font-black">{w.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN INTERACTIVE CALENDAR GRID */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        {/* Month Header Banner */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-black tracking-tight text-slate-900">
              THÁNG {monthNumber}
            </h4>
            <span className="text-xs font-semibold text-slate-500">
              (Bắt đầu từ: {WEEKDAY_NAMES[firstDayWeekday].label})
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 font-bold text-rose-700 border border-rose-200">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Chủ Nhật
            </span>
            <span className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 font-bold text-amber-700 border border-amber-200">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
              Chủ Nhật ngày Chẵn
            </span>
          </div>
        </div>

        {/* 7 Columns: T2, T3, T4, T5, T6, T7, CN */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
          {WEEKDAY_NAMES.map((w) => (
            <div
              key={w.id}
              className={`rounded-xl py-2 text-xs font-black uppercase tracking-wider ${
                w.id === 6
                  ? "bg-rose-100 text-rose-800"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              <span>{w.short}</span>
              <span className="hidden sm:inline"> - {w.label}</span>
            </div>
          ))}

          {/* Empty cells before day 1 */}
          {Array.from({ length: gridCells.leadingSlots }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="h-14 sm:h-16 rounded-xl border border-dashed border-slate-100 bg-slate-50/40"
            />
          ))}

          {/* Actual days 1 to totalDays */}
          {gridCells.days.map((d) => {
            const isSunday = d.isTargetWeekday;
            const isEvenSunday = isSunday && d.isEven;
            const isOddSunday = isSunday && !d.isEven;

            return (
              <div
                key={d.date}
                className={`relative flex h-14 sm:h-16 flex-col items-center justify-between rounded-xl p-1.5 sm:p-2 border transition-all ${
                  isEvenSunday
                    ? "border-amber-400 bg-amber-50/90 text-amber-950 font-black shadow-xs ring-2 ring-amber-300"
                    : isOddSunday
                    ? "border-rose-300 bg-rose-50/80 text-rose-900 font-bold"
                    : d.isQueryDate
                    ? "border-indigo-400 bg-indigo-50/70 text-indigo-950 font-bold ring-1 ring-indigo-300"
                    : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50/80"
                }`}
              >
                {/* Top indicator: Even Star or Day note */}
                <div className="flex w-full items-center justify-between text-[10px]">
                  {isEvenSunday ? (
                    <span className="flex items-center gap-0.5 rounded bg-amber-200/90 px-1 py-0.2 text-[9px] font-black text-amber-900">
                      <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-600" />
                      <span>Chẵn</span>
                    </span>
                  ) : isOddSunday ? (
                    <span className="rounded bg-rose-200/80 px-1 py-0.2 text-[9px] font-bold text-rose-800">
                      Lẻ
                    </span>
                  ) : d.isQueryDate ? (
                    <span className="rounded bg-indigo-200 px-1 py-0.2 text-[9px] font-black text-indigo-900">
                      Ngày 9
                    </span>
                  ) : (
                    <span />
                  )}

                  <span className="text-[10px] text-slate-400 font-mono">
                    {d.isEven ? "chẵn" : "lẻ"}
                  </span>
                </div>

                {/* Day number */}
                <div className="flex items-center justify-center">
                  <span
                    className={`text-base sm:text-lg ${
                      isEvenSunday
                        ? "text-amber-900 font-black"
                        : isSunday
                        ? "text-rose-700 font-black"
                        : d.isQueryDate
                        ? "text-indigo-700 font-black"
                        : "text-slate-800 font-semibold"
                    }`}
                  >
                    {d.date}
                  </span>
                </div>

                {/* Bottom label */}
                <div className="text-[10px] text-slate-400">
                  {isSunday ? (
                    <span className="font-bold text-rose-600 text-[10px]">CN</span>
                  ) : (
                    <span className="opacity-0">.</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* STATS & COUNTER BAR */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Total Sundays count */}
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-2xs">
              <span className="text-slate-500">Tổng số ngày Chủ Nhật: </span>
              <strong className="text-slate-900 font-black">
                {calendarData.totalTargetCount}
              </strong>
              <span className="text-slate-400 text-[11px] ml-1">
                ({calendarData.targetDates.join(", ")})
              </span>
            </div>

            {/* Even Sundays counter */}
            <div
              className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-black shadow-2xs transition-all ${
                calendarData.isConditionMet
                  ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                  : "border-amber-300 bg-amber-50 text-amber-900"
              }`}
            >
              <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
              <span>Số Chủ Nhật rơi vào ngày chẵn: </span>
              <span className="text-sm font-black text-amber-700">
                {calendarData.evenCount}
              </span>
              <span className="text-[11px] font-normal text-slate-500">
                {calendarData.evenTargetDates.length > 0
                  ? `(ngày ${calendarData.evenTargetDates.join(", ")})`
                  : "(không có)"}
              </span>
            </div>
          </div>

          <div className="text-xs">
            <span className="text-slate-500">Yêu cầu đề bài: </span>
            <strong className="text-rose-600 font-bold">đúng {requiredEvenCount} ngày chẵn</strong>
          </div>
        </div>
      </div>

      {/* CHALLENGE MODE CONDITION CHECK */}
      {mode === "challenge" && (
        <div className="space-y-4">
          {calendarData.isConditionMet ? (
            <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-5 shadow-xs animate-fadeIn space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-base">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>✅ Lịch này thỏa điều kiện!</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                Tháng 8 này có đúng <strong>{requiredEvenCount} ngày Chủ Nhật</strong> rơi vào ngày chẵn:{" "}
                <span className="font-bold underline">
                  ngày {calendarData.evenTargetDates.join(", ")}
                </span>.
              </p>
              <div className="mt-3 rounded-xl border border-emerald-200 bg-white p-3.5 text-xs text-slate-700 font-medium">
                <span className="font-black text-indigo-700 block mb-1">
                  ❓ Câu hỏi cần giải quyết:
                </span>
                Quan sát lịch trên, em hãy cho biết:{" "}
                <strong className="text-slate-900 text-sm">“Ngày 9 tháng 8 là thứ mấy?”</strong>
                <span className="block text-[11px] text-slate-500 mt-1">
                  (Hãy chọn thứ tương ứng ở ô trả lời bên phải/dưới để ghi điểm).
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-800 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-amber-900">
                  Lịch hiện tại có {calendarData.evenCount} ngày Chủ Nhật chẵn (chưa thỏa điều kiện đúng {requiredEvenCount} ngày).
                </span>
                Hãy thử chọn thứ khác cho <strong>“Ngày 1 tháng 8”</strong> ở phía trên để tìm lịch phù hợp!
              </div>
            </div>
          )}
        </div>
      )}

      {/* LEARN MODE (3 STEPS) */}
      {mode === "learn" && (
        <div className="space-y-4 rounded-3xl border border-indigo-200 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <h4 className="text-sm font-black text-slate-900">
                Lộ trình phân tích logic lịch tháng 8 (3 bước)
              </h4>
            </div>

            {/* Step selector pills */}
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((step) => (
                <button
                  key={step}
                  onClick={() => setLearnStep(step as 1 | 2 | 3)}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                    learnStep === step
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 1 */}
          {learnStep === 1 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-800">
                <span>Bước 1: Chu kỳ của các ngày Chủ Nhật</span>
              </div>
              <h5 className="text-base font-extrabold text-slate-900">
                Các Chủ Nhật cách nhau đúng 7 ngày
              </h5>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Một tuần lễ có đúng 7 ngày. Vì vậy, các ngày cùng thứ luôn cách nhau một khoảng là bội số của 7:
              </p>
              <div className="rounded-xl border border-indigo-100 bg-white p-4 font-mono text-xs sm:text-sm text-indigo-950 font-bold space-y-1">
                <div>Nếu Chủ Nhật đầu tiên là ngày S:</div>
                <div className="text-rose-600 text-base">
                  S, &nbsp;S + 7, &nbsp;S + 14, &nbsp;S + 21, &nbsp;S + 28
                </div>
                <div className="text-slate-500 font-normal text-xs">
                  (miễn là không vượt quá 31 ngày của tháng 8).
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Vì 7 là <strong>số lẻ</strong>, nên khi lấy một số cộng thêm 7:
                <br />
                • Chẵn + 7 = <strong>Lẻ</strong>
                <br />
                • Lẻ + 7 = <strong>Chẵn</strong>
                <br />
                Do đó: <strong>Các ngày Chủ Nhật sẽ luôn xen kẽ: Chẵn ⇄ Lẻ ⇄ Chẵn ⇄ Lẻ...</strong>
              </p>
            </div>
          )}

          {/* STEP 2 */}
          {learnStep === 2 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                <span>Bước 2: Vì sao tháng bắt buộc phải có 5 Chủ Nhật?</span>
              </div>
              <h5 className="text-base font-extrabold text-slate-900">
                Muốn có 3 Chủ Nhật ngày chẵn, tháng phải có 5 Chủ Nhật
              </h5>
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs sm:text-sm text-amber-950 space-y-2">
                <p>
                  • Nếu tháng chỉ có <strong>4 Chủ Nhật</strong>:
                  <br />
                  Do tính chất chẵn/lẻ xen kẽ, dù bắt đầu là Chẵn hay Lẻ, dãy 4 ngày chỉ có thể là:
                  <br />
                  <span className="font-mono font-bold text-rose-700">
                    [Chẵn, Lẻ, Chẵn, Lẻ]
                  </span>{" "}
                  hoặc{" "}
                  <span className="font-mono font-bold text-slate-700">
                    [Lẻ, Chẵn, Lẻ, Chẵn]
                  </span>
                  <br />
                  ⇒ Cả hai trường hợp đều <strong>chỉ có đúng 2 ngày chẵn</strong> (không thể có 3 ngày chẵn).
                </p>
                <p>
                  • Do đó, tháng 8 này <strong>bắt buộc phải có đúng 5 ngày Chủ Nhật</strong> và ngày Chủ Nhật đầu tiên phải là <strong>ngày chẵn</strong>:
                  <br />
                  <span className="font-mono font-black text-emerald-800">
                    [Chẵn (1), Lẻ, Chẵn (2), Lẻ, Chẵn (3)]
                  </span>
                </p>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Trong tháng 8 có 31 ngày:
                <br />
                Nếu ngày Chủ Nhật đầu tiên từ ngày 4 trở đi, thì ngày Chủ Nhật thứ 5 sẽ là: 4 + 28 = 32 &gt; 31 (vượt quá số ngày trong tháng).
                <br />
                ⇒ Do đó, Chủ Nhật đầu tiên chỉ có thể là:{" "}
                <strong className="text-indigo-700">ngày 1, ngày 2 hoặc ngày 3</strong>.
              </p>
            </div>
          )}

          {/* STEP 3 */}
          {learnStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                <span>Bước 3: Thử 3 trường hợp khả dĩ</span>
              </div>
              <h5 className="text-base font-extrabold text-slate-900">
                Kiểm chứng trực tiếp từng trường hợp
              </h5>

              <div className="grid gap-3 sm:grid-cols-3 text-xs">
                {/* Case 1: First Sunday = 1 */}
                <div
                  onClick={() => handleSetLearnFirstSundayCase(1)}
                  className="cursor-pointer rounded-2xl border-2 border-slate-200 bg-white p-3.5 hover:border-slate-400 transition"
                >
                  <div className="font-bold text-slate-700 mb-1">
                    Trường hợp 1: CN là ngày 1
                  </div>
                  <div className="font-mono text-slate-600 mb-1">
                    1, <strong>8</strong>, 15, <strong>22</strong>, 29
                  </div>
                  <div className="text-rose-600 font-bold text-[11px]">
                    Ngày chẵn: 8, 22 → Chỉ có 2 ngày chẵn (Loại ❌)
                  </div>
                  <button className="mt-2 text-[10px] text-indigo-600 font-bold underline">
                    Xem lịch này →
                  </button>
                </div>

                {/* Case 2: First Sunday = 2 */}
                <div
                  onClick={() => handleSetLearnFirstSundayCase(2)}
                  className="cursor-pointer rounded-2xl border-2 border-emerald-400 bg-emerald-50/70 p-3.5 ring-2 ring-emerald-200 hover:border-emerald-500 transition"
                >
                  <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1">
                    <span>Trường hợp 2: CN là ngày 2</span>
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                  </div>
                  <div className="font-mono text-slate-800 font-black mb-1">
                    <strong>2</strong>, 9, <strong>16</strong>, 23, <strong>30</strong>
                  </div>
                  <div className="text-emerald-700 font-black text-[11px]">
                    Ngày chẵn: 2, 16, 30 → Đúng 3 ngày chẵn! (Chọn ✅)
                  </div>
                  <button className="mt-2 text-[10px] text-emerald-800 font-bold underline">
                    Đang xem lịch chuẩn này →
                  </button>
                </div>

                {/* Case 3: First Sunday = 3 */}
                <div
                  onClick={() => handleSetLearnFirstSundayCase(3)}
                  className="cursor-pointer rounded-2xl border-2 border-slate-200 bg-white p-3.5 hover:border-slate-400 transition"
                >
                  <div className="font-bold text-slate-700 mb-1">
                    Trường hợp 3: CN là ngày 3
                  </div>
                  <div className="font-mono text-slate-600 mb-1">
                    3, <strong>10</strong>, 17, <strong>24</strong>, 31
                  </div>
                  <div className="text-rose-600 font-bold text-[11px]">
                    Ngày chẵn: 10, 24 → Chỉ có 2 ngày chẵn (Loại ❌)
                  </div>
                  <button className="mt-2 text-[10px] text-indigo-600 font-bold underline">
                    Xem lịch này →
                  </button>
                </div>
              </div>

              {/* Conclusion */}
              <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/70 p-4 text-xs sm:text-sm text-indigo-950 space-y-1.5">
                <strong className="block text-indigo-900 font-black text-sm">
                  🎯 Kết luận cuối cùng:
                </strong>
                <p>
                  • Ngày Chủ Nhật đầu tiên của tháng 8 bắt buộc là <strong>ngày 2</strong>.
                  <br />
                  • Ngày Chủ Nhật thứ hai sẽ cách ngày 2 đúng 7 ngày:{" "}
                  <span className="font-mono font-black text-rose-600">2 + 7 = 9</span>.
                  <br />
                  • Vậy <strong>ngày 9 tháng 8 chính là Chủ Nhật</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Learn Mode Navigation */}
          <div className="flex items-center justify-between pt-2 border-t border-indigo-100">
            <button
              disabled={learnStep === 1}
              onClick={() => setLearnStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3)}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Bước trước</span>
            </button>

            <span className="text-xs text-slate-500 font-bold">
              Bước {learnStep} / 3
            </span>

            <button
              disabled={learnStep === 3}
              onClick={() => setLearnStep((prev) => Math.min(3, prev + 1) as 1 | 2 | 3)}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>Bước tiếp theo</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* TEACHING POINT */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-black text-sm">
              💡
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                Điểm cốt lõi sư phạm (Teaching Point)
              </span>
              <p className="text-xs sm:text-sm font-black text-amber-950 mt-0.5">
                “Các ngày cùng thứ cách nhau đúng 7 ngày, nên chẵn/lẻ sẽ thay đổi luân phiên.”
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
