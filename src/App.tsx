import React, { useState, useEffect } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { WelcomePage } from "./pages/WelcomePage";
import { CoursePage } from "./pages/CoursePage";
import { DiagnosticIntroPage } from "./pages/DiagnosticIntroPage";
import { DiagnosticPage } from "./pages/DiagnosticPage";
import { ResultPage } from "./pages/ResultPage";
import { ReviewPage } from "./pages/ReviewPage";
import { DIAGNOSTIC_QUESTIONS } from "./data/diagnostic";
import { AVAILABLE_PART_B_QUESTIONS } from "./data/practice";
import { ALL_MODULE0_QUESTIONS, getQuestionById } from "./data/allQuestions";
import { loadDiagnosticState, loadPracticeState } from "./utils/storage";

export default function App() {
  // Initialize route from current window.location.pathname
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const p = window.location.pathname || "/";
    return p;
  });

  // Track popstate for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || "/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path: string) => {
    try {
      window.history.pushState({}, "", path);
    } catch {
      // ignore if iframe security blocks pushState
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Find next unanswered question or first question
  const getNextQuestionId = (): string => {
    const diagState = loadDiagnosticState();
    // Check Part A first
    for (const q of DIAGNOSTIC_QUESTIONS) {
      if (!diagState.answers[q.id]) {
        return q.id;
      }
    }
    // Then check Part B available questions
    const practiceState = loadPracticeState();
    const partBAvailable = AVAILABLE_PART_B_QUESTIONS.map((q) => q.id);
    for (const id of partBAvailable) {
      if (!practiceState.answers[id]) {
        return id;
      }
    }
    return DIAGNOSTIC_QUESTIONS[0].id;
  };

  // Route matching logic
  const renderRoute = () => {
    const path = currentPath;

    // 1. Welcome Page: /
    if (path === "/" || path === "") {
      return <WelcomePage onNavigate={navigate} />;
    }

    // 2. Course Roadmap: /course
    if (path.startsWith("/course")) {
      return <CoursePage onNavigate={navigate} />;
    }

    // 3. Diagnostic Question Page: /diagnostic/:questionId (e.g. /diagnostic/D01, /diagnostic/D13)
    if (path.startsWith("/diagnostic/")) {
      const qId = path.replace("/diagnostic/", "").trim();
      const validQ = getQuestionById(qId);
      const activeQId = validQ ? validQ.id : DIAGNOSTIC_QUESTIONS[0].id;

      return (
        <DiagnosticPage
          currentQuestionId={activeQId}
          onSelectQuestion={(nextQId) => navigate(`/diagnostic/${nextQId}`)}
          onFinishDiagnostic={() => navigate("/result")}
          onNavigate={navigate}
        />
      );
    }

    // 4. Diagnostic Intro Page: /diagnostic
    if (path === "/diagnostic") {
      return (
        <DiagnosticIntroPage
          onStart={() => {
            const nextQId = getNextQuestionId();
            navigate(`/diagnostic/${nextQId}`);
          }}
          onNavigate={navigate}
        />
      );
    }

    // 5. Result Page: /result
    if (path.startsWith("/result")) {
      return <ResultPage onNavigate={navigate} />;
    }

    // 6. Review Page: /review
    if (path.startsWith("/review")) {
      return <ReviewPage onNavigate={navigate} />;
    }

    // Default Fallback: WelcomePage
    return <WelcomePage onNavigate={navigate} />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        onResetProgress={() => navigate("/")}
      />

      <main className="flex-1">
        {renderRoute()}
      </main>

      <Footer />
    </div>
  );
}
