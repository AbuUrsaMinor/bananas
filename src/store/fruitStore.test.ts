import { beforeEach, describe, expect, it } from 'vitest';
import { useFruitStore } from './fruitStore';

describe('fruitStore', () => {
    beforeEach(() => {
        useFruitStore.setState({ fruits: {} });
    });

    it('should initialize with empty fruits object', () => {
        const store = useFruitStore.getState();
        expect(store.fruits).toEqual({});
    });

    it('should add a fruit for a given date', () => {
        const store = useFruitStore.getState();
        store.addFruit('2025-05-23', 'banana');
        const updatedStore = useFruitStore.getState();
        expect(updatedStore.fruits['2025-05-23']).toEqual({
            banana: 1,
            apple: 0,
            orange: 0
        });
    });

    it('should remove a fruit for a given date', () => {
        const store = useFruitStore.getState();
        store.addFruit('2025-05-23', 'banana');
        store.removeFruit('2025-05-23', 'banana');
        const updatedStore = useFruitStore.getState();
        expect(updatedStore.fruits['2025-05-23']).toEqual({
            banana: 0,
            apple: 0,
            orange: 0
        });
    });

    it('should calculate monthly stats correctly', () => {
        const store = useFruitStore.getState();
        store.addFruit('2025-05-01', 'banana');
        store.addFruit('2025-05-01', 'apple');

        const stats = store.getMonthlyStats(2025, 5);
        expect(stats).toEqual({
            banana: 1,
            apple: 1,
            orange: 0,
            total: 2
        });
    });

    it('should handle invalid date for removeFruit', () => {
        const store = useFruitStore.getState();
        store.removeFruit('2025-05-23', 'banana');
        const updatedStore = useFruitStore.getState();
        expect(updatedStore.fruits['2025-05-23']).toBeUndefined();
    });

    it('should not count fruits from different months', () => {
        const store = useFruitStore.getState();
        store.addFruit('2025-05-01', 'banana');
        store.addFruit('2025-06-01', 'banana');

        const stats = store.getMonthlyStats(2025, 5);
        expect(stats.banana).toBe(1);
    });

    it('should throw error for invalid date format', () => {
        const store = useFruitStore.getState();
        expect(() => store.addFruit('2025/05/23', 'banana')).toThrow('Invalid date format');
        expect(() => store.addFruit('invalid-date', 'banana')).toThrow('Invalid date format');
        expect(() => store.removeFruit('2025/05/23', 'banana')).toThrow('Invalid date format');
    });

    it('should throw error for invalid year/month in stats', () => {
        const store = useFruitStore.getState();
        expect(() => store.getMonthlyStats(1800, 5)).toThrow('Invalid year/month');
        expect(() => store.getMonthlyStats(2025, 13)).toThrow('Invalid year/month');
        expect(() => store.getMonthlyStats(2025, 0)).toThrow('Invalid year/month');
    });

    it('should handle multiple fruit additions on same date', () => {
        const store = useFruitStore.getState();
        store.addFruit('2025-05-23', 'banana');
        store.addFruit('2025-05-23', 'banana');
        store.addFruit('2025-05-23', 'apple');

        const updatedStore = useFruitStore.getState();
        expect(updatedStore.fruits['2025-05-23']).toEqual({
            banana: 2,
            apple: 1,
            orange: 0
        });
    });
});
