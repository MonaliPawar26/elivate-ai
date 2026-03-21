import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import { getAnalysisResult } from "@/lib/analysisStore";
import {
  CheckCircle2, XCircle, Lightbulb, GitBranch, GraduationCap,
  TrendingUp, AlertTriangle, Target, ArrowRight, Shield, Clock, Zap
} from "lucide-react";

const severityColor = {
  low: "bg-skill-matched/10 text-skill-matched border-skill-matched/20",
  medium: "bg-accent/10 text-accent border-accent/20",
  high: "bg-node-advanced/10 text-node-advanced border-node-advanced/20",
  critical: "bg-destructive/10 text-destructive border-destructive/20",
};

const priorityColor = {
  low: "text-skill-matched",
  medium: "text-accent",
  high: "text-destructive",
};

const ReadinessGauge = ({ score, label, delay = 0 }: { score: number; label: string; delay?: number }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="relative w-16 h-16">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none" stroke="hsl(var(--muted))" strokeWidth="3"
        />
        <motion.path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none" stroke="hsl(var(--primary))" strokeWidth="3"
          initial={{ strokeDasharray: "0, 100" }}
          whileInView={{ strokeDasharray: `${score}, 100` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: delay + 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.6 }}
        className="absolute inset-0 flex items-center justify-center text-sm font-bold counter-animate"
      >
        {score}
      </motion.span>
    </div>
    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{label}</span>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

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
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold mb-2"
            >
              Skill Analysis Dashboard
            </motion.h1>
            <p className="text-muted-foreground">Comprehensive skill gap breakdown, readiness scoring, and improvement insights.</p>
          </div>
        </ScrollReveal>

        {/* Readiness Score Section */}
        <ScrollReveal delay={0.04}>
          <motion.div
            whileHover={{ scale: 1.005 }}
            className="glass-card-glow p-6 mb-8"
          >
            <div className="flex items-center gap-2 mb-5">
              <Shield className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Readiness Assessment</h3>
            </div>
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <div className="flex items-baseline gap-3 mb-3">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="text-5xl font-extrabold text-primary counter-animate"
                  >
                    {readinessScore.overall}%
                  </motion.span>
                  <span className="text-sm text-muted-foreground">Overall Readiness</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                  {readinessScore.summary || "Complete analysis to see your readiness assessment."}
                </p>
              </div>
              <div className="flex gap-6">
                <ReadinessGauge score={readinessScore.technical} label="Technical" delay={0} />
                <ReadinessGauge score={readinessScore.experience} label="Experience" delay={0.1} />
                <ReadinessGauge score={readinessScore.education} label="Education" delay={0.2} />
              </div>
            </div>
          </motion.div>
        </ScrollReveal>

        {/* Score Overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Match Score", value: `${matchScore}%`, color: "text-primary" },
            { label: "Skills Matched", value: matchedSkills.length.toString(), color: "text-skill-matched" },
            { label: "Skills Missing", value: missingSkills.length.toString(), color: "text-skill-missing" },
            { label: "Total Required", value: requiredSkills.length.toString(), color: "text-foreground" },
          ].map((stat) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="glass-card-elevated p-5 text-center"
              >
                <div className={`stat-value ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1.5">{stat.label}</div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Matched Skills */}
          <ScrollReveal delay={0.08}>
            <div className="glass-card-elevated p-6 h-full">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle2 className="w-4 h-4 text-skill-matched" />
                <h3 className="font-semibold text-sm">Matched Skills</h3>
                <span className="ml-auto text-xs text-muted-foreground mono">{matchedSkills.length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    className="skill-badge-matched"
                  >
                    {skill}
                  </motion.span>
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
                <span className="ml-auto text-xs text-muted-foreground mono">{missingSkills.length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    className="skill-badge-missing"
                  >
                    {skill}
                  </motion.span>
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
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="text-sm p-3 rounded-lg bg-muted/40"
                    >
                      <div className="font-medium">{edu.degree} in {edu.field}</div>
                      <div className="text-muted-foreground text-xs mt-0.5">{edu.institution}{edu.year ? ` · ${edu.year}` : ""}</div>
                    </motion.li>
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
                <AlertTriangle className="w-4 h-4 text-accent" />
                <h3 className="font-semibold text-sm">Performance Gaps</h3>
                <span className="ml-auto text-xs text-muted-foreground mono">{performanceGaps.length} gaps</span>
              </div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-3"
              >
                {performanceGaps.map((gap, i) => (
                  <motion.div key={i} variants={itemVariants} className={`rounded-xl border p-4 ${severityColor[gap.gapSeverity]}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{gap.skill}</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-background/50">{gap.gapSeverity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs mb-2 opacity-80">
                      <span className="px-1.5 py-0.5 rounded bg-background/50">{gap.currentLevel === "none" ? "Not found" : gap.currentLevel}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="px-1.5 py-0.5 rounded bg-background/50">{gap.requiredLevel}</span>
                    </div>
                    <p className="text-xs opacity-70 leading-relaxed">{gap.description}</p>
                  </motion.div>
                ))}
              </motion.div>
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
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-4"
              >
                {improvementInsights.map((insight, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    whileHover={{ scale: 1.005 }}
                    className="border border-border rounded-xl p-5 transition-all hover:border-primary/20 hover:bg-primary/[0.01]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-sm">{insight.area}</h4>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold capitalize ${priorityColor[insight.priority]}`}>
                          {insight.priority}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mono">
                          <Clock className="w-3 h-3" /> {insight.estimatedTimeWeeks}w
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{insight.insight}</p>
                    <ul className="space-y-2">
                      {insight.actionItems.map((item, j) => (
                        <li key={j} className="text-xs text-muted-foreground flex items-start gap-2.5 pl-1">
                          <Zap className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </motion.div>
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
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="text-sm text-muted-foreground flex gap-3 p-2 rounded-lg hover:bg-muted/40 transition-colors"
                  >
                    <span className="text-primary font-bold mono text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className="leading-relaxed">{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Skill Breakdown by Level */}
          <ScrollReveal delay={0.32}>
            <div className="glass-card-elevated p-6 h-full">
              <h3 className="font-semibold mb-5">Your Skills by Level</h3>
              <div className="space-y-5">
                {(["beginner", "intermediate", "advanced"] as const).map((level) => {
                  const skills = resumeSkills.filter((s) => s.level === level);
                  const colorMap = {
                    beginner: "bg-node-beginner/15 text-node-beginner border-node-beginner/20",
                    intermediate: "bg-node-intermediate/15 text-node-intermediate border-node-intermediate/20",
                    advanced: "bg-node-advanced/15 text-node-advanced border-node-advanced/20",
                  };
                  return (
                    <div key={level}>
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: level === "beginner" ? "hsl(199, 89%, 48%)" : level === "intermediate" ? "hsl(38, 92%, 55%)" : "hsl(340, 82%, 52%)" }} />
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground capitalize">{level}</div>
                        <span className="text-xs text-muted-foreground mono ml-auto">{skills.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((s, i) => (
                          <motion.span
                            key={s.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.03 }}
                            className={`skill-badge border ${colorMap[level]}`}
                          >
                            {s.name}
                          </motion.span>
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
          <div className="text-center mt-10">
            <Link to="/roadmap">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} className="inline-block">
                <Button variant="hero" size="lg" className="h-13 px-10 text-base shadow-lg" style={{ boxShadow: "0 8px 30px -6px hsl(162 63% 41% / 0.4)" }}>
                  View Learning Roadmap <GitBranch className="w-4 h-4" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Dashboard;
