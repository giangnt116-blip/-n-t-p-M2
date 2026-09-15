import React, { useState, useMemo } from "react";
import {
  Filter,
  CheckCircle2,
  Cat,
  Dog,
  Sparkles,
  Info,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { digitSum, applyFilters } from "../utils/numberFilterUtils";

interface NumberFilterLabProps {
  mode: "challenge" | "learn";
  config?: any;
}

export const NumberFilterLab: React.FC<NumberFilterLabProps> = ({
  mode,
  config,
}) => {
  const start = (config?.start as number) || 1;
  const end = (config?.end as number) || 300;

  // Filter toggles
  const [filterDiv5, setFilterDiv5] = useState<boolean>(false);
  const [filterDigitSumDiv5, setFilterDigitSumDiv5] = useState<boolean>(false);

  // Pagination for 300 numbers
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 30;

  // Selected apartment to inspect in detail
  const [inspectedNum, setInspectedNum] = useState<number | null>(null);

  // Compute filtered numbers using utility
  const filteredNumbers = useMemo(() => {
    return applyFilters(start, end, {
      divisibleBy5: filterDiv5,
      digitSumDivisibleBy5: filterDigitSumDiv5,
    });
  }, [start, end, filterDiv5, filterDigitSumDiv5]);

  // Total pages
  const totalPages = Math.max(1, Math.ceil(filteredNumbers.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const pageNumbers = filteredNumbers.slice(
    (validPage - 1) * pageSize,
    validPage * pageSize
  );

  const handleReset = () => {
    setFilterDiv5(false);
    setFilterDigitSumDiv5(false);
    setCurrentPage(1);
    setInspectedNum(null);
  };

  return (
    <div className="space-y-6 rounded-2xl border border-indigo-100 bg-white p-5 shadow-xs sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Filter className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Phòng Thí Nghiệm Bộ Lọc Số Chung Cư (1–300)
            </h3>
            <p className="text-xs text-slate-500">
              Sàng lọc các căn hộ thỏa mãn đồng thời điều kiện của Mèo và Chó
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

      {/* Filter Switches Section */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Filter 1: Divisible by 5 (Cat) */}
        <label
          className={`flex items-center justify-between rounded-2xl border-2 p-4 cursor-pointer transition-all ${
            filterDiv5
              ? "border-indigo-500 bg-indigo-50/70 shadow-xs"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                filterDiv5 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              <Cat className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-indigo-700 block">
                Điều kiện 1 (Mèo sống)
              </span>
              <span className="text-sm font-bold text-slate-900">
                Số căn hộ chia hết cho 5
              </span>
            </div>
          </div>

          <input
            type="checkbox"
            checked={filterDiv5}
            onChange={(e) => {
              setFilterDiv5(e.target.checked);
              setCurrentPage(1);
            }}
            className="h-5 w-5 rounded-md text-indigo-600 focus:ring-indigo-500"
          />
        </label>

        {/* Filter 2: Digit Sum divisible by 5 (Dog) */}
        <label
          className={`flex items-center justify-between rounded-2xl border-2 p-4 cursor-pointer transition-all ${
            filterDigitSumDiv5
              ? "border-amber-500 bg-amber-50/70 shadow-xs"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                filterDigitSumDiv5 ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              <Dog className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 block">
                Điều kiện 2 (Chó sống)
              </span>
              <span className="text-sm font-bold text-slate-900">
                Tổng chữ số chia hết cho 5
              </span>
            </div>
          </div>

          <input
            type="checkbox"
            checked={filterDigitSumDiv5}
            onChange={(e) => {
              setFilterDigitSumDiv5(e.target.checked);
              setCurrentPage(1);
            }}
            className="h-5 w-5 rounded-md text-amber-600 focus:ring-amber-500"
          />
        </label>
      </div>

      {/* Result Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-900 p-4 text-white">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-300 font-medium">
            Số căn hộ còn lại thỏa mãn:
          </span>
          <span className="font-mono text-2xl font-black text-amber-300">
            {filteredNumbers.length}
          </span>
          <span className="text-xs text-slate-400">/ 300 căn</span>
        </div>

        {/* Status description */}
        <div className="text-xs font-semibold text-slate-300">
          {!filterDiv5 && !filterDigitSumDiv5 && "Chưa bật bộ lọc nào (Tất cả 300 căn)"}
          {filterDiv5 && !filterDigitSumDiv5 && "Đang lọc: Chỉ căn hộ có Mèo (chia hết cho 5)"}
          {!filterDiv5 && filterDigitSumDiv5 && "Đang lọc: Chỉ căn hộ có Chó (tổng chữ số chia hết cho 5)"}
          {filterDiv5 && filterDigitSumDiv5 && "✅ Đang lọc: Cả Chó và Mèo cùng sống"}
        </div>
      </div>

      {/* Compact Grid of Filtered Numbers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Click vào bất kỳ căn hộ nào để xem phân tích chi tiết:</span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                disabled={validPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded-md border p-1 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="font-bold text-slate-700 px-1">
                Trang {validPage} / {totalPages}
              </span>
              <button
                disabled={validPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-md border p-1 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Compact List */}
        <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-1">
          {pageNumbers.map((num) => {
            const sum = digitSum(num);
            const isDiv5 = num % 5 === 0;
            const isSumDiv5 = sum % 5 === 0;
            const isBoth = isDiv5 && isSumDiv5;
            const isSelected = inspectedNum === num;

            let badgeStyle = "bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200";
            if (isBoth) {
              badgeStyle = "bg-emerald-100 text-emerald-900 border-emerald-300 font-black ring-1 ring-emerald-300";
            } else if (isDiv5) {
              badgeStyle = "bg-indigo-50 text-indigo-800 border-indigo-200 font-bold";
            } else if (isSumDiv5) {
              badgeStyle = "bg-amber-50 text-amber-800 border-amber-200 font-bold";
            }

            if (isSelected) {
              badgeStyle += " ring-2 ring-indigo-600 scale-105";
            }

            return (
              <button
                key={num}
                onClick={() => setInspectedNum(num)}
                className={`flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs transition-all active:scale-95 ${badgeStyle}`}
                title={`Căn ${num}: Tổng chữ số = ${sum}`}
              >
                <span className="font-mono">{num}</span>
                {isBoth && <span className="text-[10px]">🐱🐶</span>}
              </button>
            );
          })}
        </div>

        {/* Detailed Inspector Card */}
        {inspectedNum !== null && (
          <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50/60 p-4 space-y-1.5 text-xs text-slate-700 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-indigo-900">
                Chi tiết Căn hộ số {inspectedNum}:
              </span>
              <button
                onClick={() => setInspectedNum(null)}
                className="text-[11px] font-bold text-slate-400 hover:text-slate-600"
              >
                Đóng
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-2 pt-1">
              <div className="rounded-lg bg-white p-2 border border-indigo-100">
                <span className="font-semibold text-slate-600">Chia hết cho 5: </span>
                {inspectedNum % 5 === 0 ? (
                  <strong className="text-emerald-600">
                    Có ({inspectedNum} = 5 × {inspectedNum / 5}) → Mèo sống 🐱
                  </strong>
                ) : (
                  <strong className="text-rose-600">
                    Không (dư {inspectedNum % 5})
                  </strong>
                )}
              </div>
              <div className="rounded-lg bg-white p-2 border border-indigo-100">
                <span className="font-semibold text-slate-600">Tổng chữ số: </span>
                <strong className="font-mono text-slate-800">
                  {inspectedNum
                    .toString()
                    .split("")
                    .join(" + ")}{" "}
                  = {digitSum(inspectedNum)}
                </strong>
                {digitSum(inspectedNum) % 5 === 0 ? (
                  <span className="text-emerald-600 font-bold ml-1">
                    (chia hết cho 5) → Chó sống 🐶
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold ml-1">
                    (không chia hết cho 5)
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LEARN MODE SECTION */}
      {mode === "learn" && (
        <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-b from-indigo-50/50 to-white p-4 space-y-3">
          <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-xs">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>Phương pháp Lọc Từng Bước (Toán Số học)</span>
          </div>

          <div className="text-xs text-slate-700 space-y-2 bg-white p-3.5 rounded-xl border border-indigo-100">
            <strong className="text-indigo-900 block text-sm">
              Bước 1: Rút gọn qua dấu hiệu chia hết cho 5
            </strong>
            <p>
              Số chia hết cho 5 bắt buộc phải có chữ số tận cùng là <strong>0</strong> hoặc <strong>5</strong>.
              Từ 1 đến 300 có đúng <span className="font-mono font-bold">300 : 5 = 60 căn hộ</span> chia hết cho 5.
            </p>

            <strong className="text-indigo-900 block text-sm pt-2">
              Bước 2: Lọc tiếp điều kiện tổng chữ số chia hết cho 5
            </strong>
            <p>
              Trong 60 căn hộ có tận cùng là 0 hoặc 5, ta chia theo các nhóm số:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>
                <strong>Số có 1 chữ số:</strong> duy nhất số <strong>5</strong> (tổng = 5).
              </li>
              <li>
                <strong>Số có 2 chữ số:</strong> dạng a0 hoặc a5.
                Chỉ có <strong>50</strong> (tổng 5) và <strong>55</strong> (tổng 10).
              </li>
              <li>
                <strong>Số có 3 chữ số từ 100 đến 300:</strong>
                <br />
                - Đầu 1: <strong>140, 145, 190, 195</strong> (4 căn)
                <br />
                - Đầu 2: <strong>230, 235, 280, 285</strong> (4 căn)
                <br />
                - Đầu 3: 300 (tổng là 3, không chia hết cho 5).
              </li>
            </ul>

            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-950 font-bold mt-2">
              <p>
                🎯 Danh sách đầy đủ 11 căn hộ có cả Chó và Mèo cùng sống:
              </p>
              <p className="font-mono text-xs text-emerald-800 mt-1">
                {"{ 5, 50, 55, 140, 145, 190, 195, 230, 235, 280, 285 }"}
              </p>
              <p className="text-xs text-emerald-900 font-extrabold mt-1">
                → Tổng cộng có đúng 11 căn hộ!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
