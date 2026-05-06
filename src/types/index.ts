export type TaskStatus = 'start' | 'working' | 'finish';

export interface Task {
    id: string;
    title: string;
    status: TaskStatus;
    dayId?: number; // undefined if in pending tasks
}

export interface Day {
    id: number;
    name: string;
    tasks: Task[];
}
