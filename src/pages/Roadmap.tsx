import { useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MarkerType,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { getAnalysisResult, RoadmapNode } from "@/lib/analysisStore";
import { motion } from "framer-motion";
import {
  CheckCircle2, Clock, ArrowRight, Lock, BookOpen,
  Target, TrendingUp, ArrowLeft, BarChart3
} from "lucide-react";

const statusConfig = {
  completed: { bg: "bg-skill-matched/15", border: "border-skill-matched/40", icon: CheckCircle2, color: "text-skill-matched", label: "Completed", glow: "shadow-[0_0_20px_-4px_hsl(142_71%_45%/0.3)]" },
  "in-progress": { bg: "bg-accent/15", border: "border-accent/40", icon: Clock, color: "text-accent", label: "In Progress", glow: "shadow-[0_0_20px_-4px_hsl(38_92%_55%/0.3)]" },
  recommended: { bg: "bg-primary/10", border: "border-primary/30", icon: ArrowRight, color: "text-primary", label: "Recommended", glow: "shadow-[0_0_20px_-4px_hsl(162_63%_41%/0.3)]" },
  locked: { bg: "bg-muted", border: "border-border", icon: Lock, color: "text-muted-foreground", label: "Locked", glow: "" },
};

const levelColor = {
  beginner: "hsl(199, 89%, 48%)",
  intermediate: "hsl(38, 92%, 55%)",
  advanced: "hsl(340, 82%, 52%)",
};

const levelBadge = {
  beginner: "bg-node-beginner/15 text-node-beginner border-node-beginner/25",
  intermediate: "bg-node-intermediate/15 text-node-intermediate border-node-intermediate/25",
  advanced: "bg-node-advanced/15 text-node-advanced border-node-advanced/25",
};

function SkillNode({ data }: { data: RoadmapNode }) {
  const cfg = statusConfig[data.status];
  const Icon = cfg.icon;
  const progress = data.status === "completed" ? 100 : data.status === "in-progress" ? 50 : 0;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`px-5 py-4 rounded-2xl border-2 ${cfg.bg} ${cfg.border} ${cfg.glow} min-w-[200px] max-w-[240px] transition-all duration-300 hover:scale-105 cursor-default`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center`}>
            <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
          </div>
          <span className="text-sm font-bold text-foreground leading-tight">{data.skill}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${levelBadge[data.level]}`}>
          {data.level}
        </span>
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" /> {data.estimatedHours}h
        </span>
        <span className="text-[10px] text-muted-foreground flex items-center gap-1 ml-auto">
          P{data.priority}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-border/60 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ backgroundColor: levelColor[data.level] }}
        />
      </div>

      {data.status !== "locked" && (
        <div className="mt-2 text-[10px] text-muted-foreground flex items-center gap-1">
          <BookOpen className="w-2.5 h-2.5" />
          {data.status === "completed" ? "Skill verified" : data.status === "in-progress" ? "Currently learning" : "Start learning →"}
        </div>
      )}
    </motion.div>
  );
}

const nodeTypes = { skillNode: SkillNode };

const Roadmap = () => {
  const navigate = useNavigate();
  const result = getAnalysisResult();

  useEffect(() => {
    if (!result) navigate("/analyze");
  }, [result, navigate]);

  const { nodes, edges } = useMemo(() => {
    if (!result) return { nodes: [], edges: [] };

    const roadmap = result.roadmap;
    const levelCols = { beginner: 0, intermediate: 1, advanced: 2 };
    const levelCounters = { beginner: 0, intermediate: 0, advanced: 0 };

    const flowNodes: Node[] = roadmap.map((rn) => {
      const col = levelCols[rn.level];
      const row = levelCounters[rn.level]++;
      return {
        id: rn.id,
        type: "skillNode",
        position: { x: col * 300 + 40, y: row * 140 + 80 },
        data: rn,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
    });

    const flowEdges: Edge[] = roadmap.flatMap((rn) =>
      rn.dependencies.map((dep) => ({
        id: `${dep}-${rn.id}`,
        source: dep,
        target: rn.id,
        type: "smoothstep",
        animated: rn.status === "in-progress" || rn.status === "recommended",
        markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: "hsl(var(--border))" },
        style: {
          strokeWidth: 2,
          stroke: rn.status === "completed" ? "hsl(142, 71%, 45%)" : "hsl(var(--border))",
        },
      }))
    );

    return { nodes: flowNodes, edges: flowEdges };
  }, [result]);

  if (!result) return null;

  const roadmap = result.roadmap;
  const totalHours = roadmap.reduce((sum, n) => sum + n.estimatedHours, 0);
  const completedCount = roadmap.filter((n) => n.status === "completed").length;
  const inProgressCount = roadmap.filter((n) => n.status === "in-progress").length;
  const recommendedCount = roadmap.filter((n) => n.status === "recommended").length;

  return (
    <div className="min-h-screen pt-24 pb-16 section-padding">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <h1 className="text-3xl font-bold">Learning Roadmap</h1>
              </div>
              <p className="text-muted-foreground ml-7">Your adaptive skill pathway — drag and zoom to explore the graph.</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Roadmap Stats */}
        <ScrollReveal delay={0.06}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {[
              { label: "Total Skills", value: roadmap.length, icon: Target, color: "text-foreground" },
              { label: "Completed", value: completedCount, icon: CheckCircle2, color: "text-skill-matched" },
              { label: "In Progress", value: inProgressCount, icon: Clock, color: "text-accent" },
              { label: "Recommended", value: recommendedCount, icon: TrendingUp, color: "text-primary" },
              { label: "Est. Hours", value: totalHours, icon: BarChart3, color: "text-node-intermediate" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.03 }}
                className="glass-card-elevated p-4 flex items-center gap-3"
              >
                <stat.icon className={`w-4 h-4 ${stat.color} shrink-0`} />
                <div>
                  <div className={`text-lg font-bold ${stat.color} counter-animate`}>{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Legend */}
        <ScrollReveal delay={0.1}>
          <div className="glass-card-elevated p-4 mb-6">
            <div className="flex flex-wrap items-center gap-5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status:</span>
              {Object.entries(statusConfig).map(([status, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <div key={status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                    <span>{cfg.label}</span>
                  </div>
                );
              })}
              <div className="h-4 w-px bg-border" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Level:</span>
              {Object.entries(levelColor).map(([level, color]) => (
                <div key={level} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                  <span className="capitalize">{level}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Graph */}
        <ScrollReveal delay={0.14}>
          <div className="glass-card-elevated overflow-hidden rounded-2xl" style={{ height: "600px" }}>
            {/* Column headers */}
            <div className="grid grid-cols-3 border-b border-border bg-muted/30">
              {(["Beginner", "Intermediate", "Advanced"] as const).map((level) => {
                const colors = { Beginner: "text-node-beginner", Intermediate: "text-node-intermediate", Advanced: "text-node-advanced" };
                return (
                  <div key={level} className="text-center py-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${colors[level]}`}>{level}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ height: "calc(100% - 44px)" }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.25 }}
                minZoom={0.3}
                maxZoom={1.8}
                proOptions={{ hideAttribution: true }}
              >
                <Background gap={24} size={1} color="hsl(var(--border))" />
                <Controls showInteractive={false} className="!bg-card !border-border !shadow-md !rounded-xl" />
              </ReactFlow>
            </div>
          </div>
        </ScrollReveal>

        {/* Detailed Skill List */}
        <ScrollReveal delay={0.2}>
          <div className="glass-card-elevated p-6 mt-6">
            <h3 className="font-bold mb-5 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Detailed Skill Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Skill</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Level</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Est. Hours</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {roadmap.sort((a, b) => a.priority - b.priority).map((node) => {
                    const cfg = statusConfig[node.status];
                    const Icon = cfg.icon;
                    const progress = node.status === "completed" ? 100 : node.status === "in-progress" ? 50 : 0;
                    return (
                      <tr key={node.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-3 font-medium">{node.skill}</td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${levelBadge[node.level]}`}>
                            {node.level}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`flex items-center gap-1.5 ${cfg.color} text-xs font-medium`}>
                            <Icon className="w-3 h-3" /> {cfg.label}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="mono text-xs font-medium">P{node.priority}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-muted-foreground">{node.estimatedHours}h</span>
                        </td>
                        <td className="py-3 px-3 min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${progress}%`, backgroundColor: levelColor[node.level] }}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground mono w-8">{progress}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.24}>
          <div className="flex justify-center gap-4 mt-8">
            <Link to="/dashboard">
              <Button variant="hero-outline" size="lg" className="h-12 px-8">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Roadmap;
