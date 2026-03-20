import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { getAnalysisResult } from "@/lib/analysisStore";
import { CheckCircle2, XCircle, Clock, ArrowRight, GitBranch, Lightbulb } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const result = getAnalysisResult();

  useEffect(() => {
    if (!result) navigate("/analyze");
  }, [result, navigate]);

  if (!result) return null;

  const { matchedSkills, missingSkills, matchScore, resumeSkills, requiredSkills, recommendations } = result;

  return (
    <div className="min-h-screen pt-24 pb-16 section-padding">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Skill Analysis Dashboard</h1>
            <p className="text-muted-foreground">Your personalized skill gap breakdown and learning recommendations.</p>
          </div>
        </ScrollReveal>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Match Score", value: `${matchScore}%`, color: "text-primary" },
            { label: "Skills Matched", value: matchedSkills.length.toString(), color: "text-skill-matched" },
            { label: "Skills Missing", value: missingSkills.length.toString(), color: "text-skill-missing" },
            { label: "Total Required", value: requiredSkills.length.toString(), color: "text-foreground" },
          ].map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.06}>
              <div className="glass-card-elevated p-6 text-center">
                <div className={`stat-value ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1.5">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Matched Skills */}
          <ScrollReveal delay={0.1}>
            <div className="glass-card-elevated p-6">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle2 className="w-4 h-4 text-skill-matched" />
                <h3 className="font-semibold text-sm">Matched Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((skill) => (
                  <span key={skill} className="skill-badge-matched">{skill}</span>
                ))}
                {matchedSkills.length === 0 && (
                  <p className="text-sm text-muted-foreground">No matching skills found</p>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Missing Skills */}
          <ScrollReveal delay={0.16}>
            <div className="glass-card-elevated p-6">
              <div className="flex items-center gap-2 mb-5">
                <XCircle className="w-4 h-4 text-skill-missing" />
                <h3 className="font-semibold text-sm">Missing Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill) => (
                  <span key={skill} className="skill-badge-missing">{skill}</span>
                ))}
                {missingSkills.length === 0 && (
                  <p className="text-sm text-muted-foreground">No gaps — you're fully qualified!</p>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Recommendations */}
          <ScrollReveal delay={0.22}>
            <div className="glass-card-elevated p-6">
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
        </div>

        {/* Skill Breakdown by Level */}
        <ScrollReveal delay={0.28}>
          <div className="glass-card-elevated p-6 mt-6">
            <h3 className="font-semibold mb-5">Your Skills by Level</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(["beginner", "intermediate", "advanced"] as const).map((level) => {
                const skills = resumeSkills.filter((s) => s.level === level);
                const colorMap = { beginner: "bg-node-beginner/15 text-node-beginner", intermediate: "bg-node-intermediate/15 text-node-intermediate", advanced: "bg-node-advanced/15 text-node-advanced" };
                return (
                  <div key={level}>
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 capitalize">{level}</div>
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

        <ScrollReveal delay={0.34}>
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
