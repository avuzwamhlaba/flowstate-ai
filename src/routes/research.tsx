import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Search, Sparkles, Loader2, Copy, Check, Lightbulb, BookOpen, Target } from "lucide-react";
import { doResearch } from "@/lib/research.functions";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      { name: "description", content: "Research topics with AI-powered summaries" },
    ],
  }),
  component: ResearchAssistant,
});

function ResearchAssistant() {
  const research = useServerFn(doResearch);
  const [topic, setTopic] = useState("");
  const [focus, setFocus] = useState("");
  const [depth, setDepth] = useState<"brief" | "detailed" | "comprehensive">("detailed");
  const [result, setResult] = useState<{
    summary: string;
    keyFindings: string[];
    sources: string[];
    insights: string[];
    recommendations: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleResearch = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const data = await research({ data: { topic, depth, focus: focus || undefined } });
      setResult(data);
    } catch (err) {
      toast.error("Research failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyResearch = () => {
    if (!result) return;
    const text = [
      `# ${topic}`,
      "",
      result.summary,
      "",
      "## Key Findings",
      ...result.keyFindings.map((f) => `- ${f}`),
      "",
      "## Insights",
      ...result.insights.map((i) => `- ${i}`),
      "",
      "## Recommendations",
      ...result.recommendations.map((r) => `- ${r}`),
      "",
      "## Sources",
      ...result.sources.map((s) => `- ${s}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Research copied");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          AI Research Assistant
        </h1>
        <p className="text-muted-foreground">
          Conduct research on any topic and get structured summaries with insights.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Research Topic
            </CardTitle>
            <CardDescription>What would you like to research?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Remote team collaboration best practices"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="depth">Research Depth</Label>
              <Select
                value={depth}
                onValueChange={(v) => setDepth(v as "brief" | "detailed" | "comprehensive")}
              >
                <SelectTrigger id="depth">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief">Brief Overview</SelectItem>
                  <SelectItem value="detailed">Detailed Analysis</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="focus">Specific Focus (optional)</Label>
              <Textarea
                id="focus"
                placeholder="Any specific angle, questions, or constraints..."
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                rows={3}
              />
            </div>
            <Button
              onClick={handleResearch}
              disabled={loading || !topic.trim()}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {loading ? "Researching..." : "Start Research"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {result ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Research Results</CardTitle>
                  <CardDescription>
                    {depth === "brief" ? "Quick overview" : depth === "detailed" ? "Detailed analysis" : "Comprehensive report"}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={copyResearch}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sm leading-relaxed">{result.summary}</p>

                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                    Key Findings
                  </h4>
                  <ul className="space-y-1.5">
                    {result.keyFindings.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Badge variant="secondary" className="mt-0.5 shrink-0">
                          {i + 1}
                        </Badge>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <Lightbulb className="h-3.5 w-3.5 text-amber" />
                    Key Insights
                  </h4>
                  <ul className="space-y-1">
                    {result.insights.map((insight, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <Target className="h-3.5 w-3.5 text-emerald" />
                    Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {result.sources.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Sources & References</h4>
                    <ul className="space-y-1">
                      {result.sources.map((source, i) => (
                        <li key={i} className="text-xs text-muted-foreground">
                          {source}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <div className="flex h-96 items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Search className="mx-auto h-8 w-8 opacity-40" />
                    <p className="mt-2 text-sm">Research results will appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
