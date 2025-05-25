// File to test Zustand store functionality with fruits
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TestStore {
    count: number;
    increment: () => void;
}

// Create a simple test store to verify persist functionality
export const useTestStore = create<TestStore>()(
    persist(
        (set) => ({
            count: 0,
            increment: () => set((state) => ({ count: state.count + 1 })),
        }),
        {
            name: 'test-storage',
        }
    )
);

// Export a function to test the store
export function testStore() {
    try {
        // Clear existing test-storage
        localStorage.removeItem('test-storage');

        // Get initial state
        const state = useTestStore.getState();
        console.log('Initial count:', state.count);

        // Increment
        state.increment();
        console.log('After increment:', useTestStore.getState().count);

        // Verify localStorage persistence
        const storageItem = localStorage.getItem('test-storage');
        console.log('LocalStorage item:', storageItem);

        // Check parsing
        if (storageItem) {
            const parsed = JSON.parse(storageItem);
            console.log('Parsed storage:', parsed);
            return true;
        }

        return false;
    } catch (e) {
        console.error('Error in testStore:', e);
        return false;
    }
}
