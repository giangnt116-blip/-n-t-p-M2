export interface SkillScore {
  skillId: string;
  skillName: string;
  vietnameseLabel: string;
  totalQuestions: number;
  correctQuestions: number;
  percentage: number;
  category: "strength" | "growth";
  recommendation: string;
}

export interface DiagnosticSummary {
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  accuracyRate: number;
  totalHintsUsed: number;
  totalAttempts: number;
  totalTimeSeconds: number;
  isCompleted: boolean;
  skillScores: SkillScore[];
  strengths: SkillScore[];
  growthAreas: SkillScore[];
}
