import React from 'react';
import {Task as TaskType} from '../../types/index';
import './Task.css';

interface TaskProps {
    task: TaskType;
    onStatusChange: (taskId: string, status: TaskType['status']) => void;
    onDelete: (taskId: string) => void;
}

const Task: React.FC<TaskProps> = ({task, onStatusChange, onDelete}) => {
    const statusColors: Record<TaskType['status'], string> = {
        start: '#4CAF50', // Green
        working: '#FF9800', // Orange
        finish: '#f44336', // Red
    };

    const statusLabels: Record<TaskType['status'], string> = {
        start: 'Start',
        working: 'In Progress',
        finish: 'Done',
    };

    const getNextStatus = (current: TaskType['status']): TaskType['status'] => {
        const statuses: TaskType['status'][] = ['start', 'working', 'finish'];
        const currentIndex = statuses.indexOf(current);
        return statuses[(currentIndex + 1) % statuses.length];
    };

    return (
        <div className="task" style={{borderLeftColor: statusColors[task.status]}} draggable>
            <div className="task-content">
                <h3>{task.title}</h3>
                <span
                    className="task-status"
                    style={{backgroundColor: statusColors[task.status]}}
                    onClick={() => onStatusChange(task.id, getNextStatus(task.status))}
                    title="Click to change status"
                >
                    {statusLabels[task.status]}
                </span>
            </div>
            <div className="task-actions">
                <button className="task-btn task-btn-delete" onClick={() => onDelete(task.id)} title="Delete">
                    ✕
                </button>
            </div>
        </div>
    );
};

export default Task;
