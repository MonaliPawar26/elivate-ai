import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRight, Brain, GitBranch, Target, BarChart3, Zap, Shield, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Skill Extraction",
    description: "Automatically identify and categorize skills from resumes and job descriptions using advanced NLP.",
  },
  {
    icon: Target,
    title: "Gap Analysis",
    description: "Precisely map the distance between your current skills and your target role requirements.",
  },
  {
    icon: GitBranch,
    title: "Adaptive Pathways",
    description: "Generate personalized learning roadmaps that adapt based on skill dependencies and priorities.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Track your growth with detailed skill analytics and visualize your learning trajectory.",
  },
];

const steps = [
  { step: "01", title: "Upload", description: "Paste your resume and target job description" },
  { step: "02", title: "Analyze", description: "AI extracts skills and identifies gaps" },
  { step: "03", title: "Learn", description: "Follow your personalized roadmap" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32 section-padding">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-soft text-primary text-xs font-medium mb-8">
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Onboarding Engine
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6">
              Bridge your skill gaps
              <br />
              <span className="gradient-text">with precision</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.16}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload your resume and target job description. Our AI identifies exactly what you need to learn and builds a personalized roadmap to get you there.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.24}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/analyze">
                <Button variant="hero" size="lg" className="text-base px-8 h-12">
                  Start Analysis <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="hero-outline" size="lg" className="text-base px-8 h-12">
                  See How It Works
                </Button>
              </a>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal delay={0.35}>
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 pt-10 border-t border-border">
              {[
                { value: "94.7%", label: "Match Accuracy" },
                { value: "2.3k+", label: "Skills Mapped" },
                { value: "47min", label: "Avg. Time Saved" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="stat-value text-foreground text-2xl md:text-3xl">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-padding bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Intelligent onboarding, simplified</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Every step is powered by AI to ensure your learning path is efficient, relevant, and adaptive.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 0.08}>
                <div className="glass-card-elevated p-8 h-full transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Three steps to your roadmap</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                From upload to personalized learning path in under a minute.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 0.1}>
                <div className="text-center">
                  <div className="mono text-5xl font-bold text-primary/15 mb-4">{s.step}</div>
                  <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="text-center mt-14">
              <Link to="/analyze">
                <Button variant="hero" size="lg" className="h-12 px-8 text-base">
                  Try It Now <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Zap className="w-3 h-3 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">Elivate AI</span>
        </div>
        <p className="text-xs text-muted-foreground">Built for the future of adaptive onboarding</p>
      </footer>
    </div>
  );
};

export default Index;
