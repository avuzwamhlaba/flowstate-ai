import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

const GenerateEmailInput = z.object({
  context: z.string().min(1),
  tone: z.enum(["formal", "casual", "persuasive"]),
  recipient: z.string().min(1),
  purpose: z.string().min(1),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateEmailInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system:
        "You are an expert professional email writer. Write polished, effective emails. Only output the email body with a subject line. Do not include any explanation or meta-text.",
      prompt: `Write a ${data.tone} email to ${data.recipient}.

Purpose: ${data.purpose}
Context: ${data.context}

Format:
Subject: [subject line]

[email body]`,
    });

    return { email: text };
  });
