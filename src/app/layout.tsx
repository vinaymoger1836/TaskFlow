import type { Metadata } from 'next';
import './globals.css';

import { CopilotProvider } from '@/components/CopilotProvider';

export const metadata: Metadata = {
  title: 'TaskFlow | Clean & Responsive Todo App',
  description: 'Manage tasks with due dates, overdue alerts, custom filters, and sorting.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <CopilotProvider>{children}</CopilotProvider>
      </body>
    </html>
  );
}
