import React, { useState, useMemo } from "react";
import {
  RotateCcw,
  Sparkles,
  Search,
  Flag,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Footprints,
  Layers,
} from "lucide-react";
import { QuestionMode } from "../types/question";
import {
  GraphConfig,
  GraphNode,
  GraphEdge,
  areConnected,
  findShortestPaths,
} from "../utils/graphUtils";

interface GraphPathLabProps {
  config?: GraphConfig;
  mode: QuestionMode;
}

interface AttemptRecord {
  path: string[];
  length: number;
}

export const GraphPathLab: React.FC<GraphPathLabProps> = ({ config, mode }) => {
  const nodes: GraphNode[] = useMemo(
    () =>
      config?.nodes || [
        { id: "A", x: 10, y: 50 },
        { id: "B", x: 35, y: 20 },
        { id: "C", x: 35, y: 80 },
        { id: "D", x: 60, y: 50 },
        { id: "E", x: 60, y: 15 },
        { id: "F", x: 90, y: 50 },
      ],
    [config?.nodes]
  );

  const edges: GraphEdge[] = useMemo(
    () =>
      config?.edges || [
        ["A", "B"],
        ["A", "C"],
        ["B", "D"],
        ["B", "E"],
        ["C", "D"],
        ["D", "F"],
        ["E", "F"],
      ],
    [config?.edges]
  );

  const startNodeId = config?.start || (nodes[0] ? nodes[0].id : "A");
  const targetNodeId =
    config?.target || (nodes.length > 0 ? nodes[nodes.length - 1].id : "F");

  // State
  const [currentPath, setCurrentPath] = useState<string[]>([startNodeId]);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);

  // Learn Mode states
  const [showShortestAnalysis, setShowShortestAnalysis] = useState<boolean>(
    mode === "learn"
  );
  const [selectedShortestIndex, setSelectedShortestIndex] = useState<number>(0);

  // Shortest paths calculation
  const shortestAnalysis = useMemo(() => {
    return findShortestPaths(edges, startNodeId, targetNodeId);
  }, [edges, startNodeId, targetNodeId]);

  const currentNodeId = currentPath[currentPath.length - 1];
  const isAtTarget = currentNodeId === targetNodeId;

  // Handle node selection
  const handleNodeClick = (clickedId: string) => {
    // If already at target, inform user they can reset to try another route
    if (isAtTarget) {
      setFeedback({
        type: "info",
        text: `Em đã đến đích ${targetNodeId}! Bấm "Làm lại đường đi" để thử một lộ trình khác.`,
      });
      return;
    }

    // If path is somehow empty, initialize with start
    if (currentPath.length === 0) {
      if (clickedId === startNodeId) {
        setCurrentPath([startNodeId]);
        setFeedback(null);
      } else {
        setFeedback({
          type: "error",
          text: `❌ Chưa hợp lệ: Em cần bắt đầu từ điểm xuất phát ${startNodeId}.`,
        });
      }
      return;
    }

    // If clicking the current node again
    if (clickedId === currentNodeId) {
      return;
    }

    // Check if clicking previous node (undo 1 step)
    if (
      currentPath.length > 1 &&
      clickedId === currentPath[currentPath.length - 2]
    ) {
      const nextPath = currentPath.slice(0, -1);
      setCurrentPath(nextPath);
      setFeedback({
        type: "info",
        text: `Đã lùi lại 1 bước về đảo ${clickedId}.`,
      });
      return;
    }

    // Check if clicked node is directly connected to current node
    if (areConnected(edges, currentNodeId, clickedId)) {
      // Avoid cycles in path if already visited
      if (currentPath.includes(clickedId)) {
        setFeedback({
          type: "info",
          text: `Em đã từng đi qua đảo ${clickedId}. Hãy tiếp tục đi về phía đích.`,
        });
        return;
      }

      const nextPath = [...currentPath, clickedId];
      setCurrentPath(nextPath);

      if (clickedId === targetNodeId) {
        const segments = nextPath.length - 1;
        setFeedback({
          type: "success",
          text: `🎉 Em đã tới đích! Lộ trình: ${nextPath.join(" → ")} (${segments} đoạn).`,
        });

        // Add to attempts history if not already present
        const pathStr = nextPath.join("-");
        setAttempts((prev) => {
          if (!prev.some((a) => a.path.join("-") === pathStr)) {
            return [...prev, { path: nextPath, length: segments }];
          }
          return prev;
        });
      } else {
        setFeedback(null);
      }
    } else {
      setFeedback({
        type: "error",
        text: `❌ Chưa hợp lệ: Giữa hai đảo ${currentNodeId} và ${clickedId} chưa có con đường.`,
      });
    }
  };

  const handleResetPath = () => {
    setCurrentPath([startNodeId]);
    setFeedback(null);
  };

  const handleResetAll = () => {
    setCurrentPath([startNodeId]);
    setFeedback(null);
    setAttempts([]);
    setShowShortestAnalysis(mode === "learn");
    setSelectedShortestIndex(0);
  };

  // Node position lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, GraphNode>();
    for (const node of nodes) {
      map.set(node.id, node);
    }
    return map;
  }, [nodes]);

  // Check if an edge is in the current user path
  const isEdgeInPath = (u: string, v: string, path: string[]) => {
    for (let i = 0; i < path.length - 1; i++) {
      if (
        (path[i] === u && path[i + 1] === v) ||
        (path[i] === v && path[i + 1] === u)
      ) {
        return true;
      }
    }
    return false;
  };

  // Active path to highlight on SVG:
  // In Learn mode with analysis open, can highlight selected shortest path or current path
  const highlightPath =
    mode === "learn" && showShortestAnalysis && shortestAnalysis.shortestPaths.length > 0
      ? shortestAnalysis.shortestPaths[selectedShortestIndex] || currentPath
      : currentPath;

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-slate-50/70 to-white p-5 shadow-xs space-y-5">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Navigation className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mô phỏng tương tác
              </span>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-700">
                graphPathLab
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Mạng lưới Đồ thị Quần đảo (Đỉnh & Cạnh)
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {mode === "learn" && (
            <button
              onClick={() => setShowShortestAnalysis(!showShortestAnalysis)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                showShortestAnalysis
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Search className="h-3.5 w-3.5" />
              <span>
                {showShortestAnalysis
                  ? "Ẩn phân tích đường đi"
                  : "🔍 Tìm đường ngắn nhất"}
              </span>
            </button>
          )}

          <button
            onClick={handleResetPath}
            className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition"
            title="Làm lại đường đi hiện tại"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Làm lại đường đi</span>
          </button>
        </div>
      </div>

      {/* GRAPH SVG CANVAS */}
      <div className="relative mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="relative aspect-[16/10] w-full">
          <svg
            viewBox="0 0 1000 625"
            className="h-full w-full select-none"
            style={{ touchAction: "manipulation" }}
          >
            <defs>
              <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="4"
                  floodColor="#4f46e5"
                  floodOpacity="0.35"
                />
              </filter>
            </defs>

            {/* 1. EDGES */}
            {edges.map(([u, v], idx) => {
              const nodeU = nodeMap.get(u);
              const nodeV = nodeMap.get(v);
              if (!nodeU || !nodeV) return null;

              const x1 = (nodeU.x / 100) * 1000;
              const y1 = (nodeU.y / 100) * 625;
              const x2 = (nodeV.x / 100) * 1000;
              const y2 = (nodeV.y / 100) * 625;

              const isInActivePath = isEdgeInPath(u, v, highlightPath);

              return (
                <g key={`edge-${idx}-${u}-${v}`}>
                  {/* Outer glow line if in active path */}
                  {isInActivePath && (
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#818cf8"
                      strokeWidth="10"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                  )}
                  {/* Core edge line */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isInActivePath ? "#4f46e5" : "#cbd5e1"}
                    strokeWidth={isInActivePath ? "5" : "2.5"}
                    strokeDasharray={isInActivePath ? undefined : "6,6"}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}

            {/* 2. NODES */}
            {nodes.map((node) => {
              const cx = (node.x / 100) * 1000;
              const cy = (node.y / 100) * 625;
              const isStart = node.id === startNodeId;
              const isTarget = node.id === targetNodeId;
              const isInCurrentPath = currentPath.includes(node.id);
              const isCurrent = currentNodeId === node.id;
              const pathIndex = currentPath.indexOf(node.id);

              return (
                <g
                  key={`node-${node.id}`}
                  onClick={() => handleNodeClick(node.id)}
                  className="cursor-pointer group"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleNodeClick(node.id);
                    }
                  }}
                  aria-label={`Đảo ${node.id}`}
                >
                  {/* Pulse ring on current node */}
                  {isCurrent && !isAtTarget && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="44"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2"
                      className="animate-ping opacity-60 origin-center"
                    />
                  )}

                  {/* Node outer circle background */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="34"
                    fill={
                      isCurrent
                        ? "#4f46e5"
                        : isInCurrentPath
                        ? "#e0e7ff"
                        : isStart
                        ? "#ecfdf5"
                        : isTarget
                        ? "#fef2f2"
                        : "#ffffff"
                    }
                    stroke={
                      isCurrent
                        ? "#3730a3"
                        : isInCurrentPath
                        ? "#6366f1"
                        : isStart
                        ? "#10b981"
                        : isTarget
                        ? "#ef4444"
                        : "#94a3b8"
                    }
                    strokeWidth={isCurrent ? "4" : isInCurrentPath ? "3" : "2"}
                    filter={isCurrent ? "url(#glow)" : undefined}
                    className="transition-all duration-300 group-hover:scale-105 origin-center"
                  />

                  {/* Node Label */}
                  <text
                    x={cx}
                    y={cy + 7}
                    textAnchor="middle"
                    fontSize="24"
                    fontWeight="800"
                    fill={
                      isCurrent
                        ? "#ffffff"
                        : isInCurrentPath
                        ? "#312e81"
                        : "#1e293b"
                    }
                    className="pointer-events-none select-none font-sans"
                  >
                    {node.id}
                  </text>

                  {/* Badges for Start / Target / Step order */}
                  {isStart && (
                    <g transform={`translate(${cx - 36}, ${cy - 52})`}>
                      <rect
                        width="72"
                        height="22"
                        rx="11"
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      <text
                        x="36"
                        y="15"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="bold"
                        fill="#ffffff"
                        className="pointer-events-none font-sans"
                      >
                        BẮT ĐẦU
                      </text>
                    </g>
                  )}

                  {isTarget && (
                    <g transform={`translate(${cx - 30}, ${cy - 52})`}>
                      <rect
                        width="60"
                        height="22"
                        rx="11"
                        fill="#ef4444"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      <text
                        x="30"
                        y="15"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="bold"
                        fill="#ffffff"
                        className="pointer-events-none font-sans"
                      >
                        ĐÍCH ⚑
                      </text>
                    </g>
                  )}

                  {/* Step sequence indicator */}
                  {isInCurrentPath && !isStart && (
                    <g transform={`translate(${cx + 18}, ${cy - 30})`}>
                      <circle cx="10" cy="10" r="11" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                      <text
                        x="10"
                        y="14"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="bold"
                        fill="#ffffff"
                        className="pointer-events-none font-sans"
                      >
                        {pathIndex}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Điểm bắt đầu ({startNodeId})
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Điểm đích ({targetNodeId})
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-5 rounded-full bg-indigo-600" /> Đường đang đi
            </span>
          </div>
          <span className="text-slate-400">Nhấn vào đảo liền kề để di chuyển</span>
        </div>
      </div>

      {/* CURRENT PATH STATUS PANEL */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Đường đang đi:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {currentPath.map((node, i) => (
                  <React.Fragment key={node}>
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-200 text-xs font-black text-indigo-900 shadow-2xs">
                      {node}
                    </span>
                    {i < currentPath.length - 1 && (
                      <span className="text-xs font-bold text-slate-400">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="text-xs text-slate-600">
              Số đoạn đường đã đi:{" "}
              <strong className="text-indigo-700 font-extrabold text-sm">
                {currentPath.length - 1} đoạn
              </strong>
            </div>
          </div>

          {/* Quick Undo button if more than 1 node */}
          {currentPath.length > 1 && !isAtTarget && (
            <button
              onClick={() => {
                const nextPath = currentPath.slice(0, -1);
                setCurrentPath(nextPath);
                setFeedback(null);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              ↶ Lùi 1 bước
            </button>
          )}
        </div>

        {/* Dynamic Feedback Message */}
        {feedback && (
          <div
            className={`flex items-center gap-2 rounded-lg p-2.5 text-xs font-medium ${
              feedback.type === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
                : feedback.type === "error"
                ? "border border-rose-200 bg-rose-50 text-rose-900"
                : "border border-sky-200 bg-sky-50 text-sky-900"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : feedback.type === "error" ? (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            ) : (
              <Footprints className="h-4 w-4 text-sky-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}
      </div>

      {/* MULTIPLE ATTEMPTS HISTORY */}
      {attempts.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Các đường đã thử ({attempts.length}):
          </span>
          <div className="flex flex-wrap gap-2">
            {attempts.map((attempt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentPath(attempt.path);
                  setFeedback({
                    type: "info",
                    text: `Đang xem lại đường ${attempt.path.join(" → ")} (${attempt.length} đoạn).`,
                  });
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 transition font-medium"
              >
                <span>✓ {attempt.path.join("-")}</span>
                <span className="rounded bg-white px-1 font-mono font-bold text-indigo-700 border border-slate-200">
                  {attempt.length} đoạn
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* LEARN MODE: SHORTEST PATHS BREAKDOWN & TEACHING POINT */}
      {mode === "learn" && showShortestAnalysis && (
        <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="flex items-center justify-between border-b border-emerald-200/70 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Phân tích các đường đi ngắn nhất từ {startNodeId} đến {targetNodeId}</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800">
              Độ dài nhỏ nhất: <strong>{shortestAnalysis.shortestLength} đoạn</strong> | Số đường ngắn nhất: <strong>{shortestAnalysis.shortestCount} đường</strong>
            </span>
          </div>

          {/* List of shortest paths to toggle highlight */}
          <div className="grid gap-2 sm:grid-cols-3">
            {shortestAnalysis.shortestPaths.map((p, idx) => {
              const isSelected = selectedShortestIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedShortestIndex(idx)}
                  className={`rounded-xl border p-2.5 text-left text-xs transition active:scale-95 ${
                    isSelected
                      ? "border-emerald-500 bg-white shadow-xs ring-2 ring-emerald-300"
                      : "border-emerald-200 bg-emerald-100/40 text-slate-700 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-emerald-900 mb-1">
                    <span>Đường {idx + 1}</span>
                    <span className="font-mono text-[11px] text-emerald-700">3 đoạn</span>
                  </div>
                  <div className="font-mono font-extrabold text-slate-800">
                    {p.join(" → ")}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-xl border border-emerald-300 bg-white p-3 text-center space-y-1">
            <p className="text-xs font-bold text-emerald-900">
              Teaching Point: “Bài toán gồm các địa điểm và đường nối thường có thể biểu diễn bằng graph. Đường đi ngắn nhất là đường dùng ít cạnh nhất.”
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
