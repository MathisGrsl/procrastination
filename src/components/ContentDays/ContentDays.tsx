import React, { useMemo } from 'react';
import { Task as TaskType } from '../../types/index';
import Day from '../Day/Day';
import { getWeekDays, formatDateKey } from '../../utils/dateUtils';
import './ContentDays.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface ContentDaysProps {
    currentWeekStart: Date;
    days: { [key: number]: TaskType[] };
    onAddTask: (dayIndex: number) => void;
    onStatusChange: (taskId: string, status: TaskType['status']) => void;
    onDeleteTask: (taskId: string) => void;
    onUpdateTask: (taskId: string, updates: Partial<TaskType>) => void;
    onDropTask: (taskId: string, dayIndex: number) => void;
}

const ContentDays: React.FC<ContentDaysProps> = ({
    currentWeekStart,
    days,
    onAddTask,
    onStatusChange,
    onDeleteTask,
    onUpdateTask,
    onDropTask,
}) => {
    const weekDates = useMemo(() => getWeekDays(currentWeekStart), [currentWeekStart]);

    return (
        <div className="content-days">
            {DAYS.map((dayName, index) => {
                const date = weekDates[index];
                const dateStr = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                });

                return (
                    <Day
                        key={index}
                        dayIndex={index}
                        dayName={dayName}
                        dayDate={dateStr}
                        tasks={days[index] || []}
                        onAddTask={onAddTask}
                        onStatusChange={onStatusChange}
                        onDeleteTask={onDeleteTask}
                        onUpdateTask={onUpdateTask}
                        onDropTask={onDropTask}
                    />
                );
            })}
        </div>
    );
};

export default ContentDays;
