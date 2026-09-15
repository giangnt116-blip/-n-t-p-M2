import React, { useState, useMemo } from "react";
import {
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Users,
  Check,
  X,
  ListOrdered,
  Eye,
} from "lucide-react";
import { QuestionMode } from "../types/question";
import {
  MatchingConfig,
  MatchingItem,
  isValidPair,
  findAllValidMatchings,
} from "../utils/matchingUtils";

interface MatchingLabProps {
  config?: MatchingConfig;
  mode: QuestionMode;
}

export const MatchingLab: React.FC<MatchingLabProps> = ({ config, mode }) => {
  const leftItems: MatchingItem[] = useMemo(
    () =>
      config?.left || [
        { id: "1", label: "Hải ly 1" },
        { id: "2", label: "Hải ly 2" },
        { id: "3", label: "Hải ly 3" },
        { id: "4", label: "Hải ly 4" },
        { id: "5", label: "Hải ly 5" },
      ],
    [config?.left]
  );

  const rightItems: MatchingItem[] = useMemo(
    () =>
      config?.right || [
        { id: "A", label: "Nhiệm vụ A" },
        { id: "B", label: "Nhiệm vụ B" },
        { id: "C", label: "Nhiệm vụ C" },
        { id: "D", label: "Nhiệm vụ D" },
        { id: "E", label: "Nhiệm vụ E" },
      ],
    [config?.right]
  );

  const allowed: Record<string, string[]> = useMemo(
    () =>
      config?.allowed || {
        "1": ["A", "B"],
        "2": ["C", "D"],
        "3": ["B", "E"],
        "4": ["C", "E"],
        "5": ["A", "B", "D"],
      },
    [config?.allowed]
  );

  // User state: mapping from workerId -> taskId
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  // Learn mode states
  const [showAllWays, setShowAllWays] = useState<boolean>(false);
  const [activeWayIndex, setActiveWayIndex] = useState<number | null>(null);

  // Pre-calculate all valid matchings
  const allValidMatchings = useMemo(() => {
    return findAllValidMatchings(leftItems, rightItems, allowed);
  }, [leftItems, rightItems, allowed]);

  // Which right items are currently assigned
  const assignedTasks = useMemo(() => {
    const set = new Set<string>();
    Object.values(assignments).forEach((t: string) => set.add(t));
    return set;
  }, [assignments]);

  // Handle clicking left item (Worker)
  const handleSelectLeft = (workerId: string) => {
    // If worker already has an assignment and is clicked, we can clear it or select to reassign
    if (selectedLeftId === workerId) {
      setSelectedLeftId(null);
      setFeedback(null);
    } else {
      setSelectedLeftId(workerId);
      const currentTask = assignments[workerId];
      if (currentTask) {
        setFeedback({
          ok: true,
          text: `Đang chọn ${
            leftItems.find((w) => w.id === workerId)?.label
          } (hiện làm ${currentTask}). Chọn nhiệm vụ khác để đổi hoặc bấm dấu ✕ để gỡ.`,
        });
      } else {
        const allowedTasks = allowed[workerId] || [];
        setFeedback({
          ok: true,
          text: `Đã chọn ${
            leftItems.find((w) => w.id === workerId)?.label
          }. Hãy chọn 1 trong các nhiệm vụ có thể làm: [${allowedTasks.join(
            ", "
          )}].`,
        });
      }
    }
  };

  // Handle clicking right item (Task)
  const handleSelectRight = (taskId: string) => {
    if (!selectedLeftId) {
      // Find who is doing this task if anyone
      const workerDoingTask = Object.keys(assignments).find(
        (w) => assignments[w] === taskId
      );
      if (workerDoingTask) {
        setFeedback({
          ok: true,
          text: `Nhiệm vụ ${taskId} đang do ${
            leftItems.find((w) => w.id === workerDoingTask)?.label
          } phụ trách.`,
        });
      } else {
        setFeedback({
          ok: false,
          text: `Hãy chọn 1 chú Hải ly ở cột trái trước, sau đó mới chọn Nhiệm vụ.`,
        });
      }
      return;
    }

    const workerId = selectedLeftId;
    const isAllowed = isValidPair(workerId, taskId, allowed);

    if (!isAllowed) {
      setFeedback({
        ok: false,
        text: `❌ Chưa hợp lệ: Ghép này chưa hợp lệ. Hải ly ${workerId} không có kỹ năng làm Nhiệm vụ ${taskId}.`,
      });
      return;
    }

    // Check if task is already assigned to a DIFFERENT worker
    const workerHoldingTask = Object.keys(assignments).find(
      (w) => assignments[w] === taskId && w !== workerId
    );
    if (workerHoldingTask) {
      setFeedback({
        ok: false,
        text: `❌ Chưa hợp lệ: Nhiệm vụ này đã được giao cho Hải ly ${workerHoldingTask}.`,
      });
      return;
    }

    // Assign!
    const newAssignments = { ...assignments, [workerId]: taskId };
    setAssignments(newAssignments);
    setSelectedLeftId(null);

    // Check if full matching completed
    if (Object.keys(newAssignments).length === leftItems.length) {
      setFeedback({
        ok: true,
        text: `✅ Hợp lệ: Hoàn thành một cách phân công hợp lệ!`,
      });
    } else {
      setFeedback({
        ok: true,
        text: `✅ Hợp lệ: Đã giao Nhiệm vụ ${taskId} cho Hải ly ${workerId}.`,
      });
    }
  };

  // Remove specific assignment
  const handleUnassign = (workerId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = { ...assignments };
    delete next[workerId];
    setAssignments(next);
    if (selectedLeftId === workerId) setSelectedLeftId(null);
    setFeedback({
      ok: true,
      text: `Đã hủy phân công của Hải ly ${workerId}.`,
    });
  };

  const handleReset = () => {
    setAssignments({});
    setSelectedLeftId(null);
    setFeedback(null);
    setShowAllWays(false);
    setActiveWayIndex(null);
  };

  // Learn Mode: Apply one valid matching
  const handleShowOneValidMatching = () => {
    if (allValidMatchings.length > 0) {
      setAssignments({ ...allValidMatchings[0] });
      setSelectedLeftId(null);
      setActiveWayIndex(0);
      setFeedback({
        ok: true,
        text: `Đang hiển thị Cách 1: ${Object.entries(allValidMatchings[0])
          .map(([w, t]) => `Hải ly ${w} → ${t}`)
          .join(", ")}.`,
      });
    }
  };

  const handleSelectSpecificWay = (index: number) => {
    if (allValidMatchings[index]) {
      setAssignments({ ...allValidMatchings[index] });
      setSelectedLeftId(null);
      setActiveWayIndex(index);
      setFeedback({
        ok: true,
        text: `Đang hiển thị Cách ${index + 1}: ${Object.entries(
          allValidMatchings[index]
        )
          .map(([w, t]) => `Hải ly ${w} → ${t}`)
          .join(", ")}.`,
      });
    }
  };

  const assignedCount = Object.keys(assignments).length;
  const totalCount = leftItems.length;
  const isComplete = assignedCount === totalCount;

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
                matchingLab
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Ghép cặp phân công (Hải ly & Nhiệm vụ)
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {mode === "learn" && (
            <>
              <button
                onClick={handleShowOneValidMatching}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Xem một cách ghép hợp lệ</span>
              </button>

              <button
                onClick={() => setShowAllWays(!showAllWays)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                  showAllWays
                    ? "bg-indigo-700 text-white shadow-xs"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <ListOrdered className="h-3.5 w-3.5" />
                <span>{showAllWays ? "Ẩn danh sách cách" : "Xem tất cả cách"}</span>
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

      {/* BIPARTITE MATCHING TWO-COLUMN BOARD */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-4">
        {/* Progress Bar */}
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-600">
            Tiến độ phân công:{" "}
            <strong className="text-indigo-700 font-extrabold">
              {assignedCount} / {totalCount}
            </strong>
          </span>
          <span className="text-slate-400 font-medium">
            Mỗi hải ly đúng 1 việc • Mỗi việc đúng 1 hải ly
          </span>
        </div>

        {/* 2-COLUMN MATCHING INTERFACE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* LEFT COLUMN: WORKERS (HẢI LY) */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-1">
              Cột trái: Danh sách Hải ly
            </span>
            <div className="space-y-2">
              {leftItems.map((worker) => {
                const assignedTask = assignments[worker.id];
                const isSelected = selectedLeftId === worker.id;
                const allowedList = allowed[worker.id] || [];

                return (
                  <div
                    key={worker.id}
                    onClick={() => handleSelectLeft(worker.id)}
                    className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all active:scale-[0.99] ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-300"
                        : assignedTask
                        ? "border-emerald-300 bg-emerald-50/40 hover:border-emerald-400"
                        : "border-slate-200 bg-slate-50/70 hover:border-indigo-200 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-base">
                        🦫
                      </span>
                      <div>
                        <div className="text-xs font-extrabold text-slate-800">
                          {worker.label}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Làm được:{" "}
                          <span className="font-mono font-bold text-indigo-700">
                            [{allowedList.join(", ")}]
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Assigned task badge or status */}
                    <div className="flex items-center gap-1.5">
                      {assignedTask ? (
                        <div className="flex items-center gap-1">
                          <span className="rounded-lg bg-emerald-600 px-2 py-0.5 text-xs font-black text-white shadow-2xs">
                            → {assignedTask}
                          </span>
                          <button
                            onClick={(e) => handleUnassign(worker.id, e)}
                            className="h-6 w-6 rounded-md hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition"
                            title="Gỡ nhiệm vụ này"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400">
                          {isSelected ? "Đang chọn..." : "Chưa nhận"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: TASKS (NHIỆM VỤ) */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-1">
              Cột phải: Nhiệm vụ
            </span>
            <div className="space-y-2">
              {rightItems.map((task) => {
                const assignedWorkerId = Object.keys(assignments).find(
                  (w) => assignments[w] === task.id
                );
                const isAssigned = !!assignedWorkerId;
                const isAllowedForSelected = selectedLeftId
                  ? (allowed[selectedLeftId] || []).includes(task.id)
                  : false;

                let borderStyle = "border-slate-200 bg-slate-50/70";
                if (isAssigned) {
                  borderStyle = "border-emerald-300 bg-emerald-50/40";
                } else if (selectedLeftId && isAllowedForSelected) {
                  borderStyle =
                    "border-amber-300 bg-amber-50/60 ring-2 ring-amber-200 hover:bg-amber-100/50";
                }

                return (
                  <div
                    key={task.id}
                    onClick={() => handleSelectRight(task.id)}
                    className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all active:scale-[0.99] ${borderStyle}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-base font-black text-amber-900 font-mono">
                        {task.id}
                      </span>
                      <div>
                        <div className="text-xs font-extrabold text-slate-800">
                          {task.label}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {isAssigned ? (
                            <span className="text-emerald-700 font-semibold">
                              ✓ Đã giao cho Hải ly {assignedWorkerId}
                            </span>
                          ) : selectedLeftId && isAllowedForSelected ? (
                            <span className="text-amber-800 font-bold">
                              ★ Có thể nhận!
                            </span>
                          ) : (
                            <span className="text-slate-400">Chưa có người nhận</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      {isAssigned ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          <Check className="h-3 w-3" /> Đã giao
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSelectRight(task.id)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          Chọn
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* FEEDBACK STATUS BAR */}
        {feedback && (
          <div
            className={`flex items-center gap-2 rounded-xl p-3 text-xs font-medium ${
              feedback.ok
                ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border border-rose-200 bg-rose-50 text-rose-900"
            }`}
          >
            {feedback.ok ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}
      </div>

      {/* LEARN MODE: ALL VALID WAYS LIST (TABLE / CARDS) */}
      {mode === "learn" && showAllWays && (
        <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Tất cả các cách phân công hợp lệ ({allValidMatchings.length} cách)</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              Bấm vào từng cách để nạp lên bảng
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {allValidMatchings.map((matching, idx) => {
              const isSelected = activeWayIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectSpecificWay(idx)}
                  className={`rounded-xl border p-3 cursor-pointer transition active:scale-95 space-y-2 ${
                    isSelected
                      ? "border-emerald-500 bg-white shadow-xs ring-2 ring-emerald-300"
                      : "border-emerald-200 bg-white/80 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs text-emerald-900 border-b border-emerald-100 pb-1">
                    <span>Cách {idx + 1}</span>
                    {isSelected && (
                      <span className="text-[10px] text-emerald-600 font-extrabold">
                        Đang xem
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-slate-700 font-mono">
                    {leftItems.map((worker) => (
                      <div
                        key={worker.id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-slate-500">Hải ly {worker.id}</span>
                        <span className="font-extrabold text-indigo-700">
                          → {matching[worker.id]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-emerald-300 bg-white p-3 text-center space-y-1">
            <p className="text-xs font-bold text-emerald-900">
              Teaching Point: “Mỗi người một việc – mỗi việc một người. Trong Tin học, dạng này thường được gọi là bài toán ghép cặp.”
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
