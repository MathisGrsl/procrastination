import React, {useState} from 'react';
import {Task as TaskType} from '../../types/index';
import Day from '../Day/Day';
import './ContentDays.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface ContentDaysProps {
    days: {[key: number]: TaskType[]};
    onAddTask: (dayId: number) => void;
    onStatusChange: (taskId: string, status: TaskType['status']) => void;
    onDeleteTask: (taskId: string) => void;
    onDropTask: (taskId: string, dayId: number) => void;
}

const ContentDays: React.FC<ContentDaysProps> = ({days, onAddTask, onStatusChange, onDeleteTask, onDropTask}) => {
    return (
        <div className="content-days">
            {DAYS.map((dayName, index) => (
                <Day
                    key={index}
                    dayId={index}
                    dayName={dayName}
                    tasks={days[index] || []}
                    onAddTask={onAddTask}
                    onStatusChange={onStatusChange}
                    onDeleteTask={onDeleteTask}
                    onDropTask={onDropTask}
                />
            ))}
        </div>
    );
};

export default ContentDays;
