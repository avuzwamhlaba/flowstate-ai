import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Sparkles, Loader2, Copy, Check } from "lucide-react";
import { summarizeMeeting } from "@/lib/meeting.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/meeting")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      { name: "description", content: "Summarize meetings and extract action items" },
    ],
  }),
  component: MeetingSummarizer,
});

function MeetingSummarizer() {
  const summarize = useServerFn(summarizeMeeting);
  const [transcript, setTranscript] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [result, setResult] = useState<{
    summary: string;
    keyDecisions: string[];
    actionItems: { task: string; owner?: string; deadline?: string }[];
    deadlines: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!transcript) return;
    setLoading(true);
    try {
      const data = await summarize({ data: { transcript, meetingTitle } });
      setResult(data);
    } catch (err) {
      toast.error("Failed to summarize. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copySummary = () => {
    if (!result) return;
    const text = [
      result.summary,
      "",
      "Key Decisions:",
      ...result.keyDecisions.map((d) => `- ${d}`),
      "",
      "Action Items:",
      ...result.actionItems.map(
        (a) => `- ${a.task}${a.owner ? ` (Owner: ${a.owner})` : ""}${a.deadline ? ` — Due: ${a.deadline}` : ""}`,
      ),
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Summary copied");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Meeting Notes Summarizer
        </h1>
        <p className="text-muted-foreground">
          Paste a transcript and get a structured summary with decisions and action items.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Meeting Transcript
            </CardTitle>
            <CardDescription>Paste the full transcript below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title (optional)</Label>
              <Input
                id="title"
                placeholder="e.g., Q3 Planning Session"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transcript">Transcript</Label>
              <Textarea
                id="transcript"
                placeholder="Paste your meeting transcript or notes here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={10}
              />
            </div>
            <Button
              onClick={handleSummarize}
              disabled={loading || !transcript.trim()}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {loading ? "Analyzing..." : "Summarize Meeting"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {result ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Summary</CardTitle>
                  <CardDescription>Key takeaways from your meeting</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={copySummary}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">{result.summary}</p>

                <div>
                  <h4 className="mb-2 text-sm font-semibold">Key Decisions</h4>
                  <ul className="space-y-1.5">
                    {result.keyDecisions.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Badge variant="secondary" className="mt-0.5 shrink-0">
                          {i + 1}
                        </Badge>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold">Action Items</h4>
                  <ul className="space-y-2">
                    {result.actionItems.map((a, i) => (
                      <li
                        key={i}
                        className="rounded-md border bg-card p-2.5 text-sm"
                      >
                        <p className="font-medium">{a.task}</p>
                        <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                          {a.owner && <span>Owner: {a.owner}</span>}
                          {a.deadline && <span>Due: {a.deadline}</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <div className="flex h-96 items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <FileText className="mx-auto h-8 w-8 opacity-40" />
                    <p className="mt-2 text-sm">Meeting summary will appear here</p>
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
