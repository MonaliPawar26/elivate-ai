import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRight, FileText, Briefcase, Loader2, Sparkles, Upload, X, FileUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { setAnalysisResult } from "@/lib/analysisStore";
import { toast } from "sonner";

const Analyze = () => {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF or DOC/DOCX file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB");
      return;
    }

    setUploadedFile(file);
    setIsExtracting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-pdf-text`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Extraction failed" }));
        throw new Error(err.error || `HTTP ${response.status}`);
      }

      const { text } = await response.json();
      setResumeText(text);
      toast.success("Resume text extracted successfully!");
    } catch (err: any) {
      console.error("File extraction error:", err);
      toast.error(err.message || "Failed to extract text from file");
      setUploadedFile(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setResumeText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast.error("Please provide both your resume and a job description");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-skills", {
        body: { resumeText, jobDescription },
      });

      if (error) throw error;

      setAnalysisResult(data);
      toast.success("Analysis complete!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast.error(err.message || "Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 section-padding">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-soft text-primary text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Analysis
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Analyze your skill alignment</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Paste your resume and a target job description. Our AI will extract skills and generate your personalized roadmap.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          <ScrollReveal delay={0.08} direction="left">
            <div className="glass-card-elevated p-6 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Your Resume</h3>
                  <p className="text-xs text-muted-foreground">Upload a file or paste content</p>
                </div>
              </div>

              {/* File upload area */}
              <div className="mb-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
                {uploadedFile ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/15">
                    <FileUp className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm truncate flex-1">{uploadedFile.name}</span>
                    {isExtracting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
                    ) : (
                      <button onClick={removeFile} className="shrink-0 hover:bg-muted rounded p-0.5">
                        <X className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-lg border-2 border-dashed border-border hover:border-primary/30 hover:bg-primary/[0.02] transition-colors text-sm text-muted-foreground"
                  >
                    <Upload className="w-4 h-4" />
                    Upload PDF or DOC
                  </button>
                )}
              </div>

              <div className="text-[10px] text-muted-foreground text-center mb-2 uppercase tracking-wider">or paste below</div>

              <textarea
                className="flex-1 min-h-[200px] w-full rounded-lg border border-input bg-background p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.16} direction="right">
            <div className="glass-card-elevated p-6 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Job Description</h3>
                  <p className="text-xs text-muted-foreground">Paste the target role description</p>
                </div>
              </div>
              <textarea
                className="flex-1 min-h-[280px] w-full rounded-lg border border-input bg-background p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                placeholder="Paste the job description here...

Example:
Senior Full-Stack Engineer — Requirements: 5+ years with React, TypeScript, Python, Kubernetes, CI/CD, system design..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.24}>
          <div className="text-center mt-8">
            <Button
              variant="hero"
              size="lg"
              className="h-12 px-10 text-base"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText.trim() || !jobDescription.trim()}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Skills <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Analyze;
