import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  CalendarCheck,
  Search,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      { name: "description", content: "AI-powered workplace productivity dashboard" },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    title: "Smart Email Generator",
    description: "Generate professional emails with the right tone and context.",
    icon: Mail,
    href: "/email",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "group-hover:border-primary/30",
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Extract key decisions, action items, and deadlines from transcripts.",
    icon: FileText,
    href: "/meeting",
    color: "text-emerald",
    bg: "bg-emerald/10",
    border: "group-hover:border-emerald/30",
  },
  {
    title: "AI Task Planner",
    description: "Create prioritized daily, weekly, or monthly schedules.",
    icon: CalendarCheck,
    href: "/planner",
    color: "text-amber",
    bg: "bg-amber/10",
    border: "group-hover:border-amber/30",
  },
  {
    title: "Research Assistant",
    description: "Research topics, compile summaries, and get actionable insights.",
    icon: Search,
    href: "/research",
    color: "text-slate",
    bg: "bg-slate/10",
    border: "group-hover:border-slate/30",
  },
  {
    title: "AI Chatbot",
    description: "Get conversational help with any workplace productivity task.",
    icon: MessageSquare,
    href: "/chat",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "group-hover:border-primary/30",
  },
];

const stats = [
  { label: "AI Tools", value: "5", icon: Zap },
  { label: "Response Time", value: "<2s", icon: Sparkles },
  { label: "Privacy", value: "Secure", icon: Shield },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome to Workplace AI
            </h1>
            <p className="text-sm text-muted-foreground">
              Your AI-powered productivity assistant — choose a tool to get started.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-muted/60">
            <CardContent className="flex items-center gap-3 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-bold leading-none text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Productivity Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.href} to={tool.href} className="group">
              <Card className={`h-full transition-all duration-200 hover:shadow-md ${tool.border}`}>
                <CardHeader>
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${tool.bg} transition-transform group-hover:scale-105`}
                  >
                    <tool.icon className={`h-5 w-5 ${tool.color}`} />
                  </div>
                  <CardTitle className="text-base">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                    Open tool <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card className="border-dashed bg-muted/30">
        <CardContent className="py-6">
          <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:text-left">
            <div className="rounded-full bg-background p-3 shadow-sm">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Responsible AI Disclaimer
              </h3>
              <p className="mt-1 max-w-lg text-xs text-muted-foreground">
                All content is generated by AI and should be reviewed before use in professional
                settings. We recommend fact-checking critical information. Your data is processed
                securely and not stored on our servers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
