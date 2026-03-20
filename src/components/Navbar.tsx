import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">
            Elivate<span className="text-primary"> AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {isLanding && (
            <>
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            </>
          )}
          {!isLanding && (
            <>
              <Link to="/analyze" className={`text-sm transition-colors ${location.pathname === '/analyze' ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}>Analyze</Link>
              <Link to="/dashboard" className={`text-sm transition-colors ${location.pathname === '/dashboard' ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}>Dashboard</Link>
              <Link to="/roadmap" className={`text-sm transition-colors ${location.pathname === '/roadmap' ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}>Roadmap</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/analyze">
            <Button variant={isLanding ? "hero" : "default"} size="sm" className="gap-1.5">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
