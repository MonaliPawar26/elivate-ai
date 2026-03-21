import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const Navbar = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const navLinks = isLanding
    ? [
        { href: "#features", label: "Features" },
        { href: "#how-it-works", label: "How It Works" },
      ]
    : [
        { href: "/analyze", label: "Analyze" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/roadmap", label: "Roadmap" },
      ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-2xl border-b border-border/60 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md"
            style={{ boxShadow: "0 4px 12px -2px hsl(162 63% 41% / 0.4)" }}
          >
            <Zap className="w-4 h-4 text-primary-foreground" />
          </motion.div>
          <span className="text-lg font-bold text-foreground">
            Elivate<span className="text-primary"> AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = !isLanding && location.pathname === link.href;
            const Component = isLanding ? "a" : Link;
            return (
              <Component
                key={link.href}
                {...(isLanding ? { href: link.href } : { to: link.href })}
                className={`relative px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                  isActive
                    ? "text-foreground font-medium bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Component>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/analyze">
            <Button variant={isLanding ? "hero" : "default"} size="sm" className="gap-1.5 hidden sm:flex">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-background/95 backdrop-blur-2xl border-b border-border overflow-hidden"
          >
            <div className="px-6 py-4 space-y-2">
              {navLinks.map((link) => {
                const Component = isLanding ? "a" : Link;
                return (
                  <Component
                    key={link.href}
                    {...(isLanding ? { href: link.href } : { to: link.href })}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                  >
                    {link.label}
                  </Component>
                );
              })}
              <Link to="/analyze" onClick={() => setMobileOpen(false)}>
                <Button variant="hero" size="sm" className="w-full mt-2 gap-1.5">
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
