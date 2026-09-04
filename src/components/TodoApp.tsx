'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Task, FilterOption, SortOption, TaskStats } from '@/types/todo';
import { loadTasksFromStorage, saveTasksToStorage } from '@/utils/storage';
import { isTaskOverdue, getDefaultDueDateTime, getLocalISOString } from '@/utils/dateUtils';
import { TaskInput } from './TaskInput';
import { TaskList } from './TaskList';
import { TaskFilters } from './TaskFilters';
import { TaskSort } from './TaskSort';
import { TaskStatsComponent } from './TaskStats';
import { CheckSquare, Trash2, Bot } from 'lucide-react';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';

export const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'dueDateTime',
    direction: 'asc',
  });
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
    const filtered = tasks.filter((t) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesDesc = t.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      if (filter === 'overdue') return isTaskOverdue(t.dueDateTime, t.completed);
      return true;
    });

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
      description: newTaskData.description ? newTaskData.description.trim() : undefined,
      dueDateTime: newTaskData.dueDateTime,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

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
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  // -------------------------------------------------------------
  // COPILOTKIT INTEGRATION: AI State Awareness & Automation Actions
  // -------------------------------------------------------------

  // 1. Give the AI real-time context about tasks, current time, and overdue items
  useCopilotReadable({
    description: 'Current state of user tasks, due dates, overdue statuses, and summary statistics',
    value: {
      tasks: tasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description || '',
        dueDateTime: t.dueDateTime,
        completed: t.completed,
        isOverdue: isTaskOverdue(t.dueDateTime, t.completed),
      })),
      stats,
      currentDateTime: new Date().toISOString(),
      currentFilter: filter,
      searchQuery,
    },
  });

  // 2. Action: Add a new task
  useCopilotAction({
    name: 'addTask',
    description: 'Create a new task with a title, optional description, and a due date/time (ISO 8601 string).',
    parameters: [
      {
        name: 'title',
        type: 'string',
        description: 'The title or name of the task to create',
        required: true,
      },
      {
        name: 'dueDateTime',
        type: 'string',
        description: 'Due date and time in ISO format (YYYY-MM-DDTHH:mm), e.g. 2026-09-05T15:00',
        required: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'Optional additional notes or description for the task',
        required: false,
      },
    ],
    handler: async ({ title, dueDateTime, description }) => {
      const finalDue = dueDateTime || getDefaultDueDateTime();
      const created = handleAddTask({
        title,
        dueDateTime: finalDue,
        description,
      });
      return `Created task: "${created.title}" with due date ${created.dueDateTime}.`;
    },
  });

  // 3. Action: Delete task
  useCopilotAction({
    name: 'deleteTask',
    description: 'Delete a task from the list by its ID or by matching title.',
    parameters: [
      {
        name: 'identifier',
        type: 'string',
        description: 'Task ID or task title to delete',
        required: true,
      },
    ],
    handler: async ({ identifier }) => {
      const target = tasks.find(
        (t) => t.id === identifier || t.title.toLowerCase().includes(identifier.toLowerCase())
      );
      if (!target) {
        return `Could not find a task matching "${identifier}".`;
      }
      handleDelete(target.id);
      return `Deleted task: "${target.title}".`;
    },
  });

  // 4. Action: Toggle or set task completion
  useCopilotAction({
    name: 'setTaskCompletion',
    description: 'Mark a task as complete or incomplete by its ID or title.',
    parameters: [
      {
        name: 'identifier',
        type: 'string',
        description: 'Task ID or task title',
        required: true,
      },
      {
        name: 'completed',
        type: 'boolean',
        description: 'True to mark as complete/done, false to mark as incomplete/pending',
        required: true,
      },
    ],
    handler: async ({ identifier, completed }) => {
      const target = tasks.find(
        (t) => t.id === identifier || t.title.toLowerCase().includes(identifier.toLowerCase())
      );
      if (!target) {
        return `Could not find a task matching "${identifier}".`;
      }
      if (target.completed !== completed) {
        handleToggleComplete(target.id);
      }
      return `Marked "${target.title}" as ${completed ? 'completed' : 'incomplete'}.`;
    },
  });

  // 5. Action: Reschedule task (especially useful for overdue tasks!)
  useCopilotAction({
    name: 'rescheduleTask',
    description: 'Update the due date and time of an existing task (e.g. reschedule overdue items).',
    parameters: [
      {
        name: 'identifier',
        type: 'string',
        description: 'Task ID or task title',
        required: true,
      },
      {
        name: 'newDueDateTime',
        type: 'string',
        description: 'The new due date/time in ISO format (YYYY-MM-DDTHH:mm)',
        required: true,
      },
    ],
    handler: async ({ identifier, newDueDateTime }) => {
      const target = tasks.find(
        (t) => t.id === identifier || t.title.toLowerCase().includes(identifier.toLowerCase())
      );
      if (!target) {
        return `Could not find a task matching "${identifier}".`;
      }
      handleUpdate(target.id, { dueDateTime: newDueDateTime });
      return `Rescheduled "${target.title}" to ${newDueDateTime}.`;
    },
  });

  // 6. Action: Filter and Search
  useCopilotAction({
    name: 'filterTasks',
    description: 'Filter or search the tasks in the view.',
    parameters: [
      {
        name: 'filter',
        type: 'string',
        description: 'Filter mode: "all", "active", "completed", or "overdue"',
        required: false,
      },
      {
        name: 'searchQuery',
        type: 'string',
        description: 'Search keyword to filter by (or empty string to clear search)',
        required: false,
      },
    ],
    handler: async ({ filter: newFilter, searchQuery: newSearch }) => {
      if (newFilter && ['all', 'active', 'completed', 'overdue'].includes(newFilter)) {
        setFilter(newFilter as FilterOption);
      }
      if (newSearch !== undefined) {
        setSearchQuery(newSearch);
      }
      return `View updated (filter: ${newFilter || filter}, search: "${newSearch ?? searchQuery}").`;
    },
  });

  // 7. Action: Clear all completed tasks
  useCopilotAction({
    name: 'clearCompletedTasks',
    description: 'Remove all finished / completed tasks from the list.',
    parameters: [],
    handler: async () => {
      const completedCount = tasks.filter((t) => t.completed).length;
      handleClearCompleted();
      return `Cleared ${completedCount} completed tasks.`;
    },
  });

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
            Stay on track with smart due dates, overdue alerts, and AI automation.
          </p>
        </div>

        {/* Action buttons */}
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

      {/* Copilot AI Assistant Sidebar */}
      <CopilotSidebar
        instructions={
          'You are TaskFlow AI, an intelligent personal task manager. ' +
          'You can add tasks with date/time, mark tasks complete or incomplete, delete tasks, ' +
          'reschedule overdue tasks, and filter or search tasks. ' +
          'Always use the provided actions (addTask, deleteTask, setTaskCompletion, rescheduleTask, filterTasks, clearCompletedTasks) to modify the state directly.'
        }
        labels={{
          title: 'TaskFlow AI Copilot',
          initial: 'Hi! I can help automate your tasks. Try asking:\n• "Add a task: Review roadmap tomorrow at 4 PM"\n• "What tasks are overdue?"\n• "Mark the completed tasks done"\n• "Reschedule overdue tasks to tomorrow"',
        }}
        defaultOpen={false}
        clickOutsideToClose={true}
      />
    </div>
  );
};
