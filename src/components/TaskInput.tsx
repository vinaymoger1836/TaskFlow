'use client';

import React, { useState } from 'react';
import { Plus, Calendar, Clock, Sparkles } from 'lucide-react';
import { getDefaultDueDateTime, getLocalISOString } from '@/utils/dateUtils';

interface TaskInputProps {
  onAddTask: (task: {
    title: string;
    description?: string;
    dueDateTime: string;
  }) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDateTime, setDueDateTime] = useState(getDefaultDueDateTime());
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }

    if (!dueDateTime) {
      setError('Please select a due date and time');
      return;
    }

    onAddTask({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDateTime,
    });

    setTitle('');
    setDescription('');
    setDueDateTime(getDefaultDueDateTime());
    setIsExpanded(false);
    setError('');
  };

  // Quick preset dates
  const setQuickDate = (type: 'today_eve' | 'tomorrow_morn' | 'weekend') => {
    const d = new Date();
    if (type === 'today_eve') {
      d.setHours(18, 0, 0, 0);
      if (d.getTime() < Date.now()) {
        d.setHours(21, 0, 0, 0);
      }
    } else if (type === 'tomorrow_morn') {
      d.setDate(d.getDate() + 1);
      d.setHours(9, 0, 0, 0);
    } else if (type === 'weekend') {
      const day = d.getDay();
      const daysUntilSaturday = (6 - day + 7) % 7 || 7;
      d.setDate(d.getDate() + daysUntilSaturday);
      d.setHours(10, 0, 0, 0);
    }
    setDueDateTime(getLocalISOString(d));
    setIsExpanded(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-all duration-200 focus-within:shadow-md focus-within:border-indigo-500 dark:focus-within:border-indigo-500/80"
    >
      <div className="flex flex-col gap-3">
        {/* Main Title Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a new task... (e.g., Complete project report)"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            onFocus={() => setIsExpanded(true)}
            className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none text-base sm:text-lg font-medium"
          />

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>

        {error && (
          <p className="text-xs text-rose-500 font-medium">{error}</p>
        )}

        {/* Expanded Details Section */}
        {isExpanded && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Description (Optional) */}
            <input
              type="text"
              placeholder="Add description or notes (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            {/* Due Date & Time */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  Due Date & Time:
                </span>
                <input
                  type="datetime-local"
                  required
                  value={dueDateTime}
                  onChange={(e) => setDueDateTime(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-[11px] text-slate-400 hidden md:inline flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Quick:
                </span>
                <button
                  type="button"
                  onClick={() => setQuickDate('today_eve')}
                  className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition cursor-pointer whitespace-nowrap"
                >
                  Tonight
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate('tomorrow_morn')}
                  className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition cursor-pointer whitespace-nowrap"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate('weekend')}
                  className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition cursor-pointer whitespace-nowrap"
                >
                  This Weekend
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
