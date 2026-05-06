import React, {useState, useCallback, useMemo} from 'react';
import {Task as TaskType} from './types/index';
import Sidebar from './components/Sidebar/Sidebar';
import ContentDays from './components/ContentDays/ContentDays';
import Header from './components/Header/Header';
import './styles/global.css';
import './App.css';
import {useLocalStorage} from './hooks/useLocalStorage';
import {getWeekStart, getWeekDays, formatDateKey} from './utils/dateUtils';

const App: React.FC = () => {
    const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
    const [allTasks, setAllTasks] = useLocalStorage<{[dateKey: string]: TaskType[]}>('procrastination_tasks', {});
    const [pendingTasks, setPendingTasks] = useLocalStorage<TaskType[]>('procrastination_pending_tasks', []);

    const generateId = () => Math.random().toString(36).substr(2, 9);

    // Get tasks organized by day for current week
    const dayTasks = useMemo(() => {
        const weekDays = getWeekDays(currentWeekStart);
        const tasks: {[key: number]: TaskType[]} = {};
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

    // Add new pending task - NO dependency on pendingTasks
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
            setPendingTasks((prev) => [...prev, newTask]);
        },
        [],
    );

    // Add new task to a specific day
    const handleAddTaskToDay = useCallback(
        (dayIndex: number) => {
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
        },
        [currentWeekStart],
    );

    // Change task status
    const handleStatusChange = useCallback((taskId: string, newStatus: TaskType['status']) => {
        // Try to find in pending tasks
        setPendingTasks((prev) => {
            const found = prev.some((t) => t.id === taskId);
            if (found) {
                return prev.map((t) => (t.id === taskId ? {...t, status: newStatus} : t));
            }
            return prev;
        });

        // Try to find in day tasks
        setAllTasks((prev) => {
            const newState = {...prev};
            for (let dateKey in newState) {
                const found = newState[dateKey].some((t) => t.id === taskId);
                if (found) {
                    newState[dateKey] = newState[dateKey].map((t) => (t.id === taskId ? {...t, status: newStatus} : t));
                    break;
                }
            }
            return newState;
        });
    }, []);

    // Delete task
    const handleDeleteTask = useCallback((taskId: string) => {
        setPendingTasks((prev) => prev.filter((t) => t.id !== taskId));
        setAllTasks((prev) => {
            const newState = {...prev};
            for (let dateKey in newState) {
                newState[dateKey] = newState[dateKey].filter((t) => t.id !== taskId);
            }
            return newState;
        });
    }, []);

    // Update task
    const handleUpdateTask = useCallback((taskId: string, updates: Partial<TaskType>) => {
        setPendingTasks((prev) => {
            const found = prev.some((t) => t.id === taskId);
            if (found) {
                return prev.map((t) => (t.id === taskId ? {...t, ...updates} : t));
            }
            return prev;
        });

        setAllTasks((prev) => {
            const newState = {...prev};
            for (let dateKey in newState) {
                const found = newState[dateKey].some((t) => t.id === taskId);
                if (found) {
                    newState[dateKey] = newState[dateKey].map((t) => (t.id === taskId ? {...t, ...updates} : t));
                    break;
                }
            }
            return newState;
        });
    }, []);

    // Drop task to a day
    const handleDropTask = useCallback(
        (taskId: string, targetDayIndex: number) => {
            if (targetDayIndex < 0 || targetDayIndex > 6 || isNaN(targetDayIndex)) {
                return;
            }

            const weekDays = getWeekDays(currentWeekStart);
            const targetDate = weekDays[targetDayIndex];
            const targetDateKey = formatDateKey(targetDate);

            // Check if task is in pending
            setPendingTasks((prev) => {
                const taskFromPending = prev.find((t) => t.id === taskId);
                if (taskFromPending) {
                    // Move to day
                    setAllTasks((allPrev) => ({
                        ...allPrev,
                        [targetDateKey]: [
                            ...(allPrev[targetDateKey] || []),
                            {...taskFromPending, dayId: targetDayIndex},
                        ],
                    }));
                    return prev.filter((t) => t.id !== taskId);
                }
                return prev;
            });

            // Check if task is in another day
            setAllTasks((prev) => {
                let found = false;
                for (let dateKey in prev) {
                    if (prev[dateKey].some((t) => t.id === taskId)) {
                        found = true;
                        break;
                    }
                }

                if (found) {
                    const newState = {...prev};
                    let taskToMove: TaskType | undefined;

                    for (let dateKey in newState) {
                        const foundIndex = newState[dateKey].findIndex((t) => t.id === taskId);
                        if (foundIndex !== -1) {
                            taskToMove = newState[dateKey][foundIndex];
                            newState[dateKey] = newState[dateKey].filter((t) => t.id !== taskId);
                            break;
                        }
                    }

                    if (taskToMove) {
                        newState[targetDateKey] = [
                            ...(newState[targetDateKey] || []),
                            {...taskToMove, dayId: targetDayIndex},
                        ];
                    }
                    return newState;
                }

                return prev;
            });
        },
        [currentWeekStart],
    );

    // Drop task back to navbar (pending)
    const handleDropToNavbar = useCallback(
        (taskId: string) => {
            // First, find the task
            let taskToMove: TaskType | undefined;
            for (let dateKey in allTasks) {
                const found = allTasks[dateKey].find((t) => t.id === taskId);
                if (found) {
                    taskToMove = found;
                    break;
                }
            }

            // If found, remove from day and add to pending
            if (taskToMove) {
                setAllTasks((prev) => {
                    const newState = {...prev};
                    for (let dateKey in newState) {
                        const foundIndex = newState[dateKey].findIndex((t) => t.id === taskId);
                        if (foundIndex !== -1) {
                            newState[dateKey] = newState[dateKey].filter((t) => t.id !== taskId);
                            break;
                        }
                    }
                    return newState;
                });

                setPendingTasks((prev) => [...prev, {...taskToMove, dayId: undefined} as TaskType]);
            }
        },
        [allTasks],
    );

    // Calculate statistics
    const stats = useMemo(() => {
        const allTasksFlat = [...pendingTasks, ...Object.values(dayTasks).flat()];
        const total = allTasksFlat.length;
        const completed = allTasksFlat.filter((t) => t.status === 'finish').length;
        const inProgress = allTasksFlat.filter((t) => t.status === 'working').length;

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
                    onDropFromDay={handleDropToNavbar}
                />
                <ContentDays
                    currentWeekStart={currentWeekStart}
                    days={dayTasks}
                    onAddTask={handleAddTaskToDay}
                    onStatusChange={handleStatusChange}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTask={handleUpdateTask}
                    onDropTask={handleDropTask}
                    onDropToNavbar={handleDropToNavbar}
                />
            </div>
        </div>
    );
};

export default App;
