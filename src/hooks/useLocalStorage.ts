import {useState, useEffect, useCallback} from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return initialValue;
        }
    });

    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            try {
                // Always read from localStorage to avoid race conditions
                let currentValue: T;
                try {
                    const item = window.localStorage.getItem(key);
                    currentValue = item ? JSON.parse(item) : storedValue;
                } catch {
                    currentValue = storedValue;
                }

                // Calculate new value
                const valueToStore = value instanceof Function ? value(currentValue) : value;

                // Update React state
                setStoredValue(valueToStore);

                // Update localStorage
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            } catch (error) {
                console.error('Error writing to localStorage:', error);
            }
        },
        [key, storedValue],
    );

    return [storedValue, setValue];
}
