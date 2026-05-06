import React, {useState} from 'react';
import {Task as TaskType} from '../../types/index';
import Task from '../Task/Task';
import './Sidebar.css';

interface SidebarProps {
    pendingTasks: TaskType[];
    onAddTask: (title: string) => void;
    onStatusChange: (taskId: string, status: TaskType['status']) => void;
    onDeleteTask: (taskId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({pendingTasks, onAddTask, onStatusChange, onDeleteTask}) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [showInput, setShowInput] = useState(false);

    const handleAddTask = () => {
        if (taskTitle.trim()) {
            onAddTask(taskTitle);
            setTaskTitle('');
            setShowInput(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddTask();
        } else if (e.key === 'Escape') {
            setShowInput(false);
            setTaskTitle('');
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Pending Tasks</h2>
                <button className="sidebar-add-btn" onClick={() => setShowInput(!showInput)} title="Add a pending task">
                    +
                </button>
            </div>

            {showInput && (
                <div className="sidebar-input-container">
                    <input
                        type="text"
                        className="sidebar-input"
                        placeholder="New task..."
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        onKeyPress={handleKeyPress}
                        autoFocus
                    />
                    <button className="sidebar-confirm-btn" onClick={handleAddTask}>
                        ✓
                    </button>
                </div>
            )}

            <div className="sidebar-tasks">
                {pendingTasks.length === 0 ? (
                    <p className="sidebar-empty">No pending tasks</p>
                ) : (
                    pendingTasks.map((task) => (
                        <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer?.setData('taskId', task.id);
                            }}
                        >
                            <Task task={task} onStatusChange={onStatusChange} onDelete={onDeleteTask} />
                        </div>
                    ))
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
