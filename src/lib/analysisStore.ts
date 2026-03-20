// Simple in-memory store for analysis results (persists across route changes)
export interface SkillItem {
  name: string;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
}

export interface AnalysisResult {
  resumeSkills: SkillItem[];
  requiredSkills: SkillItem[];
  matchedSkills: string[];
  missingSkills: string[];
  matchScore: number;
  roadmap: RoadmapNode[];
  recommendations: string[];
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
