'use client';

import React, { useState } from 'react';
import { Task } from '@/types/todo';
import { getDueStatus, formatDateTime, getLocalISOString } from '@/utils/dateUtils';
import {
  Check,
  Trash2,
  Edit3,
  Calendar,
  AlertCircle,
  Clock,
  Save,
  X,
  CheckCircle2,
} from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editDueDateTime, setEditDueDateTime] = useState(task.dueDateTime);

  const dueStatus = getDueStatus(task.dueDateTime, task.completed);
  const isOverdue = dueStatus.isOverdue;

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return;
    onUpdate(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      dueDateTime: editDueDateTime,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditDueDateTime(task.dueDateTime);
    setIsEditing(false);
  };

  return (
    <div
      className={`group relative rounded-xl transition-all duration-200 border p-4 ${
        task.completed
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80'
          : isOverdue
          ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/80 shadow-sm shadow-rose-100 dark:shadow-none ring-1 ring-rose-400/30'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-800'
      }`}
    >
      {/* Overdue alert ribbon indicator on the left */}
      {isOverdue && !task.completed && (
        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-rose-500 rounded-l-xl" />
      )}

      {isEditing ? (
        /* Edit Mode */
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Task title"
            autoFocus
          />
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Task description (optional)"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Due:</span>
            <input
              type="datetime-local"
              value={editDueDateTime}
              onChange={(e) => setEditDueDateTime(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleCancelEdit}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        </div>
      ) : (
        /* Normal View Mode */
        <div className="flex items-start gap-3.5">
          {/* Checkbox button */}
          <button
            type="button"
            onClick={() => onToggleComplete(task.id)}
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            className={`mt-1 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
              task.completed
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 bg-white dark:bg-slate-800'
            }`}
          >
            {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <span
                className={`text-sm sm:text-base font-medium break-words transition-all ${
                  task.completed
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-800 dark:text-slate-100'
                }`}
              >
                {task.title}
              </span>

              {/* Action buttons */}
              <div className="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  title="Edit task"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(task.id)}
                  title="Delete task"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description if present */}
            {task.description && (
              <p
                className={`text-xs mt-1 break-words ${
                  task.completed
                    ? 'line-through text-slate-400/80 dark:text-slate-600'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {task.description}
              </p>
            )}

            {/* Metadata Footer: Due Date, Overdue Indicator, Relative Badge */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
              {/* Formatted Due Date */}
              <div className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatDateTime(task.dueDateTime)}</span>
              </div>

              {/* Status / Urgency Badge */}
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-medium text-[11px] ${dueStatus.urgencyColor}`}
              >
                {task.completed ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Completed</span>
                  </>
                ) : isOverdue ? (
                  <>
                    <AlertCircle className="w-3 h-3 text-rose-500 animate-spin-slow" />
                    <span className="font-semibold uppercase tracking-wider">OVERDUE • {dueStatus.label}</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3" />
                    <span>{dueStatus.label}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
