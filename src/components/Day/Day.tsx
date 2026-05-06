import React, {useState} from 'react';
import {Task as TaskType} from '../../types/index';
import Task from '../Task/Task';
import './Day.css';

interface DayProps {
    dayId: number;
    dayName: string;
    tasks: TaskType[];
    onAddTask: (dayId: number) => void;
    onStatusChange: (taskId: string, status: TaskType['status']) => void;
    onDeleteTask: (taskId: string) => void;
    onDropTask: (taskId: string, dayId: number) => void;
}

const Day: React.FC<DayProps> = ({dayId, dayName, tasks, onAddTask, onStatusChange, onDeleteTask, onDropTask}) => {
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
            onDropTask(taskId, dayId);
        }
    };

    return (
        <section
            className={`day ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="day-header">
                <h2>{dayName}</h2>
                <button className="day-add-btn" onClick={() => onAddTask(dayId)} title="Add a task">
                    +
                </button>
            </div>
            <div className="day-tasks">
                {tasks.length === 0 ? (
                    <p className="day-empty">No tasks</p>
                ) : (
                    tasks.map((task) => (
                        <div key={task.id} draggable onDragStart={(e) => e.dataTransfer?.setData('taskId', task.id)}>
                            <Task task={task} onStatusChange={onStatusChange} onDelete={onDeleteTask} />
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default Day;
