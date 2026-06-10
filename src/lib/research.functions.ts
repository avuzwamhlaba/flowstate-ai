import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

const ResearchInput = z.object({
  topic: z.string().min(1),
  depth: z.enum(["brief", "detailed", "comprehensive"]),
  focus: z.string().optional(),
});

export const doResearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const { output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system:
        "You are a thorough research analyst. Provide well-structured research summaries with key findings, sources, and actionable insights. Note that you cannot browse the live web, so provide general knowledge-based research.",
      output: Output.object({
        schema: z.object({
          summary: z.string(),
          keyFindings: z.array(z.string()),
          sources: z.array(z.string()),
          insights: z.array(z.string()),
          recommendations: z.array(z.string()),
        }),
      }),
      prompt: `Research topic: ${data.topic}
Depth: ${data.depth}
${data.focus ? `Specific focus: ${data.focus}` : ""}`,
    });

    return output;
  });
