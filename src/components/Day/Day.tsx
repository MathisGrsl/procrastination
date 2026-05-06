import React, {useState} from 'react';
import {Task as TaskType} from '../../types/index';
import Task from '../Task/Task';
import './Day.css';

interface DayProps {
    dayIndex: number;
    dayName: string;
    dayDate: string;
    tasks: TaskType[];
    onAddTask: (dayIndex: number) => void;
    onStatusChange: (taskId: string, status: TaskType['status']) => void;
    onDeleteTask: (taskId: string) => void;
    onUpdateTask: (taskId: string, updates: Partial<TaskType>) => void;
    onDropTask: (taskId: string, dayIndex: number) => void;
    onDropToNavbar: (taskId: string) => void;
}

const Day: React.FC<DayProps> = ({
    dayIndex,
    dayName,
    dayDate,
    tasks,
    onAddTask,
    onStatusChange,
    onDeleteTask,
    onUpdateTask,
    onDropTask,
    onDropToNavbar,
}) => {
    const [dragOver, setDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            onDropTask(taskId, dayIndex);
        }
    };

    // Statistics for this day
    const completedCount = tasks.filter((t) => t.status === 'finish').length;
    const inProgressCount = tasks.filter((t) => t.status === 'working').length;

    return (
        <section
            className={`day ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="day-header">
                <div className="day-title">
                    <h2>{dayName}</h2>
                    <span className="day-date">{dayDate}</span>
                </div>
                <div className="day-stats">
                    {tasks.length > 0 && (
                        <>
                            <span className="day-stat-item" title="Total tasks">
                                📋 {tasks.length}
                            </span>
                            {completedCount > 0 && (
                                <span className="day-stat-item day-stat-done" title="Completed">
                                    ✓ {completedCount}
                                </span>
                            )}
                            {inProgressCount > 0 && (
                                <span className="day-stat-item day-stat-progress" title="In progress">
                                    ⟳ {inProgressCount}
                                </span>
                            )}
                        </>
                    )}
                </div>
                <button className="day-add-btn" onClick={() => onAddTask(dayIndex)} title="Add a task">
                    +
                </button>
            </div>
            <div className="day-tasks">
                {tasks.length === 0 ? (
                    <p className="day-empty">No tasks</p>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            draggable
                            className="task-wrapper"
                            onDragStart={(e) => {
                                // Check if drag started from an interactive element
                                const target = e.target as HTMLElement;
                                if (
                                    target.classList.contains('task-status') ||
                                    target.classList.contains('task-btn') ||
                                    target.closest('.task-status') ||
                                    target.closest('.task-btn') ||
                                    target.closest('.task-details')
                                ) {
                                    e.preventDefault();
                                    return;
                                }
                                e.dataTransfer?.setData('taskId', task.id);
                                e.dataTransfer!.effectAllowed = 'move';
                            }}
                        >
                            <Task
                                task={task}
                                onStatusChange={onStatusChange}
                                onDelete={onDeleteTask}
                                onUpdate={onUpdateTask}
                            />
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default Day;
