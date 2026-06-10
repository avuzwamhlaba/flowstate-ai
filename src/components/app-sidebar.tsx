import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Mail,
  FileText,
  CalendarCheck,
  Search,
  MessageSquare,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Meeting Summarizer", url: "/meeting", icon: FileText },
  { title: "Task Planner", url: "/planner", icon: CalendarCheck },
  { title: "Research Assistant", url: "/research", icon: Search },
  { title: "AI Chatbot", url: "/chat", icon: MessageSquare },
];

function CollapseToggle() {
  const { state, toggleSidebar } = useSidebar();
  return (
    <button
      onClick={toggleSidebar}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      aria-label={state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
    >
      {state === "collapsed" ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
    </button>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const currentPath = useRouterState({
    select: (router) => router.location.pathname,
  });

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            {state === "expanded" && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-tight text-sidebar-foreground">
                  Workplace AI
                </span>
                <span className="text-[10px] leading-tight text-sidebar-foreground/50">
                  Productivity Assistant
                </span>
              </div>
            )}
          </div>
          {state === "expanded" && <CollapseToggle />}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={state === "collapsed" ? item.title : undefined}
                  >
                    <Link
                      to={item.url}
                      className="flex items-center gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        {state === "collapsed" && <SidebarTrigger className="w-full" />}
        {state === "expanded" && (
          <div className="rounded-md bg-sidebar-accent/50 p-2.5">
            <p className="text-[10px] leading-relaxed text-sidebar-foreground/60">
              AI-generated content may contain errors. Please verify critical
              information before use.
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
