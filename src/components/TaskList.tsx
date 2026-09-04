'use client';

import React from 'react';
import { Task, FilterOption } from '@/types/todo';
import { TaskItem } from './TaskItem';
import { CheckCircle2, ClipboardList, AlertCircle, SearchX } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  filter: FilterOption;
  searchQuery: string;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onResetFilters: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  searchQuery,
  onToggleComplete,
  onDelete,
  onUpdate,
  onResetFilters,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center shadow-xs">
        {searchQuery ? (
          <>
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <SearchX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              No matching tasks found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              We couldn't find any tasks matching "{searchQuery}". Try a different keyword.
            </p>
            <button
              onClick={onResetFilters}
              className="mt-4 px-3 py-1.5 text-xs rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900 transition cursor-pointer"
            >
              Clear search filter
            </button>
          </>
        ) : filter === 'overdue' ? (
          <>
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-500 mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              No overdue tasks!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              You are right on schedule. Keep up the great work!
            </p>
          </>
        ) : filter === 'completed' ? (
          <>
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              No completed tasks yet
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Check off tasks as you finish them to track your progress.
            </p>
          </>
        ) : filter === 'active' ? (
          <>
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-500 mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              All caught up!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              No active tasks remaining. Relax or create a new task above.
            </p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Your task list is empty
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add your first task above with a due date and time to stay organized.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};
