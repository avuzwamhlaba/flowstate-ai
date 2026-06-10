import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CalendarCheck, Sparkles, Loader2, Copy, Check, Clock, AlertCircle } from "lucide-react";
import { planTasks } from "@/lib/planner.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      { name: "description", content: "Generate prioritized daily and weekly schedules" },
    ],
  }),
  component: TaskPlanner,
});

function TaskPlanner() {
  const plan = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [priorities, setPriorities] = useState("");
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month">("day");
  const [result, setResult] = useState<{
    overview: string;
    schedule: {
      timeBlock: string;
      tasks: { title: string; priority: "high" | "medium" | "low"; duration?: string; notes?: string }[];
    }[];
    tips: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePlan = async () => {
    if (!tasks) return;
    setLoading(true);
    try {
      const data = await plan({ data: { tasks, timeframe, priorities: priorities || undefined } });
      setResult(data);
    } catch (err) {
      toast.error("Failed to create plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const priorityColor = (p: string) => {
    switch (p) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-amber/10 text-amber-foreground border-amber/20";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const copyPlan = () => {
    if (!result) return;
    const text = [
      result.overview,
      "",
      ...result.schedule.flatMap((s) => [
        `${s.timeBlock}:`
        ...s.tasks.map(
          (t) => `  - ${t.title} (${t.priority})${t.duration ? ` [${t.duration}]` : ""}`,
        ),
      ]),
      "",
      "Tips:",
      ...result.tips.map((t) => `- ${t}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Plan copied");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          AI Task Planner
        </h1>
        <p className="text-muted-foreground">
          Get a prioritized schedule tailored to your tasks and deadlines.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              Your Tasks
            </CardTitle>
            <CardDescription>List everything you need to accomplish.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select
                value={timeframe}
                onValueChange={(v) => setTimeframe(v as "day" | "week" | "month")}
              >
                <SelectTrigger id="timeframe">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily Plan</SelectItem>
                  <SelectItem value="week">Weekly Plan</SelectItem>
                  <SelectItem value="month">Monthly Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tasks">Tasks & Goals</Label>
              <Textarea
                id="tasks"
                placeholder="List your tasks, one per line. Include deadlines and dependencies if relevant..."
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priorities">Priority Notes (optional)</Label>
              <Textarea
                id="priorities"
                placeholder="Any specific priorities, constraints, or context..."
                value={priorities}
                onChange={(e) => setPriorities(e.target.value)}
                rows={3}
              />
            </div>
            <Button
              onClick={handlePlan}
              disabled={loading || !tasks.trim()}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {loading ? "Planning..." : "Generate Schedule"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {result ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {timeframe === "day" ? "Daily" : timeframe === "week" ? "Weekly" : "Monthly"} Schedule
                  </CardTitle>
                  <CardDescription>{result.overview}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={copyPlan}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.schedule.map((block, i) => (
                  <div key={i}>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {block.timeBlock}
                    </h4>
                    <ul className="space-y-2">
                      {block.tasks.map((task, j) => (
                        <li
                          key={j}
                          className="flex items-start justify-between gap-3 rounded-md border bg-card p-2.5"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{task.title}</p>
                            {task.notes && (
                              <p className="mt-0.5 text-xs text-muted-foreground">{task.notes}</p>
                            )}
                          </div>
                          <div className="flex shrink-0 gap-1.5">
                            {task.duration && (
                              <Badge variant="outline" className="text-[10px]">
                                {task.duration}
                              </Badge>
                            )}
                            <Badge variant="outline" className={`text-[10px] ${priorityColor(task.priority)}`}>
                              {task.priority}
                            </Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {result.tips.length > 0 && (
                  <div className="rounded-md bg-muted p-3">
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Productivity Tips
                    </h4>
                    <ul className="space-y-1">
                      {result.tips.map((tip, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {tip}
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
                    <CalendarCheck className="mx-auto h-8 w-8 opacity-40" />
                    <p className="mt-2 text-sm">Your AI-generated schedule will appear here</p>
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
