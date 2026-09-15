import React, { useState } from "react";
import { Box, CheckCircle2, AlertCircle, Info, Sparkles, Trophy, RotateCcw } from "lucide-react";
import { QuestionMode } from "../types/question";

export type FaceKey = "top" | "bottom" | "front" | "back" | "left" | "right";

interface FaceInfo {
  key: FaceKey;
  vietnamese: string;
  opposite: FaceKey;
  pairId: "pair1" | "pair2" | "pair3";
  pairColor: string;
}

const FACES: Record<FaceKey, FaceInfo> = {
  top: {
    key: "top",
    vietnamese: "Mặt Trên",
    opposite: "bottom",
    pairId: "pair1",
    pairColor: "border-blue-400 bg-blue-50/50 text-blue-900",
  },
  bottom: {
    key: "bottom",
    vietnamese: "Mặt Dưới",
    opposite: "top",
    pairId: "pair1",
    pairColor: "border-blue-400 bg-blue-50/50 text-blue-900",
  },
  front: {
    key: "front",
    vietnamese: "Mặt Trước",
    opposite: "back",
    pairId: "pair2",
    pairColor: "border-amber-400 bg-amber-50/50 text-amber-900",
  },
  back: {
    key: "back",
    vietnamese: "Mặt Sau",
    opposite: "front",
    pairId: "pair2",
    pairColor: "border-amber-400 bg-amber-50/50 text-amber-900",
  },
  left: {
    key: "left",
    vietnamese: "Mặt Trái",
    opposite: "right",
    pairId: "pair3",
    pairColor: "border-emerald-400 bg-emerald-50/50 text-emerald-900",
  },
  right: {
    key: "right",
    vietnamese: "Mặt Phải",
    opposite: "left",
    pairId: "pair3",
    pairColor: "border-emerald-400 bg-emerald-50/50 text-emerald-900",
  },
};

// 12 adjacent pairs of faces on a cube (the 12 edges)
const ADJACENT_PAIRS: [FaceKey, FaceKey][] = [
  ["top", "front"],
  ["top", "back"],
  ["top", "left"],
  ["top", "right"],
  ["bottom", "front"],
  ["bottom", "back"],
  ["bottom", "left"],
  ["bottom", "right"],
  ["front", "left"],
  ["front", "right"],
  ["back", "left"],
  ["back", "right"],
];

interface CubeConstraintLabProps {
  config?: Record<string, unknown>;
  mode: QuestionMode;
}

export const CubeConstraintLab: React.FC<CubeConstraintLabProps> = ({ config, mode }) => {
  const minValue = typeof config?.minValue === "number" ? config.minValue : 1;
  const adjacentDiffAtLeast =
    typeof config?.adjacentDifferenceAtLeast === "number"
      ? config.adjacentDifferenceAtLeast
      : 2;

  // Face values state
  // Initial starter numbers (arbitrary, not revealing answer 27)
  const [faceValues, setFaceValues] = useState<Record<FaceKey, number>>(() => {
    if (mode === "learn") {
      // In Learn Mode, default to optimal demo
      return {
        top: 1,
        bottom: 2,
        front: 4,
        back: 5,
        left: 7,
        right: 8,
      };
    }
    return {
      top: 1,
      bottom: 6,
      front: 2,
      back: 5,
      left: 3,
      right: 4,
    };
  });

  const [bestSum, setBestSum] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"net" | "graph">("net");

  const handleValueChange = (face: FaceKey, val: number) => {
    const clamped = Math.max(minValue, Math.floor(val));
    setFaceValues((prev) => ({ ...prev, [face]: clamped }));
  };

  const handleIncrement = (face: FaceKey, delta: number) => {
    setFaceValues((prev) => ({
      ...prev,
      [face]: Math.max(minValue, (prev[face] || minValue) + delta),
    }));
  };

  const handleReset = () => {
    setFaceValues({
      top: 1,
      bottom: 6,
      front: 2,
      back: 5,
      left: 3,
      right: 4,
    });
  };

  const handleLoadOptimal = () => {
    setFaceValues({
      top: 1,
      bottom: 2,
      front: 4,
      back: 5,
      left: 7,
      right: 8,
    });
  };

  // 1. Validation: check uniqueness
  const valuesList: number[] = Object.values(faceValues);
  const uniqueValues = new Set(valuesList);
  const hasDuplicates = uniqueValues.size < 6;

  // Find duplicates
  const duplicateFaces = new Set<FaceKey>();
  (Object.keys(FACES) as FaceKey[]).forEach((f1) => {
    (Object.keys(FACES) as FaceKey[]).forEach((f2) => {
      if (f1 !== f2 && faceValues[f1] === faceValues[f2]) {
        duplicateFaces.add(f1);
        duplicateFaces.add(f2);
      }
    });
  });

  // 2. Validation: check adjacent pairs
  const violations: { f1: FaceKey; f2: FaceKey; diff: number }[] = [];
  const violatingFaces = new Set<FaceKey>();

  ADJACENT_PAIRS.forEach(([f1, f2]) => {
    const v1 = faceValues[f1];
    const v2 = faceValues[f2];
    const diff = Math.abs(v1 - v2);
    if (diff < adjacentDiffAtLeast) {
      violations.push({ f1, f2, diff });
      violatingFaces.add(f1);
      violatingFaces.add(f2);
    }
  });

  const isValid = !hasDuplicates && violations.length === 0;
  const currentSum = valuesList.reduce((acc, v) => acc + v, 0);

  const handleSaveBest = () => {
    if (isValid) {
      setBestSum((prev) => (prev === null ? currentSum : Math.min(prev, currentSum)));
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-indigo-100 bg-white p-5 shadow-xs sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Box className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Phòng thí nghiệm Ràng buộc Khối lập phương
            </h4>
            <p className="text-xs text-slate-500">
              6 số phân biệt • Hai mặt kề nhau phải chênh lệch ≥ {adjacentDiffAtLeast}
            </p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center rounded-lg bg-slate-100 p-0.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab("net")}
            className={`rounded-md px-3 py-1 transition ${
              activeTab === "net"
                ? "bg-white text-indigo-700 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Mô hình Lập phương mở phẳng (Net)
          </button>
          <button
            onClick={() => setActiveTab("graph")}
            className={`rounded-md px-3 py-1 transition ${
              activeTab === "graph"
                ? "bg-white text-indigo-700 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sơ đồ quan hệ Đối diện
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Current Sum */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Tổng 6 mặt hiện tại
          </span>
          <span className="text-2xl font-black text-indigo-900">{currentSum}</span>
        </div>

        {/* Status */}
        <div
          className={`rounded-xl border p-3 text-center transition-all ${
            isValid
              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
            Trạng thái ràng buộc
          </span>
          <span className="text-sm font-extrabold flex items-center justify-center gap-1 mt-1">
            {isValid ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>✅ Hợp lệ</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-rose-600" />
                <span>❌ Vi phạm ({violations.length + (hasDuplicates ? 1 : 0)})</span>
              </>
            )}
          </span>
        </div>

        {/* Best sum recorded */}
        <div className="col-span-2 sm:col-span-1 rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
            Kỷ lục tổng nhỏ nhất của em
          </span>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <Trophy className="h-4 w-4 text-amber-600" />
            <span className="text-xl font-black text-amber-950">
              {bestSum !== null ? bestSum : "Chưa có"}
            </span>
          </div>
        </div>
      </div>

      {/* VIEW 1: Cube Net (2D Unfolded Cross Layout) */}
      {activeTab === "net" && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 text-center">
            Bấm nút <strong>+ / -</strong> hoặc nhập số trực tiếp vào từng mặt để thử nghiệm.
            <br />
            <span className="text-slate-400">
              (Các mặt cùng màu viền là hai mặt ĐỐI DIỆN NHAU - không có cạnh chung)
            </span>
          </div>

          {/* Cross Net Grid: 4 columns x 3 rows */}
          <div className="mx-auto max-w-md rounded-2xl border-2 border-slate-200 bg-slate-100/70 p-4">
            <div className="grid grid-cols-4 gap-2">
              {/* Row 1: Top face at col 2 */}
              <div />
              {renderFaceCard("top")}
              <div />
              <div />

              {/* Row 2: Left, Front, Right, Back */}
              {renderFaceCard("left")}
              {renderFaceCard("front")}
              {renderFaceCard("right")}
              {renderFaceCard("back")}

              {/* Row 3: Bottom face at col 2 */}
              <div />
              {renderFaceCard("bottom")}
              <div />
              <div />
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Opposite Face Pairs Graph */}
      {activeTab === "graph" && (
        <div className="space-y-3 rounded-2xl border border-indigo-100 bg-slate-50 p-4">
          <div className="text-xs font-bold text-slate-700">
            Khối lập phương có đúng 3 cặp mặt ĐỐI DIỆN (không chạm nhau):
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {/* Pair 1: Top - Bottom */}
            <div className="rounded-xl border-2 border-blue-300 bg-white p-3 space-y-2">
              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-black uppercase text-blue-800">
                Cặp 1: Trên ↔ Dưới
              </span>
              <div className="flex items-center justify-around pt-1">
                {renderCompactFace("top")}
                <span className="font-bold text-slate-400">↔</span>
                {renderCompactFace("bottom")}
              </div>
              <div className="text-[11px] text-slate-500 text-center border-t pt-1">
                Hiệu: |{faceValues.top} - {faceValues.bottom}| ={" "}
                <strong>{Math.abs(faceValues.top - faceValues.bottom)}</strong>
              </div>
            </div>

            {/* Pair 2: Front - Back */}
            <div className="rounded-xl border-2 border-amber-300 bg-white p-3 space-y-2">
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase text-amber-800">
                Cặp 2: Trước ↔ Sau
              </span>
              <div className="flex items-center justify-around pt-1">
                {renderCompactFace("front")}
                <span className="font-bold text-slate-400">↔</span>
                {renderCompactFace("back")}
              </div>
              <div className="text-[11px] text-slate-500 text-center border-t pt-1">
                Hiệu: |{faceValues.front} - {faceValues.back}| ={" "}
                <strong>{Math.abs(faceValues.front - faceValues.back)}</strong>
              </div>
            </div>

            {/* Pair 3: Left - Right */}
            <div className="rounded-xl border-2 border-emerald-300 bg-white p-3 space-y-2">
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800">
                Cặp 3: Trái ↔ Phải
              </span>
              <div className="flex items-center justify-around pt-1">
                {renderCompactFace("left")}
                <span className="font-bold text-slate-400">↔</span>
                {renderCompactFace("right")}
              </div>
              <div className="text-[11px] text-slate-500 text-center border-t pt-1">
                Hiệu: |{faceValues.left} - {faceValues.right}| ={" "}
                <strong>{Math.abs(faceValues.left - faceValues.right)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Violations Feedback */}
      {!isValid && (
        <div className="space-y-1.5 rounded-xl border border-rose-200 bg-rose-50/60 p-4 text-xs text-rose-900">
          <div className="font-bold flex items-center gap-1.5 text-rose-950">
            <AlertCircle className="h-4 w-4 text-rose-600" />
            <span>Phát hiện vi phạm quy tắc:</span>
          </div>
          {hasDuplicates && (
            <p>
              • <strong>Trùng lặp:</strong> 6 số trên các mặt phải hoàn toàn phân biệt nhau (không được viết số giống nhau).
            </p>
          )}
          {violations.map((v, i) => (
            <p key={i}>
              • <strong>Hai mặt kề nhau bị chênh lệch &lt; 2:</strong> {FACES[v.f1].vietnamese} (
              {faceValues[v.f1]}) và {FACES[v.f2].vietnamese} ({faceValues[v.f2]}) có hiệu là {v.diff} (yêu cầu phải chênh nhau ít nhất 2).
            </p>
          ))}
        </div>
      )}

      {/* Buttons bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSaveBest}
            disabled={!isValid}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-extrabold shadow-xs transition ${
              isValid
                ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>Lưu kỷ lục nhỏ nhất</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Đặt lại</span>
          </button>
        </div>

        {mode === "learn" && (
          <button
            onClick={handleLoadOptimal}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Nạp phương án tối ưu mẫu (Tổng = 27)</span>
          </button>
        )}
      </div>

      {/* LEARN MODE: Step-by-step Mathematical Reasoning */}
      {mode === "learn" && (
        <div className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 text-xs text-slate-800 leading-relaxed">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-emerald-600" />
            <h5 className="text-sm font-extrabold text-emerald-950">
              Phân tích Tối ưu hóa Từng bước (Learn Mode)
            </h5>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-emerald-200 bg-white p-3 space-y-1">
              <strong className="text-emerald-900 font-bold block">
                Bước 1: Nhận diện quan hệ giữa các mặt
              </strong>
              <p>
                Mỗi mặt của khối lập phương kề với 4 mặt khác và chỉ <strong>đối diện với đúng 1 mặt</strong>.
                Như vậy 6 mặt chia thành đúng <strong>3 cặp mặt đối diện</strong>:
                (Trên - Dưới), (Trước - Sau), (Trái - Phải).
              </p>
            </div>

            <div className="rounded-lg border border-emerald-200 bg-white p-3 space-y-1">
              <strong className="text-emerald-900 font-bold block">
                Bước 2: Xử lý điều kiện “chênh nhau ít nhất 2”
              </strong>
              <p>
                Hai mặt kề nhau không được phép chênh nhau 1. Do đó, hai số có hiệu bằng 1 <strong>bắt buộc phải nằm ở hai mặt đối diện nhau</strong>. Vì khối lập phương chỉ có 3 cặp mặt đối diện, nên trong toàn bộ 6 số ta chỉ có thể tạo ra tối đa 3 cặp số chênh nhau 1!
              </p>
            </div>

            <div className="rounded-lg border border-emerald-200 bg-white p-3 space-y-1">
              <strong className="text-emerald-900 font-bold block">
                Bước 3: Chọn bộ số nhỏ nhất bắt đầu từ 1
              </strong>
              <p>
                • Cặp đối diện 1: Ta chọn <strong>&#123;1, 2&#125;</strong> (hiệu = 1, đặt ở 2 mặt đối diện).
                <br />
                • Số nhỏ nhất tiếp theo: Ta không thể dùng 3 vì số 3 sẽ kề với 2 (chênh 1 vi phạm). Vậy số nhỏ nhất hợp lệ tiếp theo là <strong>4</strong>!
                <br />
                • Cặp đối diện 2: Ghép 4 với số tiếp theo chênh 1: chọn <strong>&#123;4, 5&#125;</strong>.
                <br />
                • Số nhỏ nhất tiếp theo: Không thể dùng 6 (vì kề với 5). Vậy số tiếp theo phải là <strong>7</strong>!
                <br />
                • Cặp đối diện 3: Ghép 7 với <strong>&#123;7, 8&#125;</strong>.
              </p>
            </div>

            <div className="rounded-lg border border-emerald-300 bg-emerald-100/60 p-3 space-y-1 text-emerald-950 font-medium">
              <strong className="font-extrabold block">
                Bước 4: Kiểm tra và kết luận
              </strong>
              <p>
                Bộ số &#123;1, 2, 4, 5, 7, 8&#125; hoàn toàn thỏa mãn mọi điều kiện kề nhau (khoảng cách giữa các cặp: 4 - 2 = 2 ≥ 2, 7 - 5 = 2 ≥ 2).
              </p>
              <p className="font-mono font-black text-sm text-center pt-1">
                Tổng nhỏ nhất = 1 + 2 + 4 + 5 + 7 + 8 = 27.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Helper render for Face Card in Net
  function renderFaceCard(faceKey: FaceKey) {
    const face = FACES[faceKey];
    const val = faceValues[faceKey];
    const isViolated = violatingFaces.has(faceKey) || duplicateFaces.has(faceKey);

    return (
      <div
        key={faceKey}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 p-2.5 text-center transition-all shadow-xs ${
          isViolated
            ? "border-rose-400 bg-rose-50/90 ring-2 ring-rose-300"
            : face.pairColor
        }`}
      >
        <span className="text-[10px] font-black uppercase tracking-wider block">
          {face.vietnamese}
        </span>

        {/* Value and +/- controls */}
        <div className="my-1.5 flex items-center justify-center gap-1">
          <button
            onClick={() => handleIncrement(faceKey, -1)}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-xs font-bold text-slate-700 shadow-2xs border border-slate-200 hover:bg-slate-100 active:scale-95"
          >
            -
          </button>
          <input
            type="number"
            min={minValue}
            value={val}
            onChange={(e) => handleValueChange(faceKey, Number(e.target.value))}
            className="w-10 rounded-md border border-slate-300 bg-white py-0.5 text-center font-black text-slate-900 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <button
            onClick={() => handleIncrement(faceKey, 1)}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-xs font-bold text-slate-700 shadow-2xs border border-slate-200 hover:bg-slate-100 active:scale-95"
          >
            +
          </button>
        </div>

        <span className="text-[9px] text-slate-400 block">
          Đối diện: {FACES[face.opposite].vietnamese}
        </span>
      </div>
    );
  }

  // Helper render for Compact Face in Graph
  function renderCompactFace(faceKey: FaceKey) {
    const face = FACES[faceKey];
    const val = faceValues[faceKey];
    return (
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-semibold text-slate-500">{face.vietnamese}</span>
        <span className="text-base font-black text-slate-900 rounded-lg bg-slate-100 px-2.5 py-0.5 mt-0.5">
          {val}
        </span>
      </div>
    );
  }
};
