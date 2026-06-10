import { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Send,
  Loader2,
  User,
  Bot,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const chatTransport = new DefaultChatTransport({ api: "/api/chat" });

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Workplace AI" },
      { name: "description", content: "Conversational AI assistant for workplace productivity" },
    ],
  }),
  component: ChatbotPage,
});

function ChatbotPage() {
  const [storedMessages, setStoredMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("workplace-chat-messages");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { messages, sendMessage, status, setMessages } = useChat({
    id: "workplace-chat",
    messages: storedMessages,
    transport: chatTransport,
    onError: (err) => {
      toast.error(err.message || "Chat error. Please try again.");
    },
    onFinish: (msg) => {
      setStoredMessages((prev: unknown[]) => [...prev, msg]);
    },
  });

  useEffect(() => {
    localStorage.setItem("workplace-chat-messages", JSON.stringify(messages));
  }, [messages]);

  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const clearChat = () => {
    setMessages([]);
    setStoredMessages([]);
    localStorage.removeItem("workplace-chat-messages");
    toast.success("Chat cleared");
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-3xl flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            AI Chatbot
          </h1>
          <p className="text-muted-foreground">
            Ask anything about productivity, writing, planning, and more.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearChat}>
          <Trash2 className="mr-1 h-4 w-4" />
          Clear
        </Button>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
          <div
            ref={scrollRef}
            className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4"
          >
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                <Bot className="mb-3 h-10 w-10 text-primary/40" />
                <p className="text-sm font-medium">How can I help you today?</p>
                <p className="mt-1 max-w-xs text-center text-xs">
                  I can help with emails, meeting notes, task planning, research,
                  and general workplace productivity questions.
                </p>
              </div>
            )}

            {messages.map((message) => {
              const isUser = message.role === "user";
              const text = message.parts
                .map((part) => (part.type === "text" ? part.text : ""))
                .join("");

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {text}
                  </div>
                </div>
              );
            })}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t bg-card p-3"
          >
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="min-h-[44px] resize-none"
                rows={1}
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
