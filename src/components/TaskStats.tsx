'use client';

import React from 'react';
import { TaskStats } from '@/types/todo';
import { CheckCircle2, Clock, AlertTriangle, ListTodo } from 'lucide-react';

interface TaskStatsProps {
  stats: TaskStats;
}

export const TaskStatsComponent: React.FC<TaskStatsProps> = ({ stats }) => {
  const percentComplete = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
      {/* Total */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Total</span>
          <ListTodo className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.total}</div>
        <div className="text-[11px] text-slate-400 mt-0.5">All created tasks</div>
      </div>

      {/* Active */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Pending</span>
          <Clock className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.active}</div>
        <div className="text-[11px] text-slate-400 mt-0.5">Tasks to finish</div>
      </div>

      {/* Completed */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Done</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.completed}</span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">({percentComplete}%)</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
          <div
            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* Overdue */}
      <div className={`border rounded-xl p-3.5 shadow-sm transition hover:shadow-md ${
        stats.overdue > 0
          ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-medium uppercase tracking-wider ${
            stats.overdue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'
          }`}>
            Overdue
          </span>
          <AlertTriangle className={`w-4 h-4 ${stats.overdue > 0 ? 'text-rose-600 dark:text-rose-400 animate-bounce' : 'text-slate-400'}`} />
        </div>
        <div className={`text-2xl font-bold ${stats.overdue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-100'}`}>
          {stats.overdue}
        </div>
        <div className={`text-[11px] mt-0.5 ${stats.overdue > 0 ? 'text-rose-600/80 dark:text-rose-400/80 font-medium' : 'text-slate-400'}`}>
          {stats.overdue > 0 ? 'Requires attention' : 'No overdue tasks'}
        </div>
      </div>
    </div>
  );
};
