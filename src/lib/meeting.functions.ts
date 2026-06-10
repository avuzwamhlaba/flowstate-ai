import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

const SummarizeMeetingInput = z.object({
  transcript: z.string().min(1),
  meetingTitle: z.string().optional(),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SummarizeMeetingInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const { output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system:
        "You are an expert meeting facilitator. Summarize meeting transcripts concisely, extracting key decisions, action items with owners, and deadlines.",
      output: Output.object({
        schema: z.object({
          summary: z.string(),
          keyDecisions: z.array(z.string()),
          actionItems: z.array(
            z.object({
              task: z.string(),
              owner: z.string().optional(),
              deadline: z.string().optional(),
            }),
          ),
          deadlines: z.array(z.string()),
        }),
      }),
      prompt: `Meeting: ${data.meetingTitle || "Untitled Meeting"}\n\nTranscript:\n${data.transcript}`,
    });

    return output;
  });
