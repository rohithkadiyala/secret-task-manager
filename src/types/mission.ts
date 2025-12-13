/**
 * Mission (Task) type definition for the secret agency to-do application
 * Each mission represents an operation that agents need to complete
 */
export interface Mission {
  id: string;
  codename: string; // The mission title/name
  briefing: string; // Optional description/details
  threatLevel: 'low' | 'medium' | 'high' | 'critical'; // Priority level
  status: 'pending' | 'in-progress' | 'completed' | 'aborted';
  createdAt: Date;
  completedAt?: Date;
}

/**
 * Threat level configuration for visual styling
 */
export const THREAT_LEVELS = {
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
