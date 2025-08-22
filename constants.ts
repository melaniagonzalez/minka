
import { Task, Project } from './types';
import { calculateBusinessDays } from './components/utils';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const getFutureDate = (base: Date, days: number): Date => {
  const future = new Date(base);
  future.setDate(base.getDate() + days);
  return future;
};

const initialTasksData: Omit<Task, 'duration'>[] = [
  {
    id: 1,
    name: 'Project Kick-off Meeting',
    assignee: 'Alice',
    start: today,
    end: getFutureDate(today, 0),
    color: '#3B82F6',
    type: 'task',
  },
  {
    id: 2,
    name: 'Requirement Gathering',
    assignee: 'Bob',
    start: getFutureDate(today, 1),
    end: getFutureDate(today, 3),
    color: '#10B981',
    type: 'task',
    dependencies: [1],
  },
  {
    id: 3,
    name: 'UI/UX Design Phase',
    assignee: 'Charlie',
    start: new Date(),
    end: new Date(),
    type: 'group',
    isCollapsed: false,
    dependencies: [2],
  },
  {
    id: 31,
    parentId: 3,
    name: 'Wireframing',
    assignee: 'Charlie',
    start: getFutureDate(today, 4),
    end: getFutureDate(today, 6),
    color: '#F59E0B',
    type: 'task',
  },
  {
    id: 32,
    parentId: 3,
    name: 'High-Fidelity Mockups',
    assignee: 'Charlie',
    start: getFutureDate(today, 7),
    end: getFutureDate(today, 9),
    color: '#F59E0B',
    type: 'task',
    dependencies: [31],
  },
  {
    id: 4,
    name: 'Development Phase',
    assignee: 'Dev Team',
    start: new Date(),
    end: new Date(),
    type: 'group',
    isCollapsed: true,
    dependencies: [3],
  },
  {
    id: 41,
    parentId: 4,
    name: 'Frontend Development',
    assignee: 'Diana',
    start: getFutureDate(today, 10),
    end: getFutureDate(today, 20),
    color: '#8B5CF6',
    type: 'task',
  },
  {
    id: 42,
    parentId: 4,
    name: 'Backend Development',
    assignee: 'Eve',
    start: getFutureDate(today, 10),
    end: getFutureDate(today, 22),
    color: '#6366F1',
    type: 'task',
  },
  {
    id: 43,
    parentId: 4,
    name: 'API Integration',
    assignee: 'Diana',
    start: getFutureDate(today, 21),
    end: getFutureDate(today, 24),
    color: '#EC4899',
    type: 'task',
    dependencies: [41, 42],
  },
  {
    id: 5,
    name: 'Testing & QA',
    assignee: 'Frank',
    start: getFutureDate(today, 25),
    end: getFutureDate(today, 30),
    color: '#F97316',
    type: 'task',
    dependencies: [43],
  },
  {
    id: 6,
    name: 'Deployment to Staging',
    assignee: 'Grace',
    start: getFutureDate(today, 31),
    end: getFutureDate(today, 32),
    color: '#06B6D4',
    type: 'task',
    dependencies: [5],
  },
];

// Calculate duration for initial tasks based on a standard work week (Mon-Fri)
const INITIAL_PROJECT_1_TASKS: Task[] = initialTasksData.map(task => {
  if (task.type === 'task') {
    const duration = calculateBusinessDays(task.start, task.end, [1, 2, 3, 4, 5]);
    return { ...task, duration };
  }
  return task as Task;
});

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Website Redesign',
    tasks: INITIAL_PROJECT_1_TASKS,
  },
  {
    id: 2,
    name: 'Mobile App Launch',
    tasks: [],
  }
];


export const INITIAL_USERS: string[] = [
  'Alice',
  'Bob',
  'Charlie',
  'Dev Team',
  'Diana',
  'Eve',
  'Frank',
  'Grace',
  'Unassigned',
].sort((a, b) => a.localeCompare(b));


export const DAY_WIDTH = 50; // width of a day column in pixels
export const WEEK_COL_WIDTH = 100; // width of a week column in pixels
export const ROW_HEIGHT = 48; // height of a task row in pixels
export const HEADER_HEIGHT = 64; // height of the header row in pixels