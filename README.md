# TaskFlow - Modern Next.js Todo Application with AI Copilot

A responsive, visually appealing, and feature-complete Todo web application built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **CopilotKit**.

---

## ✨ Key Features

### 🤖 AI Task Automation (CopilotKit Sidebar)
- **Slide-Out AI Sidebar (`<CopilotSidebar>`)**: Non-intrusive chat drawer that lets you control your entire todo list with conversational language.
- **Full Action Suite**:
  - **Add Tasks**: *"Schedule doctor appointment tomorrow at 10 AM with note: take medical reports"*
  - **Edit & Update**: *"Update description of the medicine task to take after dinner"*
  - **Reschedule**: *"Reschedule my overdue meeting to Friday at 4 PM"*
  - **Status Toggles**: *"Mark the grocery shopping task as completed"*
  - **Bulk Actions**: *"Clear all completed tasks"*
  - **Filter & Search**: *"Show me only active tasks"* or *"Filter tasks by project"*
- **Strict Past Date Guardrails**: The AI will politely refuse requests to schedule tasks with past due dates/times and guide you to specify a future time.

### 📅 Smart Scheduling & Due Date Management
- **Future-Only Scheduling**: Scheduling tasks in the past is strictly prohibited across the app:
  - Native HTML `min` attribute prevents selecting past timestamps in browser pickers.
  - Form validations reject past submissions with clear visual error feedback.
  - Smart presets (*Tonight*, *Tomorrow*, *This Weekend*) automatically adjust (e.g., rolling over to tomorrow if the evening time has already passed).
- **Automatic Overdue Highlighting**: Incomplete tasks past their deadline automatically feature pulsating alert badges, warning ribbons, and dynamic elapsed time indicators (e.g., *Overdue by 2h 15m*).
- **Relative Due Badges**: Visual indicators for tasks *Due today*, *Due tomorrow*, or *Due in N days*.

### 🔍 Dynamic Filtering & Sorting
- **Filter Tabs**: Instantly switch between **All**, **Active**, **Completed**, and **Overdue** with live counter badges.
- **Instant Search**: Real-time keyword search across task titles and descriptions.
- **Flexible Sorting**: Sort by **Due Date**, **Creation Date**, **Title (A-Z)**, or **Status (Active/Done)** with an Ascending/Descending toggle.

### ✏️ Inline Editing & Organization
- Edit task titles, notes, and due dates directly within each task card without modal interruptions.
- Quick checkboxes with completion timestamps and strikethrough styling.

### 💾 Local Persistence
- Automatically persists your tasks in browser `localStorage`.
- Starts with a clean empty slate (no unwanted mock data).

---

## ⚡ Supported AI Providers (Free Options Available)

TaskFlow uses `@copilotkit/runtime/v2` with AI SDK Factory Mode (`groq.chat(...)`) for reliable multi-turn tool calling without errors. You can configure any of the following in `.env.local`:

| Provider | Model Example | Pricing | Setup Link |
|---|---|---|---|
| **Groq** *(Recommended)* | `openai/gpt-oss-120b`, `qwen/qwen3.6-27b` | **100% Free** & Ultra Fast | [console.groq.com/keys](https://console.groq.com/keys) |
| **Google Gemini** | `gemini-3.6-flash` | **100% Free** | [aistudio.google.com](https://aistudio.google.com/) |
| **OpenRouter** | `meta-llama/llama-3.3-70b-instruct:free` | Free community tier | [openrouter.ai/keys](https://openrouter.ai/keys) |
| **OpenAI** | `gpt-4o-mini` | Paid API key | [platform.openai.com](https://platform.openai.com/) |

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd ToDo
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Choose your preferred provider. For example, using **Groq** (Free):
```env
GROQ_API_KEY=gsk_your_groq_key_here
GROQ_MODEL=openai/gpt-oss-120b
```

Or using **Google Gemini** (Free):
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. Click the AI Assistant icon in the sidebar to open the chat drawer.

### 4. Production Build
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
ToDo/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── copilotkit/
│   │   │       └── route.ts         # CopilotKit v2 BuiltInAgent endpoint with Factory Mode
│   │   ├── globals.css              # Tailwind CSS directives and custom styling
│   │   ├── layout.tsx               # Server Component root layout
│   │   └── page.tsx                 # Root page rendering TodoApp
│   ├── components/
│   │   ├── CopilotSidebarWrapper.tsx # Client-isolated slide-out CopilotSidebar
│   │   ├── TaskFilters.tsx          # Status filter tabs with live counters & search input
│   │   ├── TaskInput.tsx            # Task creation form with datetime picker & min validation
│   │   ├── TaskItem.tsx             # Single task card with overdue badge & inline edit
│   │   ├── TaskList.tsx             # Task list container with empty state illustrations
│   │   ├── TaskSort.tsx             # Sort dropdown (field & ascending/descending)
│   │   ├── TaskStats.tsx            # Summary statistics cards (Total, Active, Done, Overdue)
│   │   └── TodoApp.tsx              # App state, CopilotKit hooks (useCopilotReadable & actions)
│   ├── types/
│   │   └── todo.ts                  # TypeScript interfaces (Task, FilterOption, SortOption, etc.)
│   └── utils/
│       ├── dateUtils.ts             # Date calculation, overdue checks, formatting, past-date guards
│       └── storage.ts               # LocalStorage persistence helpers (clean initial state)
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore configuration
├── next.config.mjs                  # Next.js configuration (serverExternalPackages for runtime)
├── tailwind.config.ts               # Tailwind CSS theme and styling configuration
├── tsconfig.json                    # TypeScript compiler options
└── package.json                     # Dependencies and scripts
```

---

## 🛡️ Architecture & Design Decisions

1. **Pure Server Component Root Layout**:
   - Next.js root `layout.tsx` is kept free of heavy client-side AI bundles, preventing `ChunkLoadError` timeouts.
   - CopilotKit is hosted in `TodoApp.tsx` and the sidebar is lazy-loaded with `{ ssr: false }`.

2. **CopilotKit v2 Factory Mode**:
   - `BuiltInAgent` uses Factory Mode (`type: 'aisdk'`) instead of classic Simple Mode.
   - This prevents auto-injected state mutation tools (`AGUISendStateDelta`) from conflicting with local React state, directing all AI actions exclusively through our verified application handlers (`addTask`, `updateTask`, `deleteTask`, etc.).

3. **Multi-Turn Chat Completion Routing**:
   - For Groq and OpenAI-compatible providers, `groq.chat(...)` targets the `/chat/completions` endpoint directly, ensuring smooth multi-turn conversations and tool executions without unsupported field errors.

