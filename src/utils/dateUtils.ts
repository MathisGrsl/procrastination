// Get the start of the week (Monday) for a given date
export function getWeekStart(date: Date = new Date()): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(d.setDate(diff));
}

// Get an array of 7 days starting from Monday
export function getWeekDays(startDate: Date = new Date()): Date[] {
    const week = [];
    const start = getWeekStart(startDate);
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        week.push(date);
    }
    return week;
}

// Format date to YYYY-MM-DD
export function formatDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
}

// Get a display string for a week
export function getWeekDisplayString(startDate: Date): string {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const start = startDate.toLocaleDateString('en-US', options);
    const end = endDate.toLocaleDateString('en-US', options);
    
    return `${start} - ${end}`;
}

// Check if a date is today
export function isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

// Check if a date is in the past
export function isPast(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}
