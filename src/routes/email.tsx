import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Mail,
  FileText,
  CalendarCheck,
  Search,
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { generateEmail } from "@/lib/email.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      { name: "description", content: "Generate professional email drafts with AI" },
    ],
  }),
  component: EmailGenerator,
});

function EmailGenerator() {
  const generate = useServerFn(generateEmail);
  const [context, setContext] = useState("");
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<"formal" | "casual" | "persuasive">("formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!context || !recipient || !purpose) return;
    setLoading(true);
    try {
      const { email } = await generate({ data: { context, tone, recipient, purpose } });
      setOutput(email);
    } catch (err) {
      toast.error("Failed to generate email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Smart Email Generator
        </h1>
        <p className="text-muted-foreground">
          Generate polished, professional emails tailored to your recipient and purpose.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Email Details
            </CardTitle>
            <CardDescription>Fill in the context and hit generate.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g., Hiring Manager at TechCorp"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                placeholder="e.g., Request a meeting to discuss project scope"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select
                value={tone}
                onValueChange={(v) => setTone(v as "formal" | "casual" | "persuasive")}
              >
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="context">Context & Details</Label>
              <Textarea
                id="context"
                placeholder="Add any relevant background, deadlines, or specific points to include..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={5}
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={loading || !context || !recipient || !purpose}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {loading ? "Generating..." : "Generate Email"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Email</CardTitle>
            {output && (
              <Button variant="ghost" size="sm" onClick={copyOutput}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {output ? (
              <div className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm leading-relaxed text-foreground">
                {output}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-md border-2 border-dashed border-muted text-muted-foreground">
                <div className="text-center">
                  <Mail className="mx-auto h-8 w-8 opacity-40" />
                  <p className="mt-2 text-sm">Your generated email will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
