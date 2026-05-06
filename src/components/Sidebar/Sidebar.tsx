import React, { useState } from 'react';
import { Task as TaskType } from '../../types/index';
import Task from '../Task/Task';
import './Sidebar.css';

interface SidebarProps {
    pendingTasks: TaskType[];
    onAddTask: (title: string, priority: TaskType['priority'], category: TaskType['category']) => void;
    onStatusChange: (taskId: string, status: TaskType['status']) => void;
    onDeleteTask: (taskId: string) => void;
    onUpdateTask: (taskId: string, updates: Partial<TaskType>) => void;
}

const CATEGORIES: { value: TaskType['category']; label: string; icon: string }[] = [
    { value: 'work', label: 'Work', icon: '💼' },
    { value: 'personal', label: 'Personal', icon: '🎯' },
    { value: 'health', label: 'Health', icon: '💪' },
    { value: 'learning', label: 'Learning', icon: '📚' },
    { value: 'other', label: 'Other', icon: '📌' },
];

const PRIORITIES: { value: TaskType['priority']; label: string; icon: string }[] = [
    { value: 'low', label: 'Low', icon: '🟢' },
    { value: 'medium', label: 'Medium', icon: '🟡' },
    { value: 'high', label: 'High', icon: '🔴' },
];

const Sidebar: React.FC<SidebarProps> = ({
    pendingTasks,
    onAddTask,
    onStatusChange,
    onDeleteTask,
    onUpdateTask,
}) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [selectedPriority, setSelectedPriority] = useState<TaskType['priority']>('medium');
    const [selectedCategory, setSelectedCategory] = useState<TaskType['category']>('other');
    const [showInput, setShowInput] = useState(false);

    const handleAddTask = () => {
        if (taskTitle.trim()) {
            onAddTask(taskTitle, selectedPriority, selectedCategory);
            setTaskTitle('');
            setSelectedPriority('medium');
            setSelectedCategory('other');
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
                <h2>📋 Pending Tasks</h2>
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
                    <div className="sidebar-selectors">
                        <div className="selector-group">
                            <label>Priority:</label>
                            <select
                                value={selectedPriority}
                                onChange={(e) => setSelectedPriority(e.target.value as TaskType['priority'])}
                                className="sidebar-select"
                            >
                                {PRIORITIES.map((p) => (
                                    <option key={p.value} value={p.value}>
                                        {p.icon} {p.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="selector-group">
                            <label>Category:</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value as TaskType['category'])}
                                className="sidebar-select"
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c.value} value={c.value}>
                                        {c.icon} {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button className="sidebar-confirm-btn" onClick={handleAddTask}>
                        ✓ Add
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
        </aside>
    );
};

export default Sidebar;
