import React, {useState} from 'react';
import {Task as TaskType} from '../../types/index';
import './Task.css';

interface TaskProps {
    task: TaskType;
    onStatusChange: (taskId: string, status: TaskType['status']) => void;
    onDelete: (taskId: string) => void;
    onUpdate?: (taskId: string, updates: Partial<TaskType>) => void;
}

const Task: React.FC<TaskProps> = ({task, onStatusChange, onDelete, onUpdate}) => {
    const [isExpanded, setIsExpanded] = useState(false);

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

    const priorityIcons: Record<TaskType['priority'], string> = {
        low: '🟢',
        medium: '🟡',
        high: '🔴',
    };

    const categoryIcons: Record<TaskType['category'], string> = {
        work: '💼',
        personal: '🎯',
        health: '💪',
        learning: '📚',
        other: '📌',
    };

    const getNextStatus = (current: TaskType['status']): TaskType['status'] => {
        const statuses: TaskType['status'][] = ['start', 'working', 'finish'];
        const currentIndex = statuses.indexOf(current);
        return statuses[(currentIndex + 1) % statuses.length];
    };

    const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        if (onUpdate) {
            onUpdate(task.id, {dueDate: e.target.value || undefined});
        }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const value = e.target.value ? parseInt(e.target.value) : undefined;
        if (onUpdate) {
            onUpdate(task.id, {estimatedTime: value});
        }
    };

    const handleExpandClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="task" style={{borderLeftColor: statusColors[task.status]}}>
            <div className="task-header">
                <div className="task-content">
                    <h3>{task.title}</h3>
                    <div className="task-meta">
                        <span className="task-category" title="Category">
                            {categoryIcons[task.category]}
                        </span>
                        <span className="task-priority" title="Priority">
                            {priorityIcons[task.priority]}
                        </span>
                    </div>
                </div>
                <div className="task-actions">
                    <span
                        className="task-status"
                        style={{backgroundColor: statusColors[task.status]}}
                        onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(task.id, getNextStatus(task.status));
                        }}
                        title="Click to change status"
                    >
                        {statusLabels[task.status]}
                    </span>
                    <button
                        className="task-btn task-btn-expand"
                        onClick={handleExpandClick}
                        onDragStart={(e) => e.stopPropagation()}
                        title="More options"
                    >
                        ⋮
                    </button>
                    <button
                        className="task-btn task-btn-delete"
                        onClick={() => onDelete(task.id)}
                        onDragStart={(e) => e.stopPropagation()}
                        title="Delete"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {isExpanded && onUpdate && (
                <div
                    className="task-details"
                    draggable={false}
                    onDragStart={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="detail-row">
                        <label>Due Date:</label>
                        <input
                            type="date"
                            value={task.dueDate || ''}
                            onChange={handleDueDateChange}
                            className="detail-input"
                            draggable={false}
                            onDragStart={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="detail-row">
                        <label>Est. Time (min):</label>
                        <input
                            type="number"
                            min="0"
                            step="5"
                            value={task.estimatedTime || ''}
                            onChange={handleTimeChange}
                            className="detail-input"
                            placeholder="0"
                            draggable={false}
                            onDragStart={(e) => e.stopPropagation()}
                        />
                    </div>
                    {task.createdAt && (
                        <div className="detail-row">
                            <label>Created:</label>
                            <span className="detail-text">{new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Task;
