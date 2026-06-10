import { type ReactNode } from "react";
import { Bell, Menu } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card px-4 shadow-sm">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="lg:hidden">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <h1 className="text-sm font-semibold text-foreground lg:text-base">
                AI Workplace Productivity Assistant
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="relative inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald" />
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </SidebarProvider>
  );
}
