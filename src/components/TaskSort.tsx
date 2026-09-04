'use client';

import React from 'react';
import { SortField, SortOption, SortDirection } from '@/types/todo';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface TaskSortProps {
  sortOption: SortOption;
  onSortChange: (newOption: SortOption) => void;
}

export const TaskSort: React.FC<TaskSortProps> = ({ sortOption, onSortChange }) => {
  const handleFieldChange = (field: SortField) => {
    // If clicking same field, toggle direction, else keep direction
    if (sortOption.field === field) {
      onSortChange({
        field,
        direction: sortOption.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      onSortChange({
        field,
        direction: field === 'dueDateTime' ? 'asc' : 'desc', // default sensible direction
      });
    }
  };

  const toggleDirection = () => {
    onSortChange({
      ...sortOption,
      direction: sortOption.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const sortFields: { id: SortField; label: string }[] = [
    { id: 'dueDateTime', label: 'Due Date' },
    { id: 'createdAt', label: 'Created At' },
    { id: 'title', label: 'Title (A-Z)' },
    { id: 'status', label: 'Status' },
  ];

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-slate-400 font-medium hidden sm:inline flex items-center gap-1">
        <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
      </span>

      <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 shadow-xs">
        {sortFields.map((f) => {
          const isActive = sortOption.field === f.id;
          return (
            <button
              key={f.id}
              onClick={() => handleFieldChange(f.id)}
              className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          );
        })}

        <button
          onClick={toggleDirection}
          title={`Currently ${sortOption.direction === 'asc' ? 'Ascending' : 'Descending'} (Click to reverse)`}
          className="p-1 rounded-md text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ml-0.5"
        >
          {sortOption.direction === 'asc' ? (
            <ArrowUp className="w-3.5 h-3.5" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
