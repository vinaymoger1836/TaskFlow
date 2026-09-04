export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDateTime: string; // ISO string format: YYYY-MM-DDTHH:mm
  completed: boolean;
  createdAt: string; // ISO string format
  completedAt?: string | null;
}

export type FilterOption = 'all' | 'active' | 'completed' | 'overdue';

export type SortField = 'dueDateTime' | 'createdAt' | 'title' | 'status';

export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  field: SortField;
  direction: SortDirection;
}

export interface TaskStats {
  total: number;
  completed: number;
  active: number;
  overdue: number;
}
