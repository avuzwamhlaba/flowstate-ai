import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

const PlanTasksInput = z.object({
  tasks: z.string().min(1),
  timeframe: z.enum(["day", "week", "month"]),
  priorities: z.string().optional(),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanTasksInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const { output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system:
        "You are an expert productivity coach. Create actionable, prioritized task schedules that account for deadlines, importance, and dependencies.",
      output: Output.object({
        schema: z.object({
          overview: z.string(),
          schedule: z.array(
            z.object({
              timeBlock: z.string(),
              tasks: z.array(
                z.object({
                  title: z.string(),
                  priority: z.enum(["high", "medium", "low"]),
                  duration: z.string().optional(),
                  notes: z.string().optional(),
                }),
              ),
            }),
          ),
          tips: z.array(z.string()),
        }),
      }),
      prompt: `Create a ${data.timeframe}ly task plan.

Tasks & Goals:\n${data.tasks}
${data.priorities ? `\nPriority Notes:\n${data.priorities}` : ""}`,
    });

    return output;
  });
