import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return new Response(JSON.stringify({ error: "Both resumeText and jobDescription are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert HR and skills analysis AI. Analyze the provided resume and job description to extract skills, perform gap analysis, and generate a learning roadmap.

You MUST respond with ONLY valid JSON (no markdown, no code fences) in this exact structure:
{
  "resumeSkills": [{"name": "string", "level": "beginner|intermediate|advanced", "category": "string"}],
  "requiredSkills": [{"name": "string", "level": "beginner|intermediate|advanced", "category": "string"}],
  "matchedSkills": ["string"],
  "missingSkills": ["string"],
  "matchScore": number (0-100),
  "recommendations": ["string"],
  "roadmap": [
    {
      "id": "string (unique)",
      "skill": "string",
      "level": "beginner|intermediate|advanced",
      "status": "completed|in-progress|recommended|locked",
      "dependencies": ["id of prerequisite nodes"],
      "priority": number (1-10),
      "estimatedHours": number
    }
  ]
}

Rules:
- Extract ALL relevant skills from both texts
- Use normalized skill names (e.g., "React" not "ReactJS")
- matchedSkills = skills present in BOTH resume and JD
- missingSkills = skills in JD but NOT in resume
- matchScore = percentage of required skills the candidate has
- For the roadmap: Mark matched skills as "completed", partially known as "in-progress", and missing skills as "recommended" or "locked" based on dependencies
- Create realistic dependency chains (e.g., JavaScript -> React -> Next.js)
- Generate 3-5 actionable recommendations
- Include 8-15 nodes in the roadmap covering beginner through advanced
- estimatedHours should be realistic (5-100 hours per skill)`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content in AI response");

    // Parse JSON, handling possible markdown fences
    let cleanContent = content.trim();
    if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }

    const analysisData = JSON.parse(cleanContent);

    return new Response(JSON.stringify(analysisData), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("analyze-skills error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
