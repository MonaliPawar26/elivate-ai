import { useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
import { getAnalysisResult, RoadmapNode } from "@/lib/analysisStore";
import { CheckCircle2, Clock, ArrowRight, Lock } from "lucide-react";

const statusConfig = {
  completed: { bg: "bg-skill-matched/15", border: "border-skill-matched/40", icon: CheckCircle2, color: "text-skill-matched" },
  "in-progress": { bg: "bg-accent/15", border: "border-accent/40", icon: Clock, color: "text-accent" },
  recommended: { bg: "bg-primary/10", border: "border-primary/30", icon: ArrowRight, color: "text-primary" },
  locked: { bg: "bg-muted", border: "border-border", icon: Lock, color: "text-muted-foreground" },
};

const levelColor = {
  beginner: "hsl(199, 89%, 48%)",
  intermediate: "hsl(38, 92%, 55%)",
  advanced: "hsl(340, 82%, 52%)",
};

function SkillNode({ data }: { data: RoadmapNode }) {
  const cfg = statusConfig[data.status];
  const Icon = cfg.icon;

  return (
    <div className={`px-5 py-3.5 rounded-xl border-2 ${cfg.bg} ${cfg.border} min-w-[160px] transition-shadow hover:shadow-md`}>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
        <span className="text-sm font-semibold text-foreground">{data.skill}</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="capitalize">{data.level}</span>
        <span>·</span>
        <span>{data.estimatedHours}h</span>
      </div>
      <div className="mt-2 h-1 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: data.status === "completed" ? "100%" : data.status === "in-progress" ? "50%" : "0%",
            backgroundColor: levelColor[data.level],
          }}
        />
      </div>
    </div>
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

    // Layout: arrange by level in columns
    const levelCols = { beginner: 0, intermediate: 1, advanced: 2 };
    const levelCounters = { beginner: 0, intermediate: 0, advanced: 0 };

    const flowNodes: Node[] = roadmap.map((rn) => {
      const col = levelCols[rn.level];
      const row = levelCounters[rn.level]++;
      return {
        id: rn.id,
        type: "skillNode",
        position: { x: col * 280 + 40, y: row * 120 + 40 },
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
        animated: rn.status === "in-progress",
        markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
        style: { strokeWidth: 2, stroke: "hsl(var(--border))" },
      }))
    );

    return { nodes: flowNodes, edges: flowEdges };
  }, [result]);

  if (!result) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 section-padding">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Learning Roadmap</h1>
            <p className="text-muted-foreground">Your adaptive skill pathway from beginner to advanced. Drag and zoom to explore.</p>
          </div>
        </ScrollReveal>

        {/* Legend */}
        <ScrollReveal delay={0.08}>
          <div className="flex flex-wrap gap-4 mb-6">
            {Object.entries(statusConfig).map(([status, cfg]) => {
              const Icon = cfg.icon;
              return (
                <div key={status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                  <span className="capitalize">{status}</span>
                </div>
              );
            })}
            <div className="h-4 w-px bg-border" />
            {Object.entries(levelColor).map(([level, color]) => (
              <div key={level} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                <span className="capitalize">{level}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.16}>
          <div className="glass-card-elevated overflow-hidden" style={{ height: "560px" }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.3 }}
              minZoom={0.4}
              maxZoom={1.5}
              proOptions={{ hideAttribution: true }}
            >
              <Background gap={24} size={1} color="hsl(var(--border))" />
              <Controls showInteractive={false} className="!bg-card !border-border !shadow-sm" />
            </ReactFlow>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Roadmap;
