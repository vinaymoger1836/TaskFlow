'use client';

import React from 'react';
import { FilterOption, TaskStats } from '@/types/todo';
import { Search, X, AlertTriangle, CheckCircle2, Clock, Layers } from 'lucide-react';

interface TaskFiltersProps {
  currentFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  stats: TaskStats;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  stats,
}) => {
  const tabs: { id: FilterOption; label: string; count: number; icon: React.ReactNode }[] = [
    {
      id: 'all',
      label: 'All',
      count: stats.total,
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      id: 'active',
      label: 'Active',
      count: stats.active,
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    {
      id: 'completed',
      label: 'Completed',
      count: stats.completed,
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    {
      id: 'overdue',
      label: 'Overdue',
      count: stats.overdue,
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = currentFilter === tab.id;
          const isOverdueTab = tab.id === 'overdue';

          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? isOverdueTab
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                  : isOverdueTab && tab.count > 0
                  ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`ml-0.5 text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isActive
                    ? 'bg-black/10 dark:bg-white/20'
                    : isOverdueTab && tab.count > 0
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Filter by keyword..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-8 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
