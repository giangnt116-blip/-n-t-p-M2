import React, { useState, useMemo } from "react";
import {
  RotateCcw,
  Sparkles,
  Zap,
  Battery,
  BatteryCharging,
  AlertCircle,
  TrendingUp,
  History,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Bot,
  Route,
} from "lucide-react";
import { QuestionMode } from "../types/question";
import {
  EnergyGraphConfig,
  EnergyNode,
  EnergyEdge,
  isMoveValid,
  evaluatePath,
  getAllEvaluatedPaths,
} from "../utils/energyGraphUtils";

interface EnergyGraphLabProps {
  config?: EnergyGraphConfig;
  mode: QuestionMode;
}

interface AttemptRecord {
  path: string[];
  energySteps: number[];
  finalEnergy: number;
}

export const EnergyGraphLab: React.FC<EnergyGraphLabProps> = ({
  config,
  mode,
}) => {
  const initialEnergy = config?.initialEnergy ?? 10;
  const minEnergy = config?.minEnergy ?? 0;
  const startNode = config?.start ?? "A";
  const targetNode = config?.target ?? "D";

  const nodes: EnergyNode[] = useMemo(
    () =>
      config?.nodes ?? [
        { id: "A", label: "A", x: 10, y: 50 },
        { id: "B", label: "B", x: 40, y: 20 },
        { id: "C", label: "C", x: 40, y: 80 },
        { id: "D", label: "D", x: 85, y: 50 },
      ],
    [config?.nodes]
  );

  const edges: EnergyEdge[] = useMemo(
    () =>
      config?.edges ?? [
        { from: "A", to: "B", delta: -4, label: "-4" },
        { from: "A", to: "C", delta: -6, label: "-6" },
        { from: "B", to: "D", delta: -5, label: "-5" },
        { from: "C", to: "D", delta: -2, label: "-2" },
        { from: "B", to: "C", delta: 3, label: "+3", type: "recharge" },
      ],
    [config?.edges]
  );

  // Runtime State
  const [currentNode, setCurrentNode] = useState<string>(startNode);
  const [currentEnergy, setCurrentEnergy] = useState<number>(initialEnergy);
  const [currentPath, setCurrentPath] = useState<string[]>([startNode]);
  const [energySteps, setEnergySteps] = useState<number[]>([initialEnergy]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // History of completed trials
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);

  // Learn Mode states
  const [showComparison, setShowComparison] = useState<boolean>(
    mode === "learn"
  );
  const [previewPath, setPreviewPath] = useState<string[] | null>(null);

  // Precompute evaluated paths for Learn Mode
  const allEvaluatedPaths = useMemo(
    () =>
      getAllEvaluatedPaths(
        edges,
        startNode,
        targetNode,
        initialEnergy,
        minEnergy
      ),
    [edges, startNode, targetNode, initialEnergy, minEnergy]
  );

  const optimalPath = useMemo(() => {
    const validPaths = allEvaluatedPaths.filter((p) => p.isValid);
    if (validPaths.length === 0) return null;
    return validPaths.reduce((prev, curr) =>
      curr.finalEnergy > prev.finalEnergy ? curr : prev
    );
  }, [allEvaluatedPaths]);

  // Determine which nodes can be reached directly from currentNode
  const reachableNodes = useMemo(() => {
    if (currentNode === targetNode) return [];
    return edges
      .filter((e) => e.from === currentNode)
      .map((e) => e.to);
  }, [currentNode, targetNode, edges]);

  // Click on node handler
  const handleNodeClick = (nodeId: string) => {
    setErrorMessage(null);

    // If currently at target or clicking current node
    if (currentNode === targetNode) {
      return;
    }
    if (nodeId === currentNode) {
      return;
    }

    // Check move validity
    const check = isMoveValid(
      edges,
      currentNode,
      nodeId,
      currentEnergy,
      minEnergy
    );

    if (!check.valid) {
      setErrorMessage(
        check.reason || "❌ Robot không đủ pin để đi đoạn này."
      );
      return;
    }

    const nextEnergy = check.nextEnergy;
    const nextPath = [...currentPath, nodeId];
    const nextSteps = [...energySteps, nextEnergy];

    setCurrentNode(nodeId);
    setCurrentEnergy(nextEnergy);
    setCurrentPath(nextPath);
    setEnergySteps(nextSteps);

    // If reached target, save to attempts history (avoid exact duplicates consecutively)
    if (nodeId === targetNode) {
      setAttempts((prev) => {
        const pathStr = nextPath.join(" → ");
        const alreadyExists = prev.some((a) => a.path.join(" → ") === pathStr);
        if (!alreadyExists) {
          return [
            ...prev,
            {
              path: nextPath,
              energySteps: nextSteps,
              finalEnergy: nextEnergy,
            },
          ];
        }
        return prev;
      });
    }
  };

  // Reset current trip back to start
  const handleResetTrip = () => {
    setCurrentNode(startNode);
    setCurrentEnergy(initialEnergy);
    setCurrentPath([startNode]);
    setEnergySteps([initialEnergy]);
    setErrorMessage(null);
  };

  // Clear trial history
  const handleClearHistory = () => {
    setAttempts([]);
  };

  // Active path to highlight on the SVG canvas
  const activeDisplayPath = previewPath || currentPath;

  // Battery percentage for bar display (scale 0-10 or custom max)
  const maxDisplayBattery = Math.max(initialEnergy, 10);
  const batteryPct = Math.min(
    100,
    Math.max(0, (currentEnergy / maxDisplayBattery) * 100)
  );

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-slate-50/70 to-white p-5 shadow-xs space-y-5">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mô phỏng tương tác
              </span>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-700">
                energyGraphLab
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Robot & Lộ trình Quản lý Năng lượng (A → D)
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {mode === "learn" && (
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                showComparison
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>🔍 So sánh các phương án</span>
            </button>
          )}

          <button
            onClick={handleResetTrip}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition shadow-2xs"
            title="Khởi động lại hành trình từ A"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>↺ Làm lại</span>
          </button>
        </div>
      </div>

      {/* BATTERY & ROBOT STATUS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Battery Status Gauge */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1">
              <Battery className="h-4 w-4 text-emerald-600" />
              Mức Pin Hiện Tại
            </span>
            <span className="font-mono text-xs font-black text-slate-800">
              🔋 {currentEnergy} pin
            </span>
          </div>

          {/* Battery bar meter */}
          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                currentEnergy <= 2
                  ? "bg-rose-500"
                  : currentEnergy <= 5
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${batteryPct}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Tối thiểu: {minEnergy} pin</span>
            <span>Khởi đầu: {initialEnergy} pin</span>
          </div>
        </div>

        {/* Current Position & Path */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Vị trí & Tuyến đang đi
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Bot className="h-4 w-4 text-indigo-600" />
            <span>Robot đang ở: </span>
            <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-xs font-black text-white">
              Điểm {currentNode}
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-500 truncate">
            Lộ trình: {currentPath.join(" → ")}
          </div>
        </div>

        {/* Target Reached / Action Guidance */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs flex flex-col justify-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Trạng thái đích
          </div>
          <div className="mt-1 text-xs font-extrabold">
            {currentNode === targetNode ? (
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Đã đến đích D với {currentEnergy} pin!
              </span>
            ) : (
              <span className="text-slate-600 font-medium">
                Bấm điểm kế tiếp hợp lệ để di chuyển
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ERROR / FEEDBACK NOTIFICATION */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-900 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* MAIN TWO-COLUMN WORKSPACE: SVG GRAPH (LEFT) & PATH DETAILS/HISTORY (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: INTERACTIVE SVG GRAPH CANVAS (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5">
              <Route className="h-4 w-4 text-indigo-600" />
              Sơ đồ mạng lưới năng lượng:
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              ⚡ Điểm B → C là trạm sạc (+3 pin)
            </span>
          </div>

          {/* SVG Canvas */}
          <div className="relative w-full aspect-[4/3] rounded-xl border border-slate-100 bg-slate-50/50 overflow-hidden flex items-center justify-center select-none">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Arrow markers */}
                <marker
                  id="arrow-default"
                  viewBox="0 0 10 10"
                  refX="19"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#94a3b8" />
                </marker>
                <marker
                  id="arrow-active"
                  viewBox="0 0 10 10"
                  refX="19"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4f46e5" />
                </marker>
                <marker
                  id="arrow-recharge"
                  viewBox="0 0 10 10"
                  refX="19"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#16a34a" />
                </marker>
              </defs>

              {/* EDGES */}
              {edges.map((edge, idx) => {
                const source = nodes.find((n) => n.id === edge.from);
                const target = nodes.find((n) => n.id === edge.to);
                if (!source || !target) return null;

                // Check if this edge is traversed in activeDisplayPath
                const isTraversed = activeDisplayPath.some(
                  (nodeId, i) =>
                    i < activeDisplayPath.length - 1 &&
                    nodeId === edge.from &&
                    activeDisplayPath[i + 1] === edge.to
                );

                const isRecharge = edge.type === "recharge";

                // Midpoint for cost/delta label
                const midX = (source.x + target.x) / 2;
                const midY = (source.y + target.y) / 2;

                // Slight offset for label if vertical line (e.g. B -> C)
                const offsetX = source.x === target.x ? 5 : 0;
                const offsetY = source.y === target.y ? -4 : -3;

                return (
                  <g key={`edge-${idx}`}>
                    {/* The directed line */}
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={
                        isTraversed
                          ? "#4f46e5"
                          : isRecharge
                          ? "#16a34a"
                          : "#94a3b8"
                      }
                      strokeWidth={isTraversed ? 2.8 : isRecharge ? 2.2 : 1.8}
                      strokeDasharray={isRecharge && !isTraversed ? "3 2" : "none"}
                      markerEnd={
                        isTraversed
                          ? "url(#arrow-active)"
                          : isRecharge
                          ? "url(#arrow-recharge)"
                          : "url(#arrow-default)"
                      }
                    />

                    {/* Edge Label Badge */}
                    <g transform={`translate(${midX + offsetX}, ${midY + offsetY})`}>
                      <rect
                        x="-7"
                        y="-4.5"
                        width="14"
                        height="9"
                        rx="2.5"
                        fill={
                          isTraversed
                            ? "#4f46e5"
                            : isRecharge
                            ? "#dcfce7"
                            : "#ffffff"
                        }
                        stroke={
                          isTraversed
                            ? "#3730a3"
                            : isRecharge
                            ? "#22c55e"
                            : "#cbd5e1"
                        }
                        strokeWidth="0.6"
                      />
                      <text
                        x="0"
                        y="1.8"
                        textAnchor="middle"
                        fontSize="4"
                        fontWeight="bold"
                        fill={
                          isTraversed
                            ? "#ffffff"
                            : isRecharge
                            ? "#15803d"
                            : "#475569"
                        }
                      >
                        {isRecharge ? `⚡+${edge.delta}` : edge.delta}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* NODES */}
              {nodes.map((node) => {
                const isCurrent = currentNode === node.id;
                const isStart = node.id === startNode;
                const isTarget = node.id === targetNode;
                const isInPath = activeDisplayPath.includes(node.id);
                const isReachable = reachableNodes.includes(node.id);

                return (
                  <g
                    key={`node-${node.id}`}
                    className="cursor-pointer"
                    onClick={() => handleNodeClick(node.id)}
                  >
                    {/* Reachable pulse ring */}
                    {isReachable && currentNode !== targetNode && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="8.5"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="0.8"
                        strokeDasharray="2 1.5"
                        className="animate-pulse"
                      />
                    )}

                    {/* Outer Circle Ring */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="6.5"
                      fill={
                        isCurrent
                          ? "#4f46e5"
                          : isInPath
                          ? "#e0e7ff"
                          : isTarget
                          ? "#ecfdf5"
                          : isStart
                          ? "#eff6ff"
                          : "#ffffff"
                      }
                      stroke={
                        isCurrent
                          ? "#312e81"
                          : isInPath
                          ? "#6366f1"
                          : isTarget
                          ? "#10b981"
                          : isStart
                          ? "#3b82f6"
                          : "#94a3b8"
                      }
                      strokeWidth={isCurrent ? 1.8 : 1.2}
                      className="transition-all duration-200"
                    />

                    {/* Node Label */}
                    <text
                      x={node.x}
                      y={node.y + 1.8}
                      textAnchor="middle"
                      fontSize="4.8"
                      fontWeight="bold"
                      fill={isCurrent ? "#ffffff" : "#1e293b"}
                    >
                      {node.label}
                    </text>

                    {/* Role caption below node */}
                    <text
                      x={node.x}
                      y={node.y + 10}
                      textAnchor="middle"
                      fontSize="3"
                      fontWeight="600"
                      fill={
                        isStart
                          ? "#2563eb"
                          : isTarget
                          ? "#059669"
                          : "#64748b"
                      }
                    >
                      {isStart ? "Xuất phát" : isTarget ? "Đích đến" : ""}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>● Bấm trực tiếp vào các điểm A, B, C, D để di chuyển robot</span>
            {currentNode !== targetNode && reachableNodes.length > 0 && (
              <span className="text-indigo-600 font-bold">
                Có thể đi tới: {reachableNodes.join(", ")}
              </span>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: STEP-BY-STEP ENERGY TRACKER & HISTORY (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Current Trip Progression */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Diễn biến pin từng bước:
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {currentPath.length} điểm đã qua
              </span>
            </div>

            <div className="space-y-1.5">
              {currentPath.map((nodeId, idx) => {
                const energyAtStep = energySteps[idx];
                const prevEnergy = idx > 0 ? energySteps[idx - 1] : null;
                const delta = prevEnergy !== null ? energyAtStep - prevEnergy : null;

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-100 font-black text-indigo-700 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800">
                        Điểm {nodeId}
                      </span>
                      {delta !== null && (
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            delta > 0
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {delta > 0 ? `+${delta} pin (sạc)` : `${delta} pin`}
                        </span>
                      )}
                    </div>

                    <div className="font-mono font-extrabold text-slate-700">
                      {energyAtStep} pin
                    </div>
                  </div>
                );
              })}
            </div>

            {currentNode === targetNode && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-950 font-bold flex items-center justify-between">
                <span>🎉 Hoàn thành chuyến đi!</span>
                <span className="font-mono">Pin còn: {currentEnergy}</span>
              </div>
            )}

            {/* Trial Action */}
            <div className="pt-1">
              <button
                onClick={handleResetTrip}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition shadow-2xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>↺ Thử đường khác</span>
              </button>
            </div>
          </div>

          {/* HISTORY TABLE OF ATTEMPTED PATHS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <History className="h-4 w-4 text-slate-500" />
                <span>Lịch sử các đường đã thử ({attempts.length})</span>
              </div>

              {attempts.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-[11px] text-slate-400 hover:text-rose-600 transition flex items-center gap-1"
                  title="Xóa toàn bộ lịch sử thử nghiệm"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Xóa lịch sử</span>
                </button>
              )}
            </div>

            {attempts.length === 0 ? (
              <div className="p-4 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-400">
                Chưa có đường nào đến đích D. Hãy di chuyển robot đến D để lưu kết quả vào bảng so sánh!
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {attempts.map((att, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setPreviewPath(att.path)}
                    onMouseLeave={() => setPreviewPath(null)}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium hover:bg-indigo-50/50 hover:border-indigo-200 transition cursor-pointer"
                    title="Rê chuột vào để xem lại đường đi trên sơ đồ"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-slate-400">
                        #{idx + 1}
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {att.path.join(" → ")}
                      </span>
                    </div>

                    <div className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {att.finalEnergy} pin
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LEARN MODE: DETAILED COMPARISON & OPTIMIZATION TEACHING */}
      {mode === "learn" && showComparison && (
        <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="flex items-center justify-between border-b border-emerald-200/70 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Phân tích & So sánh tất cả các phương án đến đích D</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-800">
              Điểm tối ưu: {optimalPath?.finalEnergy} pin
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {allEvaluatedPaths.map((ep, idx) => {
              const isBest = optimalPath && ep.path.join("-") === optimalPath.path.join("-");

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentPath(ep.path);
                    setEnergySteps(ep.energySteps);
                    setCurrentNode(targetNode);
                    setCurrentEnergy(ep.finalEnergy);
                  }}
                  className={`rounded-xl border p-3 text-xs space-y-2 cursor-pointer transition active:scale-95 ${
                    isBest
                      ? "border-emerald-500 bg-white ring-2 ring-emerald-300 shadow-xs"
                      : "border-emerald-200 bg-white/90 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-slate-800 text-sm">
                      {ep.path.join(" → ")}
                    </span>
                    {isBest && (
                      <span className="rounded-md bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase">
                        Tối ưu nhất
                      </span>
                    )}
                  </div>

                  {/* Energy Progression Formula */}
                  <div className="font-mono text-slate-600 text-[11px] bg-slate-50 p-1.5 rounded border border-slate-200">
                    {ep.energySteps.join(" → ")}
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Mức pin cuối cùng:</span>
                    <span
                      className={`font-mono font-black text-sm ${
                        isBest ? "text-emerald-700" : "text-slate-700"
                      }`}
                    >
                      {ep.finalEnergy} pin
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-emerald-300 bg-white p-3 space-y-1.5 text-xs text-slate-700">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <span>💡 Nhận xét chiến lược:</span>
              <span className="text-emerald-700">
                Đường A → B → C → D đi qua 3 cạnh (dài hơn đường 2 cạnh A → B → D và A → C → D), nhưng nhờ đi qua trạm sạc B → C (+3 pin), lượng pin cuối cùng đạt tới 7 pin!
              </span>
            </div>
            <div className="text-center font-bold text-emerald-900 pt-1">
              Teaching Point: “Đường nhiều bước hơn chưa chắc kém hơn. Muốn tối ưu, hãy so sánh kết quả cuối cùng của các phương án.”
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
