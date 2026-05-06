import React, { useState, useCallback, useMemo } from 'react';
import { Task as TaskType } from './types/index';
import Sidebar from './components/Sidebar/Sidebar';
import ContentDays from './components/ContentDays/ContentDays';
import Header from './components/Header/Header';
import './styles/global.css';
import './App.css';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getWeekStart, getWeekDays, formatDateKey } from './utils/dateUtils';

const App: React.FC = () => {
    // Week navigation state
    const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
    
    // State for all tasks stored by date key
    const [allTasks, setAllTasks] = useLocalStorage<{ [dateKey: string]: TaskType[] }>('procrastination_tasks', {});

    // State for pending tasks (not assigned to any day)
    const [pendingTasks, setPendingTasks] = useLocalStorage<TaskType[]>('procrastination_pending_tasks', []);

    // Generate unique ID
    const generateId = () => Math.random().toString(36).substr(2, 9);

    // Get tasks organized by day for current week
    const dayTasks = useMemo(() => {
        const weekDays = getWeekDays(currentWeekStart);
        const tasks: { [key: number]: TaskType[] } = {};
        
        weekDays.forEach((date, dayIndex) => {
            const dateKey = formatDateKey(date);
            tasks[dayIndex] = allTasks[dateKey] || [];
        });
        
        return tasks;
    }, [currentWeekStart, allTasks]);

    // Week navigation
    const handlePreviousWeek = useCallback(() => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() - 7);
        setCurrentWeekStart(newStart);
    }, [currentWeekStart]);

    const handleNextWeek = useCallback(() => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() + 7);
        setCurrentWeekStart(newStart);
    }, [currentWeekStart]);

    const handleToday = useCallback(() => {
        setCurrentWeekStart(getWeekStart(new Date()));
    }, []);

    // Add new pending task from sidebar with custom title
    const handleAddPendingTask = useCallback(
        (title: string, priority: TaskType['priority'] = 'medium', category: TaskType['category'] = 'other') => {
            const newTask: TaskType = {
                id: generateId(),
                title: title.trim(),
                status: 'start',
                priority,
                category,
                createdAt: new Date().toISOString(),
            };
            setPendingTasks([...pendingTasks, newTask]);
        },
        [pendingTasks],
    );

    // Add new task to a specific day
    const handleAddTaskToDay = useCallback((dayIndex: number) => {
        const title = prompt('Task name:');
        if (title && title.trim()) {
            const weekDays = getWeekDays(currentWeekStart);
            const date = weekDays[dayIndex];
            const dateKey = formatDateKey(date);
            
            const newTask: TaskType = {
                id: generateId(),
                title: title.trim(),
                status: 'start',
                priority: 'medium',
                category: 'other',
                dayId: dayIndex,
                createdAt: new Date().toISOString(),
            };
            
            setAllTasks((prev) => ({
                ...prev,
                [dateKey]: [newTask, ...(prev[dateKey] || [])],
            }));
        }
    }, [currentWeekStart]);

    // Change task status
    const handleStatusChange = useCallback((taskId: string, newStatus: TaskType['status']) => {
        // Check in pending tasks
        setPendingTasks((prev) => prev.map((task) => (task.id === taskId ? {...task, status: newStatus} : task)));

        // Check in day tasks
        setAllTasks((prev) => {
            const newState = {...prev};
            for (let dateKey in newState) {
                newState[dateKey] = newState[dateKey].map((task) =>
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
        setAllTasks((prev) => {
            const newState = {...prev};
            for (let dateKey in newState) {
                newState[dateKey] = newState[dateKey].filter((task) => task.id !== taskId);
            }
            return newState;
        });
    }, []);

    // Update task
    const handleUpdateTask = useCallback((taskId: string, updates: Partial<TaskType>) => {
        // Check in pending tasks
        setPendingTasks((prev) =>
            prev.map((task) => (task.id === taskId ? {...task, ...updates} : task))
        );

        // Check in day tasks
        setAllTasks((prev) => {
            const newState = {...prev};
            for (let dateKey in newState) {
                newState[dateKey] = newState[dateKey].map((task) =>
                    task.id === taskId ? {...task, ...updates} : task,
                );
            }
            return newState;
        });
    }, []);

    // Drop task from pending to day (or between days)
    const handleDropTask = useCallback(
        (taskId: string, targetDayIndex: number) => {
            const weekDays = getWeekDays(currentWeekStart);
            const targetDate = weekDays[targetDayIndex];
            const targetDateKey = formatDateKey(targetDate);
            
            // Remove from pending tasks
            const taskFromPending = pendingTasks.find((t) => t.id === taskId);
            if (taskFromPending) {
                setPendingTasks((prev) => prev.filter((t) => t.id !== taskId));
                setAllTasks((prev) => ({
                    ...prev,
                    [targetDateKey]: [...(prev[targetDateKey] || []), {...taskFromPending, dayId: targetDayIndex}],
                }));
                return;
            }

            // Move between days
            let taskToMove: TaskType | undefined;
            setAllTasks((prev) => {
                const newState = {...prev};
                // Find and remove from source day
                for (let dateKey in newState) {
                    const foundIndex = newState[dateKey].findIndex((t) => t.id === taskId);
                    if (foundIndex !== -1) {
                        taskToMove = newState[dateKey][foundIndex];
                        newState[dateKey] = newState[dateKey].filter((t) => t.id !== taskId);
                        break;
                    }
                }
                // Add to target day
                if (taskToMove) {
                    newState[targetDateKey] = [...(newState[targetDateKey] || []), {...taskToMove, dayId: targetDayIndex}];
                }
                return newState;
            });
        },
        [currentWeekStart, pendingTasks],
    );

    // Calculate statistics
    const stats = useMemo(() => {
        const allTasksFlat = [
            ...pendingTasks,
            ...Object.values(dayTasks).flat(),
        ];
        
        const total = allTasksFlat.length;
        const completed = allTasksFlat.filter(t => t.status === 'finish').length;
        const inProgress = allTasksFlat.filter(t => t.status === 'working').length;
        
        return {
            total,
            completed,
            inProgress,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
    }, [pendingTasks, dayTasks]);

    return (
        <div className="app">
            <Header
                currentWeekStart={currentWeekStart}
                onPreviousWeek={handlePreviousWeek}
                onNextWeek={handleNextWeek}
                onToday={handleToday}
                stats={stats}
            />
            <div className="app-content">
                <Sidebar
                    pendingTasks={pendingTasks}
                    onAddTask={handleAddPendingTask}
                    onStatusChange={handleStatusChange}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTask={handleUpdateTask}
                />
                <ContentDays
                    currentWeekStart={currentWeekStart}
                    days={dayTasks}
                    onAddTask={handleAddTaskToDay}
                    onStatusChange={handleStatusChange}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTask={handleUpdateTask}
                    onDropTask={handleDropTask}
                />
            </div>
        </div>
    );
};

export default App;
