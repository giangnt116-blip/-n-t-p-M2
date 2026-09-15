import { DIAGNOSTIC_QUESTIONS } from "../data/diagnostic";
import { CORE_SKILL_GROUPS, SKILLS_DICTIONARY } from "../data/skills";
import { DiagnosticSummary, SkillScore } from "../types/result";
import { evaluateAnswer } from "./scoring";
import { DiagnosticStorageState } from "./storage";

export function analyzeDiagnosticPerformance(
  state: DiagnosticStorageState
): DiagnosticSummary {
  const totalQuestions = DIAGNOSTIC_QUESTIONS.length;
  let answeredCount = 0;
  let correctCount = 0;
  let totalAttempts = 0;
  let totalHintsUsed = 0;
  let totalTimeSeconds = 0;

  // Track skill stats
  const skillStats: Record<string, { total: number; correct: number }> = {};
  CORE_SKILL_GROUPS.forEach((group) => {
    skillStats[group.id] = { total: 0, correct: 0 };
  });

  DIAGNOSTIC_QUESTIONS.forEach((q) => {
    const userAnswer = state.answers[q.id];
    const isAnswered = userAnswer !== undefined && userAnswer !== null && userAnswer !== "";
    if (isAnswered) answeredCount++;

    const isCorrect = evaluateAnswer(q, userAnswer);
    if (isCorrect) correctCount++;

    totalAttempts += state.attemptCount[q.id] || 0;
    totalHintsUsed += (state.hintsUsed[q.id] || []).length;
    totalTimeSeconds += state.timeSpent[q.id] || 0;

    // Attribute to core skills
    q.skills.forEach((sk) => {
      // Find matching core group
      const coreGroup = CORE_SKILL_GROUPS.find(
        (cg) => cg.id === sk || sk.includes(cg.id)
      );
      if (coreGroup && skillStats[coreGroup.id]) {
        skillStats[coreGroup.id].total++;
        if (isCorrect) {
          skillStats[coreGroup.id].correct++;
        }
      }
    });
  });

  const skillScores: SkillScore[] = CORE_SKILL_GROUPS.map((group) => {
    const stats = skillStats[group.id] || { total: 0, correct: 0 };
    const percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    const isStrength = percentage >= 60;
    const skillDict = SKILLS_DICTIONARY[group.id];

    return {
      skillId: group.id,
      skillName: group.label,
      vietnameseLabel: group.vietnamese,
      totalQuestions: stats.total,
      correctQuestions: stats.correct,
      percentage,
      category: isStrength ? "strength" : "growth",
      recommendation: isStrength
        ? `Nắm vững tư duy ${group.vietnamese}. Đã sẵn sàng mở rộng các bài toán nâng cao!`
        : `Nên luyện thêm ${group.vietnamese} thông qua các bài thực hành mô phỏng từng bước.`,
    };
  });

  // Sort strengths (highest percentage first) and growth areas (lowest percentage first)
  const strengths = skillScores
    .filter((s) => s.percentage >= 50)
    .sort((a, b) => b.percentage - a.percentage);

  const growthAreas = skillScores
    .filter((s) => s.percentage < 100)
    .sort((a, b) => a.percentage - b.percentage);

  // If all are 100%, growthAreas can be empty or highlight advanced challenge
  // If none are >= 50%, top scoring becomes relative strength
  const finalStrengths =
    strengths.length > 0
      ? strengths.slice(0, 3)
      : [...skillScores].sort((a, b) => b.percentage - a.percentage).slice(0, 2);

  const finalGrowthAreas =
    growthAreas.length > 0
      ? growthAreas.slice(0, 3)
      : [{
          skillId: "all_mastered",
          skillName: "Tư duy Toàn diện",
          vietnameseLabel: "Chinh phục Vòng 1",
          totalQuestions: totalQuestions,
          correctQuestions: correctCount,
          percentage: 100,
          category: "growth" as const,
          recommendation: "Chúc mừng em! Đã sẵn sàng mở khóa toàn bộ lộ trình 12 tuần.",
        }];

  return {
    totalQuestions,
    answeredCount,
    correctCount,
    accuracyRate: totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0,
    totalHintsUsed,
    totalAttempts,
    totalTimeSeconds,
    isCompleted: state.completed,
    skillScores,
    strengths: finalStrengths,
    growthAreas: finalGrowthAreas,
  };
}
