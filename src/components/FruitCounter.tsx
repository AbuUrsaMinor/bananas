import { format } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import type { SwipeableHandlers } from 'react-swipeable';
import { useSwipeable } from 'react-swipeable';
import { DATE_FORMAT } from '../constants';
import { useFruitStore } from '../store/fruitStore';
import type { FruitType } from '../types';

import { fruitEmojis } from '../constants';

// Custom hook for swipe handling to comply with React Hooks rules
function useCreateFruitSwipeHandlers(
    setSwipedFruit: (fruit: FruitType | null) => void,
    handleAdd: (type: FruitType) => void,
    handleRemove: (type: FruitType) => void
) {
    const bananaSwipeHandlers = useSwipeable({
        onSwiped: () => setSwipedFruit(null),
        onSwipedLeft: () => handleRemove('banana'),
        onSwipedRight: () => handleAdd('banana'),
        onSwiping: () => setSwipedFruit('banana'),
        preventScrollOnSwipe: true,
        trackMouse: false,
        delta: 10
    });

    const appleSwipeHandlers = useSwipeable({
        onSwiped: () => setSwipedFruit(null),
        onSwipedLeft: () => handleRemove('apple'),
        onSwipedRight: () => handleAdd('apple'),
        onSwiping: () => setSwipedFruit('apple'),
        preventScrollOnSwipe: true,
        trackMouse: false,
        delta: 10
    });

    const orangeSwipeHandlers = useSwipeable({
        onSwiped: () => setSwipedFruit(null),
        onSwipedLeft: () => handleRemove('orange'),
        onSwipedRight: () => handleAdd('orange'),
        onSwiping: () => setSwipedFruit('orange'),
        preventScrollOnSwipe: true,
        trackMouse: false,
        delta: 10
    });

    return useMemo(() => ({
        banana: bananaSwipeHandlers,
        apple: appleSwipeHandlers,
        orange: orangeSwipeHandlers
    }), [bananaSwipeHandlers, appleSwipeHandlers, orangeSwipeHandlers]);
}

// Fruit Card component to avoid React Hooks rules violations
function FruitCard({
    fruit,
    isActive,
    isAdding,
    isRemoving,
    monthlyStats,
    swipeHandlers,
    handleAdd,
    handleRemove
}: {
    fruit: FruitType;
    isActive: boolean;
    isAdding: boolean;
    isRemoving: boolean;
    monthlyStats: Record<FruitType, number> & { total: number };
    swipeHandlers: SwipeableHandlers;
    handleAdd: (type: FruitType) => void;
    handleRemove: (type: FruitType) => void;
}) {
    return (
        <div
            {...swipeHandlers}
            className={`relative bg-surface-0 rounded-l shadow p-0 overflow-hidden 
                     mb-2 transition-all duration-300 ${isAdding ? 'scale-[1.02]' : isRemoving ? 'scale-[0.98]' : ''}`}
        >
            {/* Swipe action indicators */}
            <div className="absolute inset-0 flex pointer-events-none">
                <div className="bg-green-500 flex-1 flex items-center justify-center text-white opacity-0 transition-opacity duration-200"
                    style={{ opacity: isActive ? 0.2 : 0 }}>
                    <span className="text-lg font-medium">Add</span>
                </div>
                <div className="bg-red-500 flex-1 flex items-center justify-center text-white opacity-0 transition-opacity duration-200"
                    style={{ opacity: isActive ? 0.2 : 0 }}>
                    <span className="text-lg font-medium">Remove</span>
                </div>
            </div>

            {/* Card content - updated to match design specs */}
            <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-2xl">{fruitEmojis[fruit]}</span>
                </div>
                <span className="capitalize text-base font-medium text-ink-900">{fruit}</span>

                <div className="flex items-center gap-2 ml-auto">
                    <button
                        onClick={() => handleRemove(fruit)}
                        disabled={monthlyStats[fruit] <= 0}
                        className={`w-8 h-8 flex items-center justify-center rounded-s
                                 transition-all duration-300 transform active:scale-[0.97]
                                 ${monthlyStats[fruit] <= 0
                                ? 'text-ink-400 bg-surface-100 cursor-not-allowed'
                                : 'text-red-500 bg-surface-100'}`}
                        aria-label={`Remove ${fruit}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <span className={`inline-flex min-w-8 items-center justify-center text-lg font-semibold
                                   px-2 py-1 transition-all duration-200 ${isAdding
                            ? 'text-green-600'
                            : isRemoving
                                ? 'text-red-600'
                                : 'text-ink-900'
                        }`}>
                        {monthlyStats[fruit]}
                    </span>
                    <button
                        onClick={() => handleAdd(fruit)}
                        className="w-8 h-8 flex items-center justify-center text-green-500 
                                bg-surface-100 rounded-s transition-all duration-300 
                                transform active:scale-[0.97]"
                        aria-label={`Add ${fruit}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export function FruitCounter() {
    const { addFruit, removeFruit, getMonthlyStats } = useFruitStore();
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const monthlyStats = getMonthlyStats(currentYear, currentMonth);
    const todayStr = format(today, DATE_FORMAT);

    // Track which fruit card is being swiped
    const [swipedFruit, setSwipedFruit] = useState<FruitType | null>(null);
    const [animatingFruit, setAnimatingFruit] = useState<string | null>(null);

    const handleAdd = useCallback((type: FruitType) => {
        setAnimatingFruit(`${type}-add`);
        addFruit(todayStr, type);
        setTimeout(() => setAnimatingFruit(null), 300);
    }, [addFruit, todayStr]);

    const handleRemove = useCallback((type: FruitType) => {
        if (monthlyStats[type] > 0) {
            setAnimatingFruit(`${type}-remove`);
            removeFruit(todayStr, type);
            setTimeout(() => setAnimatingFruit(null), 300);
        }
    }, [monthlyStats, removeFruit, todayStr]);

    // Create swipe handlers for all fruits
    const swipeHandlers = useCreateFruitSwipeHandlers(setSwipedFruit, handleAdd, handleRemove);

    return (
        <div className="w-full h-full max-w-xl mx-auto px-4 py-4">
            {/* Fruit cards - updated to match design specs */}
            <div className="space-y-2">
                {(Object.keys(fruitEmojis) as FruitType[]).map((fruit) => {
                    const isAdding = animatingFruit === `${fruit}-add`;
                    const isRemoving = animatingFruit === `${fruit}-remove`;
                    const isActive = swipedFruit === fruit;

                    return (
                        <FruitCard
                            key={fruit}
                            fruit={fruit}
                            isActive={isActive}
                            isAdding={isAdding}
                            isRemoving={isRemoving}
                            monthlyStats={monthlyStats}
                            swipeHandlers={swipeHandlers[fruit]}
                            handleAdd={handleAdd}
                            handleRemove={handleRemove}
                        />
                    );
                })}

                {/* Monthly summary card - updated to match design specs */}
                <div className="mt-5 bg-surface-0 p-4 rounded-l shadow">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-base font-medium text-ink-900">Monthly Total</span>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-semibold text-accent">
                                {monthlyStats.total}
                            </span>
                            <span className="text-ink-400 text-sm">fruits</span>
                        </div>
                    </div>

                    {/* Visual breakdown */}
                    {monthlyStats.total > 0 ? (
                        <>
                            <div className="mt-3 flex items-center h-6 rounded-full overflow-hidden bg-surface-100">
                                <div className="h-full bg-amber-300"
                                    style={{ width: `${(monthlyStats.banana / monthlyStats.total) * 100}%` }}></div>
                                <div className="h-full bg-red-300"
                                    style={{ width: `${(monthlyStats.apple / monthlyStats.total) * 100}%` }}></div>
                                <div className="h-full bg-orange-300"
                                    style={{ width: `${(monthlyStats.orange / monthlyStats.total) * 100}%` }}></div>
                            </div>

                            {/* Legend */}
                            <div className="mt-2 flex flex-wrap gap-3 text-xs">
                                <div className="flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-sm bg-amber-300"></span>
                                    <span>{monthlyStats.banana} bananas</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-sm bg-red-300"></span>
                                    <span>{monthlyStats.apple} apples</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-sm bg-orange-300"></span>
                                    <span>{monthlyStats.orange} oranges</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-4 text-ink-400">
                            No fruit logged this month. Tap + to add your first fruit.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
