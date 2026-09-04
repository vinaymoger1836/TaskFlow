/**
 * Check if a task is overdue (dueDateTime is in the past and task is not completed)
 */
export function isTaskOverdue(dueDateTime: string, completed: boolean): boolean {
  if (completed || !dueDateTime) return false;
  const dueDate = new Date(dueDateTime);
  if (isNaN(dueDate.getTime())) return false;
  return dueDate.getTime() < Date.now();
}

/**
 * Check if a task is due soon (within next 24 hours and not overdue)
 */
export function isTaskDueSoon(dueDateTime: string, completed: boolean): boolean {
  if (completed || !dueDateTime) return false;
  const dueDate = new Date(dueDateTime);
  if (isNaN(dueDate.getTime())) return false;
  const now = Date.now();
  const diffMs = dueDate.getTime() - now;
  return diffMs > 0 && diffMs <= 24 * 60 * 60 * 1000;
}

/**
 * Format date time string to human-readable format
 * e.g., "Sep 4, 2026 at 04:30 PM"
 */
export function formatDateTime(dateTimeStr: string): string {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  if (isNaN(date.getTime())) return dateTimeStr;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Return relative time label and badge variant
 */
export function getDueStatus(dueDateTime: string, completed: boolean): {
  label: string;
  isOverdue: boolean;
  isDueSoon: boolean;
  urgencyColor: string;
} {
  if (completed) {
    return {
      label: 'Completed',
      isOverdue: false,
      isDueSoon: false,
      urgencyColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    };
  }

  const dueDate = new Date(dueDateTime);
  if (isNaN(dueDate.getTime())) {
    return {
      label: 'No valid date',
      isOverdue: false,
      isDueSoon: false,
      urgencyColor: 'text-zinc-500 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700',
    };
  }

  const now = Date.now();
  const diffMs = dueDate.getTime() - now;

  if (diffMs < 0) {
    const elapsedMinutes = Math.floor(Math.abs(diffMs) / (1000 * 60));
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);

    let relativeText = '';
    if (elapsedDays > 0) {
      relativeText = `Overdue by ${elapsedDays}d ${elapsedHours % 24}h`;
    } else if (elapsedHours > 0) {
      relativeText = `Overdue by ${elapsedHours}h ${elapsedMinutes % 60}m`;
    } else {
      relativeText = `Overdue by ${Math.max(1, elapsedMinutes)}m`;
    }

    return {
      label: relativeText,
      isOverdue: true,
      isDueSoon: false,
      urgencyColor: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 animate-pulse',
    };
  }

  // Future due date
  const remainingMinutes = Math.floor(diffMs / (1000 * 60));
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingDays = Math.floor(remainingHours / 24);

  if (remainingDays === 0 && remainingHours < 24) {
    const timeString = dueDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const label = remainingHours > 0 
      ? `Due today in ${remainingHours}h ${remainingMinutes % 60}m`
      : `Due soon in ${remainingMinutes}m`;

    return {
      label,
      isOverdue: false,
      isDueSoon: true,
      urgencyColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    };
  }

  if (remainingDays === 1) {
    const timeString = dueDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return {
      label: `Due tomorrow at ${timeString}`,
      isOverdue: false,
      isDueSoon: false,
      urgencyColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
    };
  }

  return {
    label: `Due in ${remainingDays} days`,
    isOverdue: false,
    isDueSoon: false,
    urgencyColor: 'text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700',
  };
}

/**
 * Get formatted local datetime-local string for HTML input (YYYY-MM-DDTHH:mm)
 */
export function getLocalISOString(date: Date = new Date()): string {
  const pad = (num: number) => String(num).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Returns a default due date 2 hours ahead of now
 */
export function getDefaultDueDateTime(): string {
  const date = new Date(Date.now() + 2 * 60 * 60 * 1000);
  return getLocalISOString(date);
}

/**
 * Check if a date/time string is in the past (with a 60-second grace window for user interaction latency)
 */
export function isDateTimeInPast(dateTimeStr: string, gracePeriodMs: number = 60000): boolean {
  if (!dateTimeStr) return false;
  const date = new Date(dateTimeStr);
  if (isNaN(date.getTime())) return false;
  return date.getTime() < Date.now() - gracePeriodMs;
}

/**
 * Get current local ISO string for HTML input min attribute (YYYY-MM-DDTHH:mm)
 */
export function getMinDueDateTime(): string {
  return getLocalISOString(new Date());
}

