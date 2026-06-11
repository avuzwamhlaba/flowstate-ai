# AI Workplace Productivity Assistant

An AI-powered productivity suite that helps professionals automate and streamline everyday workplace tasks. Built with modern web technologies and integrated with the Lovable AI Gateway for intelligent content generation.

## Features

| Tool | Description |
|------|-------------|
| **Smart Email Generator** | Generate professional emails in formal, casual, or persuasive tones tailored to any recipient and purpose. |
| **Meeting Notes Summarizer** | Upload meeting transcripts and instantly extract summaries, key decisions, action items, and deadlines. |
| **AI Task Planner** | Turn a list of tasks into a prioritized, time-blocked schedule for the day, week, or month. |
| **Research Assistant** | Conduct AI-powered research on any topic and receive structured summaries with key findings and recommendations. |
| **AI Chatbot** | A conversational assistant for general workplace productivity questions and brainstorming. |

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) — full-stack React with file-based routing
- **Styling:** Tailwind CSS v4 with a custom "slate + emerald" design token system
- **UI Components:** shadcn/ui
- **AI Layer:** Lovable AI Gateway (google/gemini-3-flash-preview)
- **Server Functions:** TanStack `createServerFn` for type-safe RPC
- **Type Safety:** TypeScript + Zod validation

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 20+
- A Lovable API key (set via environment variable)

### Installation

```bash
# Install dependencies
bun install

# Set your environment variables
cp .env.example .env
# Edit .env and add: LOVABLE_API_KEY=your_key_here

# Start the dev server
bun dev
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── components/
│   ├── app-layout.tsx          # Root layout with sidebar
│   ├── app-sidebar.tsx         # Navigation sidebar
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── ai-gateway.server.ts    # Lovable AI Gateway client
│   ├── email.functions.ts      # Email generation server function
│   ├── meeting.functions.ts    # Meeting summarization server function
│   ├── planner.functions.ts    # Task planning server function
│   └── research.functions.ts   # Research assistant server function
├── routes/
│   ├── __root.tsx              # Root route (shell)
│   ├── index.tsx               # Dashboard overview
│   ├── email.tsx               # Smart Email Generator
│   ├── meeting.tsx             # Meeting Notes Summarizer
│   ├── planner.tsx             # AI Task Planner
│   ├── research.tsx            # Research Assistant
│   ├── chat.tsx                # AI Chatbot
│   └── api/chat.ts             # Streaming chat API endpoint
├── router.tsx                  # TanStack Router configuration
├── start.ts                    # App entry point
└── styles.css                  # Global styles + design tokens
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `LOVABLE_API_KEY` | Yes | Your Lovable AI Gateway API key |

## Key Design Decisions

- **No login required** — all data persists locally in the browser via `localStorage`, ensuring instant access and privacy.
- **Editable AI outputs** — every generated result can be edited and copied, so users always have full control.
- **Responsible AI disclaimer** — prominently displayed across the app to encourage thoughtful use of AI-generated content.
- **Fully responsive** — optimized for desktop, tablet, and mobile viewports.

## Roadmap

- [ ] Email client integrations (Gmail, Outlook)
- [ ] Calendar platform integrations (Google Calendar, Outlook Calendar)
- [ ] Export summaries and task plans to PDF / spreadsheets
- [ ] Personalized AI recommendations based on usage history
- [ ] Conversation thread persistence with user accounts

## License

MIT
