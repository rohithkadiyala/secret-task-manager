/**
 * To-Do type definition for the secret agency application
 * Each to-do represents a task that agents need to complete
 */
export interface Todo {
  id: string;
  codename: string; // The to-do title/name
  briefing: string; // Optional description/details
  priority: 'low' | 'medium' | 'high' | 'critical'; // Priority level
  status: 'inactive' | 'active' | 'completed';
  createdAt: Date;
  dueDate?: Date; // Optional due date
  completedAt?: Date;
}

/**
 * Priority level configuration for visual styling
 */
export const PRIORITY_LEVELS = {
  low: {
    label: 'LOW',
    color: 'text-success',
    bgColor: 'bg-success/20',
    borderColor: 'border-success/50',
  },
  medium: {
    label: 'MEDIUM',
    color: 'text-warning',
    bgColor: 'bg-warning/20',
    borderColor: 'border-warning/50',
  },
  high: {
    label: 'HIGH',
    color: 'text-accent',
    bgColor: 'bg-accent/20',
    borderColor: 'border-accent/50',
  },
  critical: {
    label: 'CRITICAL',
    color: 'text-accent',
    bgColor: 'bg-accent/30',
    borderColor: 'border-accent',
  },
} as const;

export type SortOption = 'created' | 'dueDate' | 'priority' | 'name';
