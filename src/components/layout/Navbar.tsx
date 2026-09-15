import React from "react";
import { Brain, Map, PlayCircle, BookOpen, RotateCcw } from "lucide-react";
import { loadDiagnosticState, resetDiagnosticState } from "../../utils/storage";

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  onResetProgress?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate, onResetProgress }) => {
  const state = loadDiagnosticState();
  const answeredCount = Object.keys(state.answers).length;

  const handleReset = () => {
    if (window.confirm("Em có chắc muốn làm lại bài khảo sát từ đầu không?")) {
      resetDiagnosticState();
      if (onResetProgress) {
        onResetProgress();
      } else {
        navigate("/");
      }
    }
  };

  const navItems = [
    { path: "/", label: "Khám phá", icon: Brain },
    { path: "/course", label: "Lộ trình 12 tuần", icon: Map },
    { path: "/diagnostic", label: "Thử thách M0", icon: PlayCircle },
    { path: "/review", label: "Xem lại & Luyện", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 text-left transition hover:opacity-90 focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-sm ring-2 ring-indigo-200">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-slate-900 sm:text-lg">
                M2 LOGIC LAB
              </span>
              <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-indigo-700">
                CLASS 6
              </span>
            </div>
            <p className="hidden text-[11px] font-medium text-slate-500 sm:block">
              Học tư duy bằng mô phỏng
            </p>
          </div>
        </button>

        {/* Navigation links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/"
                ? currentPath === "/"
                : currentPath.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right action & progress status */}
        <div className="flex items-center gap-2.5">
          {answeredCount > 0 && (
            <button
              onClick={() => navigate(state.completed ? "/result" : "/diagnostic")}
              className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
              title="Tiến trình làm bài"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-indigo-700">{answeredCount}/12</span>
              <span className="hidden sm:inline">đã trả lời</span>
            </button>
          )}

          {answeredCount > 0 && (
            <button
              onClick={handleReset}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition"
              title="Đặt lại bài làm"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={() => navigate("/diagnostic")}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition"
          >
            <span>🚀</span>
            <span className="hidden sm:inline">Vào thử thách</span>
            <span className="sm:hidden">Làm bài</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex items-center justify-around border-t border-slate-100 bg-slate-50/80 px-2 py-2 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === "/"
              ? currentPath === "/"
              : currentPath.startsWith(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium ${
                isActive ? "font-bold text-indigo-700" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
