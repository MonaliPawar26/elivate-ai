// Simple in-memory store for analysis results (persists across route changes)
export interface SkillItem {
  name: string;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
}

export interface EducationItem {
  degree: string;
  field: string;
  institution: string;
  year?: string;
}

export interface PerformanceGap {
  skill: string;
  currentLevel: "none" | "beginner" | "intermediate";
  requiredLevel: "beginner" | "intermediate" | "advanced";
  gapSeverity: "low" | "medium" | "high" | "critical";
  description: string;
}

export interface ReadinessScore {
  overall: number; // 0-100
  technical: number;
  experience: number;
  education: number;
  summary: string;
}

export interface ImprovementInsight {
  area: string;
  insight: string;
  actionItems: string[];
  priority: "low" | "medium" | "high";
  estimatedTimeWeeks: number;
}

export interface AnalysisResult {
  resumeSkills: SkillItem[];
  requiredSkills: SkillItem[];
  matchedSkills: string[];
  missingSkills: string[];
  matchScore: number;
  roadmap: RoadmapNode[];
  recommendations: string[];
  education: EducationItem[];
  performanceGaps: PerformanceGap[];
  readinessScore: ReadinessScore;
  improvementInsights: ImprovementInsight[];
}

export interface RoadmapNode {
  id: string;
  skill: string;
  level: "beginner" | "intermediate" | "advanced";
  status: "completed" | "in-progress" | "recommended" | "locked";
  dependencies: string[];
  priority: number;
  estimatedHours: number;
}

let currentResult: AnalysisResult | null = null;

export const setAnalysisResult = (result: AnalysisResult) => {
  currentResult = result;
};

export const getAnalysisResult = (): AnalysisResult | null => currentResult;
