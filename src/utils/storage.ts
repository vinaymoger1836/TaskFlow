import { Task } from '@/types/todo';
import { getLocalISOString } from './dateUtils';

const STORAGE_KEY = 'nextjs_todo_app_tasks_v1';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'sample-1',
    title: 'Review project specifications and requirements',
    description: 'Ensure all requirements from the prompt are fully satisfied and edge cases covered.',
    dueDateTime: getLocalISOString(new Date(Date.now() - 4 * 60 * 60 * 1000)), // 4 hours ago (Overdue showcase!)
    completed: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
  },
  {
    id: 'sample-2',
    title: 'Prepare design system & responsive layout',
    description: 'Style with Tailwind CSS, clean icons, accessible states, and responsive breakpoints.',
    dueDateTime: getLocalISOString(new Date(Date.now() + 3 * 60 * 60 * 1000)), // In 3 hours (Due today)
    completed: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
  },
  {
    id: 'sample-3',
    title: 'Initialize Next.js project structure',
    description: 'Set up TypeScript, Tailwind CSS, PostCSS, and component hierarchy.',
    dueDateTime: getLocalISOString(new Date(Date.now() - 1 * 60 * 60 * 1000)),
    completed: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

export function loadTasksFromStorage(): Task[] {
  if (typeof window === 'undefined') {
    return INITIAL_TASKS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_TASKS;
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return INITIAL_TASKS;
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
}
