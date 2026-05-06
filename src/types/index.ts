export type TaskStatus = 'start' | 'working' | 'finish';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'other';

export interface Task {
    id: string;
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
    category: TaskCategory;
    dueDate?: string; // ISO date string
    estimatedTime?: number; // in minutes
    dayId?: number; // undefined if in pending tasks
    createdAt?: string; // ISO date string
}

export interface Day {
    id: number;
    name: string;
    tasks: Task[];
}
