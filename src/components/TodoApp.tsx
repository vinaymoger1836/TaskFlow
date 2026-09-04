'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Task, FilterOption, SortOption, TaskStats } from '@/types/todo';
import { loadTasksFromStorage, saveTasksToStorage } from '@/utils/storage';
import { isTaskOverdue } from '@/utils/dateUtils';
import { TaskInput } from './TaskInput';
import { TaskList } from './TaskList';
import { TaskFilters } from './TaskFilters';
import { TaskSort } from './TaskSort';
import { TaskStatsComponent } from './TaskStats';
import { CheckSquare, Sparkles, RefreshCw, Trash2 } from 'lucide-react';

export const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'dueDateTime',
    direction: 'asc',
  });
  // Time tick to automatically refresh overdue badges every 30 seconds
  const [, setTick] = useState(0);

  // Initialize from storage on mount
  useEffect(() => {
    const savedTasks = loadTasksFromStorage();
    setTasks(savedTasks);
    setIsLoaded(true);
  }, []);

  // Sync to storage on task changes
  useEffect(() => {
    if (isLoaded) {
      saveTasksToStorage(tasks);
    }
  }, [tasks, isLoaded]);

  // Periodic tick for live overdue status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Compute Task Statistics
  const stats: TaskStats = useMemo(() => {
    let completed = 0;
    let overdue = 0;

    tasks.forEach((t) => {
      if (t.completed) {
        completed++;
      } else if (isTaskOverdue(t.dueDateTime, t.completed)) {
        overdue++;
      }
    });

    return {
      total: tasks.length,
      completed,
      active: tasks.length - completed,
      overdue,
    };
  }, [tasks]);

  // Filter and Sort Tasks
  const filteredAndSortedTasks = useMemo(() => {
    // 1. Filter
    const filtered = tasks.filter((t) => {
      // Keyword search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesDesc = t.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Tab filter
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      if (filter === 'overdue') return isTaskOverdue(t.dueDateTime, t.completed);
      return true; // 'all'
    });

    // 2. Sort
    return filtered.sort((a, b) => {
      let comparison = 0;

      if (sortOption.field === 'dueDateTime') {
        const dateA = new Date(a.dueDateTime).getTime() || 0;
        const dateB = new Date(b.dueDateTime).getTime() || 0;
        comparison = dateA - dateB;
      } else if (sortOption.field === 'createdAt') {
        const dateA = new Date(a.createdAt).getTime() || 0;
        const dateB = new Date(b.createdAt).getTime() || 0;
        comparison = dateA - dateB;
      } else if (sortOption.field === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortOption.field === 'status') {
        // Active tasks first by default
        comparison = Number(a.completed) - Number(b.completed);
      }

      return sortOption.direction === 'asc' ? comparison : -comparison;
    });
  }, [tasks, filter, searchQuery, sortOption]);

  // Handlers
  const handleAddTask = (newTaskData: {
    title: string;
    description?: string;
    dueDateTime: string;
  }) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: newTaskData.title,
      description: newTaskDataDataCheck(newTaskData.description),
      dueDateTime: newTaskData.dueDateTime,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    setTasks((prev) => [newTask, ...prev]);
  };

  const newTaskDataDataCheck = (desc?: string) => (desc ? desc.trim() : undefined);

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const newCompleted = !t.completed;
        return {
          ...t,
          completed: newCompleted,
          completedAt: newCompleted ? new Date().toISOString() : null,
        };
      })
    );
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdate = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const handleClearCompleted = () => {
    if (confirm('Are you sure you want to remove all completed tasks?')) {
      setTasks((prev) => prev.filter((t) => !t.completed));
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-none">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              TaskFlow
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay on track with smart due dates, overdue alerts, and easy sorting.
          </p>
        </div>

        {/* Action badges */}
        <div className="flex items-center gap-2">
          {stats.completed > 0 && (
            <button
              onClick={handleClearCompleted}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900 transition shadow-2xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Done ({stats.completed})</span>
            </button>
          )}
        </div>
      </header>

      {/* Task Summary Metrics */}
      <TaskStatsComponent stats={stats} />

      {/* Add Task Input Form */}
      <section aria-label="Add new task">
        <TaskInput onAddTask={handleAddTask} />
      </section>

      {/* Controls: Filter tabs & Sort */}
      <section className="flex flex-col gap-3 pt-2" aria-label="Filter and sort controls">
        <TaskFilters
          currentFilter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          stats={stats}
        />

        <div className="flex items-center justify-between gap-2 px-1">
          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{filteredAndSortedTasks.length}</span> {filteredAndSortedTasks.length === 1 ? 'task' : 'tasks'}
            {filter !== 'all' && (
              <span> in <span className="capitalize font-semibold text-indigo-600 dark:text-indigo-400">{filter}</span></span>
            )}
          </div>
          <TaskSort sortOption={sortOption} onSortChange={setSortOption} />
        </div>
      </section>

      {/* Task List */}
      <main aria-label="Task list" className="mt-1">
        <TaskList
          tasks={filteredAndSortedTasks}
          filter={filter}
          searchQuery={searchQuery}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onResetFilters={() => {
            setFilter('all');
            setSearchQuery('');
          }}
        />
      </main>
    </div>
  );
};
