import React, {useState, useCallback} from 'react';
import {Task as TaskType} from './types/index';
import Sidebar from './components/Sidebar/Sidebar';
import ContentDays from './components/ContentDays/ContentDays';
import './styles/global.css';
import './App.css';

const App: React.FC = () => {
    // State for days tasks (0-6 for Mon-Sun)
    const [dayTasks, setDayTasks] = useState<{[key: number]: TaskType[]}>({
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
    });

    // State for pending tasks (not assigned to any day)
    const [pendingTasks, setPendingTasks] = useState<TaskType[]>([]);

    // Generate unique ID
    const generateId = () => Math.random().toString(36).substr(2, 9);

    // Add new pending task from sidebar with custom title
    const handleAddPendingTask = useCallback(
        (title: string) => {
            const newTask: TaskType = {
                id: generateId(),
                title: title.trim(),
                status: 'start',
            };
            setPendingTasks([...pendingTasks, newTask]);
        },
        [pendingTasks],
    );

    // Add new task to a specific day with a dialog
    const handleAddTaskToDay = useCallback((dayId: number) => {
        const title = prompt('Task name:');
        if (title && title.trim()) {
            const newTask: TaskType = {
                id: generateId(),
                title: title.trim(),
                status: 'start',
                dayId: dayId,
            };
            setDayTasks((prev) => ({
                ...prev,
                [dayId]: [...(prev[dayId] || []), newTask],
            }));
        }
    }, []);

    // Change task status
    const handleStatusChange = useCallback((taskId: string, newStatus: TaskType['status']) => {
        // Check in pending tasks
        setPendingTasks((prev) => prev.map((task) => (task.id === taskId ? {...task, status: newStatus} : task)));

        // Check in day tasks
        setDayTasks((prev) => {
            const newState = {...prev};
            for (let dayId in newState) {
                newState[parseInt(dayId)] = newState[parseInt(dayId)].map((task) =>
                    task.id === taskId ? {...task, status: newStatus} : task,
                );
            }
            return newState;
        });
    }, []);

    // Delete task
    const handleDeleteTask = useCallback((taskId: string) => {
        // Remove from pending tasks
        setPendingTasks((prev) => prev.filter((task) => task.id !== taskId));

        // Remove from day tasks
        setDayTasks((prev) => {
            const newState = {...prev};
            for (let dayId in newState) {
                newState[parseInt(dayId)] = newState[parseInt(dayId)].filter((task) => task.id !== taskId);
            }
            return newState;
        });
    }, []);

    // Drop task from pending to day (or between days)
    const handleDropTask = useCallback(
        (taskId: string, targetDayId: number) => {
            // Remove from pending tasks
            const taskFromPending = pendingTasks.find((t) => t.id === taskId);
            if (taskFromPending) {
                setPendingTasks((prev) => prev.filter((t) => t.id !== taskId));
                setDayTasks((prev) => ({
                    ...prev,
                    [targetDayId]: [...(prev[targetDayId] || []), {...taskFromPending, dayId: targetDayId}],
                }));
                return;
            }

            // Move between days or within day
            let taskToMove: TaskType | undefined;
            setDayTasks((prev) => {
                const newState = {...prev};
                // Find and remove from source day
                for (let dayId in newState) {
                    const foundIndex = newState[parseInt(dayId)].findIndex((t) => t.id === taskId);
                    if (foundIndex !== -1) {
                        taskToMove = newState[parseInt(dayId)][foundIndex];
                        newState[parseInt(dayId)] = newState[parseInt(dayId)].filter((t) => t.id !== taskId);
                        break;
                    }
                }
                // Add to target day
                if (taskToMove) {
                    newState[targetDayId] = [...(newState[targetDayId] || []), {...taskToMove, dayId: targetDayId}];
                }
                return newState;
            });
        },
        [pendingTasks],
    );

    return (
        <div className="app">
            <Sidebar
                pendingTasks={pendingTasks}
                onAddTask={handleAddPendingTask}
                onStatusChange={handleStatusChange}
                onDeleteTask={handleDeleteTask}
            />
            <ContentDays
                days={dayTasks}
                onAddTask={handleAddTaskToDay}
                onStatusChange={handleStatusChange}
                onDeleteTask={handleDeleteTask}
                onDropTask={handleDropTask}
            />
        </div>
    );
};

export default App;
