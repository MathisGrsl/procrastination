import React from 'react';
import { getWeekDisplayString } from '../../utils/dateUtils';
import './Header.css';

interface Stats {
    total: number;
    completed: number;
    inProgress: number;
    completionRate: number;
}

interface HeaderProps {
    currentWeekStart: Date;
    onPreviousWeek: () => void;
    onNextWeek: () => void;
    onToday: () => void;
    stats: Stats;
}

const Header: React.FC<HeaderProps> = ({
    currentWeekStart,
    onPreviousWeek,
    onNextWeek,
    onToday,
    stats,
}) => {
    return (
        <header className="header">
            <div className="header-left">
                <h1>📅 Procrastination Buster</h1>
                <div className="header-navigation">
                    <button className="header-btn" onClick={onPreviousWeek} title="Previous week">
                        ← Prev
                    </button>
                    <span className="week-display">{getWeekDisplayString(currentWeekStart)}</span>
                    <button className="header-btn" onClick={onNextWeek} title="Next week">
                        Next →
                    </button>
                    <button className="header-btn header-btn-today" onClick={onToday} title="Go to today">
                        Today
                    </button>
                </div>
            </div>

            <div className="header-stats">
                <div className="stat-item">
                    <span className="stat-label">Total:</span>
                    <span className="stat-value">{stats.total}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Done:</span>
                    <span className="stat-value stat-done">{stats.completed}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">In Progress:</span>
                    <span className="stat-value stat-progress">{stats.inProgress}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Completion:</span>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{width: `${stats.completionRate}%`}}
                        ></div>
                    </div>
                    <span className="stat-value">{stats.completionRate}%</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
