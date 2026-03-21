import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import { ArrowRight, Brain, GitBranch, Target, BarChart3, Zap, Shield, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Skill Extraction",
    description: "Extract structured skills, education, and experience from resumes using advanced NLP and AI models.",
    color: "from-primary/10 to-primary/5",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Target,
    title: "Real-Time Gap Analysis",
    description: "Compare your profile against internship and job requirements to identify missing skills and performance gaps.",
    color: "from-node-beginner/10 to-node-beginner/5",
    iconBg: "bg-node-beginner/10",
    iconColor: "text-node-beginner",
  },
  {
    icon: Shield,
    title: "Readiness Scoring",
    description: "Get a comprehensive readiness score across technical, experience, and education dimensions.",
    color: "from-accent/10 to-accent/5",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    icon: GitBranch,
    title: "Adaptive Roadmap",
    description: "Generate personalized skill development roadmaps with dependency chains and priority-based learning.",
    color: "from-skill-matched/10 to-skill-matched/5",
    iconBg: "bg-skill-matched/10",
    iconColor: "text-skill-matched",
  },
  {
    icon: TrendingUp,
    title: "Improvement Insights",
    description: "Receive prioritized improvement insights with concrete action items and time estimates.",
    color: "from-node-advanced/10 to-node-advanced/5",
    iconBg: "bg-node-advanced/10",
    iconColor: "text-node-advanced",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Track growth with skill analytics, performance gap severity, and learning trajectory visualization.",
    color: "from-primary/10 to-accent/5",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
];

const steps = [
  { step: "01", title: "Upload", description: "Upload your resume PDF or paste content along with your target job description", icon: "📄" },
  { step: "02", title: "Analyze", description: "AI extracts skills, education, identifies gaps, and calculates readiness scores", icon: "🧠" },
  { step: "03", title: "Learn", description: "Follow your personalized roadmap with prioritized action items and timelines", icon: "🚀" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const Index = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-24 lg:pt-44 lg:pb-36 section-padding">
        {/* Animated orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="orb orb-primary w-[500px] h-[500px] top-[10%] left-[15%]" style={{ animationDelay: "0s" }} />
          <div className="orb orb-blue w-[400px] h-[400px] top-[20%] right-[10%]" style={{ animationDelay: "2s" }} />
          <div className="orb orb-accent w-[300px] h-[300px] bottom-[10%] left-[40%]" style={{ animationDelay: "4s" }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-semibold mb-8 animate-glow-pulse">
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Onboarding Engine
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6"
          >
            Bridge your skill gaps
            <br />
            <span className="gradient-text">with precision</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Upload your resume and target job description. Our AI identifies exactly what you need to learn and builds a personalized roadmap to get you there.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/analyze">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                <Button variant="hero" size="lg" className="text-base px-10 h-13 shadow-lg" style={{ boxShadow: "0 8px 30px -6px hsl(162 63% 41% / 0.4)" }}>
                  Start Analysis <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Link>
            <a href="#how-it-works">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                <Button variant="hero-outline" size="lg" className="text-base px-8 h-13">
                  See How It Works
                </Button>
              </motion.div>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-20 pt-10 border-t border-border"
          >
            {[
              { value: "94.7%", label: "Match Accuracy" },
              { value: "2.3k+", label: "Skills Mapped" },
              { value: "47min", label: "Avg. Time Saved" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <div className="counter-animate text-foreground text-2xl md:text-3xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-padding bg-gradient-to-b from-secondary/50 to-background">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-semibold mb-4">
                Core Capabilities
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Intelligent onboarding, simplified</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Every step is powered by AI to ensure your learning path is efficient, relevant, and adaptive.
              </p>
            </div>
          </ScrollReveal>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`glass-card-elevated p-7 h-full bg-gradient-to-br ${feature.color}`}
                >
                  <div className={`w-11 h-11 rounded-xl ${feature.iconBg} flex items-center justify-center mb-5`}>
                    <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="orb orb-primary w-[350px] h-[350px] bottom-[20%] right-[10%]" style={{ animationDelay: "1s" }} />
        </div>

        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/15 text-accent text-xs font-semibold mb-4">
                Simple Process
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Three steps to your roadmap</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                From upload to personalized learning path in under a minute.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="glass-card-elevated p-8 text-center relative overflow-hidden"
                >
                  {/* Step number watermark */}
                  <div className="absolute top-3 right-4 mono text-6xl font-bold text-primary/[0.06]">{s.step}</div>
                  <div className="text-4xl mb-4">{s.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="w-5 h-5 text-muted-foreground/30" />
                    </div>
                  )}
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.35}>
            <div className="text-center mt-14">
              <Link to="/analyze">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} className="inline-block">
                  <Button variant="hero" size="lg" className="h-13 px-10 text-base shadow-lg" style={{ boxShadow: "0 8px 30px -6px hsl(162 63% 41% / 0.4)" }}>
                    Try It Now <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">Elivate AI</span>
          </div>
          <p className="text-xs text-muted-foreground">Built for the future of adaptive onboarding</p>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-xs text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <Link to="/analyze" className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
