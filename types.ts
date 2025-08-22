
export interface Project {
  id: number;
  name: string;
  tasks: Task[];
}

export interface Task {
  id: number;
  name: string;
  assignee: string;
  start: Date;
  end: Date;
  duration?: number; // Duration in business days
  color?: string;
  type: 'task' | 'group';
  parentId?: number;
  isCollapsed?: boolean;
  dependencies?: number[];
}

export interface ProcessedTask extends Task {
  level: number;
}

export type TimelineView = 'day' | 'week';

export type AuthView = 'homepage' | 'login' | 'signup' | 'app';