import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { getAnalysisResult } from "@/lib/analysisStore";
import {
  CheckCircle2, XCircle, Lightbulb, GitBranch, GraduationCap,
  TrendingUp, AlertTriangle, Target, ArrowRight, Shield, Clock, Zap
} from "lucide-react";

const severityColor = {
  low: "bg-green-500/15 text-green-400 border-green-500/20",
  medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  high: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  critical: "bg-red-500/15 text-red-400 border-red-500/20",
};

const priorityColor = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-red-400",
};

const ReadinessGauge = ({ score, label }: { score: number; label: string }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="relative w-16 h-16">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none" stroke="hsl(var(--muted))" strokeWidth="3"
        />
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none" stroke="hsl(var(--primary))" strokeWidth="3"
          strokeDasharray={`${score}, 100`}
          className="transition-all duration-1000"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{score}</span>
    </div>
    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const result = getAnalysisResult();

  useEffect(() => {
    if (!result) navigate("/analyze");
  }, [result, navigate]);

  if (!result) return null;

  const {
    matchedSkills, missingSkills, matchScore, resumeSkills, requiredSkills,
    recommendations, education = [], performanceGaps = [],
    readinessScore = { overall: matchScore, technical: 0, experience: 0, education: 0, summary: "" },
    improvementInsights = [],
  } = result;

  return (
    <div className="min-h-screen pt-24 pb-16 section-padding">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Skill Analysis Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive skill gap breakdown, readiness scoring, and improvement insights.</p>
          </div>
        </ScrollReveal>

        {/* Readiness Score Section */}
        <ScrollReveal delay={0.04}>
          <div className="glass-card-elevated p-6 mb-8">
            <div className="flex items-center gap-2 mb-5">
              <Shield className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Readiness Assessment</h3>
            </div>
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-5xl font-extrabold text-primary">{readinessScore.overall}%</span>
                  <span className="text-sm text-muted-foreground">Overall Readiness</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                  {readinessScore.summary || "Complete analysis to see your readiness assessment."}
                </p>
              </div>
              <div className="flex gap-6">
                <ReadinessGauge score={readinessScore.technical} label="Technical" />
                <ReadinessGauge score={readinessScore.experience} label="Experience" />
                <ReadinessGauge score={readinessScore.education} label="Education" />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Score Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Match Score", value: `${matchScore}%`, color: "text-primary" },
            { label: "Skills Matched", value: matchedSkills.length.toString(), color: "text-skill-matched" },
            { label: "Skills Missing", value: missingSkills.length.toString(), color: "text-skill-missing" },
            { label: "Total Required", value: requiredSkills.length.toString(), color: "text-foreground" },
          ].map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.04}>
              <div className="glass-card-elevated p-5 text-center">
                <div className={`stat-value ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1.5">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Matched Skills */}
          <ScrollReveal delay={0.08}>
            <div className="glass-card-elevated p-6 h-full">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle2 className="w-4 h-4 text-skill-matched" />
                <h3 className="font-semibold text-sm">Matched Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((skill) => (
                  <span key={skill} className="skill-badge-matched">{skill}</span>
                ))}
                {matchedSkills.length === 0 && <p className="text-sm text-muted-foreground">No matching skills found</p>}
              </div>
            </div>
          </ScrollReveal>

          {/* Missing Skills */}
          <ScrollReveal delay={0.12}>
            <div className="glass-card-elevated p-6 h-full">
              <div className="flex items-center gap-2 mb-5">
                <XCircle className="w-4 h-4 text-skill-missing" />
                <h3 className="font-semibold text-sm">Missing Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill) => (
                  <span key={skill} className="skill-badge-missing">{skill}</span>
                ))}
                {missingSkills.length === 0 && <p className="text-sm text-muted-foreground">No gaps — you're fully qualified!</p>}
              </div>
            </div>
          </ScrollReveal>

          {/* Education */}
          <ScrollReveal delay={0.16}>
            <div className="glass-card-elevated p-6 h-full">
              <div className="flex items-center gap-2 mb-5">
                <GraduationCap className="w-4 h-4 text-accent" />
                <h3 className="font-semibold text-sm">Education Extracted</h3>
              </div>
              {education.length > 0 ? (
                <ul className="space-y-3">
                  {education.map((edu, i) => (
                    <li key={i} className="text-sm">
                      <div className="font-medium">{edu.degree} in {edu.field}</div>
                      <div className="text-muted-foreground text-xs">{edu.institution}{edu.year ? ` · ${edu.year}` : ""}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No education details detected</p>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Performance Gaps */}
        {performanceGaps.length > 0 && (
          <ScrollReveal delay={0.2}>
            <div className="glass-card-elevated p-6 mb-6">
              <div className="flex items-center gap-2 mb-5">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <h3 className="font-semibold text-sm">Performance Gaps</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {performanceGaps.map((gap, i) => (
                  <div key={i} className={`rounded-lg border p-4 ${severityColor[gap.gapSeverity]}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{gap.skill}</span>
                      <span className="text-[10px] uppercase tracking-wider font-medium">{gap.gapSeverity}</span>
                    </div>
                    <div className="text-xs mb-2 opacity-80">
                      {gap.currentLevel === "none" ? "Not found" : gap.currentLevel} → {gap.requiredLevel}
                    </div>
                    <p className="text-xs opacity-70">{gap.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Improvement Insights */}
        {improvementInsights.length > 0 && (
          <ScrollReveal delay={0.24}>
            <div className="glass-card-elevated p-6 mb-6">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">Improvement Insights</h3>
              </div>
              <div className="space-y-4">
                {improvementInsights.map((insight, i) => (
                  <div key={i} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{insight.area}</h4>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium ${priorityColor[insight.priority]}`}>
                          {insight.priority} priority
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> ~{insight.estimatedTimeWeeks}w
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{insight.insight}</p>
                    <ul className="space-y-1.5">
                      {insight.actionItems.map((item, j) => (
                        <li key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                          <Zap className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recommendations */}
          <ScrollReveal delay={0.28}>
            <div className="glass-card-elevated p-6 h-full">
              <div className="flex items-center gap-2 mb-5">
                <Lightbulb className="w-4 h-4 text-accent" />
                <h3 className="font-semibold text-sm">Recommendations</h3>
              </div>
              <ul className="space-y-3">
                {recommendations.slice(0, 5).map((rec, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary font-medium mono text-xs mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Skill Breakdown by Level */}
          <ScrollReveal delay={0.32}>
            <div className="glass-card-elevated p-6 h-full">
              <h3 className="font-semibold mb-5">Your Skills by Level</h3>
              <div className="space-y-4">
                {(["beginner", "intermediate", "advanced"] as const).map((level) => {
                  const skills = resumeSkills.filter((s) => s.level === level);
                  const colorMap = {
                    beginner: "bg-node-beginner/15 text-node-beginner",
                    intermediate: "bg-node-intermediate/15 text-node-intermediate",
                    advanced: "bg-node-advanced/15 text-node-advanced",
                  };
                  return (
                    <div key={level}>
                      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 capitalize">{level}</div>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((s) => (
                          <span key={s.name} className={`skill-badge ${colorMap[level]}`}>{s.name}</span>
                        ))}
                        {skills.length === 0 && <span className="text-xs text-muted-foreground">None detected</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.36}>
          <div className="text-center mt-8">
            <Link to="/roadmap">
              <Button variant="hero" size="lg" className="h-12 px-8 text-base">
                View Learning Roadmap <GitBranch className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Dashboard;
