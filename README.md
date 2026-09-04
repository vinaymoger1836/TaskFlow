# TaskFlow - Modern Next.js Todo Application with AI Copilot

A responsive, visually appealing, and feature-complete Todo web application built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **CopilotKit**.

## ✨ Features

- **🤖 AI Task Automation (CopilotKit)**:
  - Natural language task creation (e.g. *"Schedule team retrospective tomorrow at 3 PM"*).
  - Smart rescheduling (e.g. *"Reschedule all overdue tasks to tomorrow morning"*).
  - Status management (e.g. *"Mark the review task as completed"*).
  - Natural language filtering and searching.
  - Floating AI assistant chat bubble (`<CopilotPopup>`).
- **Add Tasks with Due Date & Time**: Schedule tasks with precise target timestamps using a native `datetime-local` picker or convenient quick presets (*Tonight*, *Tomorrow*, *This Weekend*).
- **Overdue Detection & Highlight**: Automatically detects and highlights past-due incomplete tasks with prominent pulsating alert badges, warning ribbons, and dynamic time elapsed calculation (e.g. *Overdue by 2h 15m*).
- **Complete & Incomplete Toggle**: Check off finished tasks with smooth strikethrough styling and completion timestamps, or toggle them back to pending.
- **Dynamic Filtering**:
  - **All**: View all tasks.
  - **Active**: View incomplete/pending tasks.
  - **Completed**: View finished tasks.
  - **Overdue**: Immediate filter to inspect only tasks that require urgent attention.
  - **Keyword Search**: Real-time filtering across task titles and descriptions.
- **Flexible Sorting**:
  - Sort by **Due Date**, **Creation Date**, **Alphabetical (Title)**, or **Completion Status**.
  - Toggle between **Ascending** and **Descending** directions.
- **Inline Task Editing**: Edit titles, descriptions, and due dates directly within each task item without disruptive page navigation.
- **Client-Side Persistence**: Fully integrated with browser `localStorage` to keep your tasks across page reloads without requiring complex database setups.
- **Responsive & Modern UI**: Built with Tailwind CSS, Lucide icons, dark/light mode responsive theme, clean cards, and accessible forms.

## 🚀 Getting Started

### 1. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

## 📁 Project Structure

```
ToDo/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── copilotkit/
│   │   │       └── route.ts # CopilotKit Next.js App Router API endpoint
│   │   ├── globals.css      # Tailwind directives and custom variables
│   │   ├── layout.tsx       # Root layout wrapping CopilotProvider
│   │   └── page.tsx         # Main entry page
│   ├── components/
│   │   ├── CopilotProvider.tsx # Client-side CopilotKit provider wrapper
│   │   ├── TaskFilters.tsx  # Filter tabs & search bar
│   │   ├── TaskInput.tsx    # New task form with datetime picker
│   │   ├── TaskItem.tsx     # Single task with overdue badge & inline edit
│   │   ├── TaskList.tsx     # Task list with empty state illustrations
│   │   ├── TaskSort.tsx     # Sort controls (field & direction)
│   │   ├── TaskStats.tsx    # Summary metrics (Total, Active, Done, Overdue)
│   │   └── TodoApp.tsx      # Main application state, CopilotKit hooks & popup
│   ├── types/
│   │   └── todo.ts          # TypeScript interfaces
│   └── utils/
│       ├── dateUtils.ts     # Due date calculations, overdue checks, formatting
│       └── storage.ts       # LocalStorage helpers (clean initial state)
├── .env.example             # Template for API keys
├── .gitignore               # Comprehensive ignore rules
├── next.config.mjs          # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── postcss.config.mjs       # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies and scripts
```
