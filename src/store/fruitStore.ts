import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MAX_VALID_YEAR, MIN_VALID_YEAR } from '../constants';
import type { DailyFruitCounts, FruitType } from '../types';

// Get initial state
const getInitialFruitCounts = () => ({
    banana: 0,
    apple: 0,
    orange: 0
});

// Validation functions
const validateDate = (date: string): boolean => {
    // First check basic format using regex
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return false;
    }

    const [yearStr, monthStr, dayStr] = date.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    // Basic range checks
    if (
        year < MIN_VALID_YEAR ||
        year > MAX_VALID_YEAR ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
    ) {
        return false;
    }

    // Create a date object for final validation (handles month lengths correctly)
    const dateObj = new Date(year, month - 1, day);
    return (
        dateObj.getFullYear() === year &&
        dateObj.getMonth() === month - 1 &&
        dateObj.getDate() === day
    );
};

const validateYearMonth = (year: number, month: number): boolean => {
    if (!Number.isInteger(year) || !Number.isInteger(month)) {
        return false;
    }
    if (year < MIN_VALID_YEAR || year > MAX_VALID_YEAR) {
        return false;
    }
    if (month < 1 || month > 12) {
        return false;
    }
    return true;
};

interface FruitStore {
    fruits: DailyFruitCounts;
    addFruit: (date: string, type: FruitType) => void;
    removeFruit: (date: string, type: FruitType) => void;
    debug: () => DailyFruitCounts;
    resetStore: () => void;
    getMonthlyStats: (year: number, month: number) => {
        banana: number;
        apple: number;
        orange: number;
        total: number;
    };
}

export const useFruitStore = create<FruitStore>()(
    persist(
        (set, get) => ({
            fruits: {},

            debug: () => {
                console.log('Current store state:', get().fruits);
                return get().fruits;
            },

            resetStore: () => {
                set({ fruits: {} });
                console.log('Store reset');
            },

            addFruit: (date: string, type: FruitType) => {
                if (!validateDate(date)) {
                    throw new Error(`Invalid date format: ${date}. Use YYYY-MM-DD format.`);
                }

                set((state) => {
                    const newFruits = { ...state.fruits };

                    if (!newFruits[date]) {
                        newFruits[date] = getInitialFruitCounts();
                    }

                    newFruits[date] = {
                        ...newFruits[date],
                        [type]: (newFruits[date][type] || 0) + 1,
                    };

                    console.log('Added fruit:', type, 'to', date, 'in store:', newFruits);
                    return { fruits: newFruits };
                });
            },

            removeFruit: (date: string, type: FruitType) => {
                if (!validateDate(date)) {
                    throw new Error(`Invalid date format: ${date}. Use YYYY-MM-DD format.`);
                }

                set((state) => {
                    // Return unchanged state if date doesn't exist
                    if (!state.fruits[date]) {
                        return state;
                    }

                    const newFruits = { ...state.fruits };
                    const currentCount = newFruits[date][type] || 0;

                    if (currentCount === 0) {
                        // Return unchanged state if there are no fruits to remove
                        return state;
                    }

                    newFruits[date] = {
                        ...newFruits[date],
                        [type]: currentCount - 1
                    };

                    return { fruits: newFruits };
                });
            },

            getMonthlyStats: (year: number, month: number) => {
                if (!validateYearMonth(year, month)) {
                    throw new Error(`Invalid year/month combination. Year must be between ${MIN_VALID_YEAR} and ${MAX_VALID_YEAR}, month must be between 1 and 12.`);
                }

                const state = get();
                const stats = {
                    ...getInitialFruitCounts(),
                    total: 0
                };

                // Format month to ensure it matches the date string format (with leading zero)
                const monthStr = month.toString().padStart(2, '0');
                const yearStr = year.toString();
                const prefix = `${yearStr}-${monthStr}`;

                Object.entries(state.fruits)
                    .filter(([date]) => date.startsWith(prefix))
                    .forEach(([, counts]) => {
                        stats.banana += counts.banana || 0;
                        stats.apple += counts.apple || 0;
                        stats.orange += counts.orange || 0;
                    });

                stats.total = stats.banana + stats.apple + stats.orange;
                return stats;
            },
        }),
        {
            name: 'fruit-storage',
        }
    )
);