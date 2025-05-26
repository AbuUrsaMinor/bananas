import clsx from "clsx";
import { eachDayOfInterval, endOfMonth, format, getDay, isSameDay, isSameMonth, startOfMonth } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DATE_FORMAT, fruitEmojis } from "../constants";
import { useFruitStore } from "../store/fruitStore";
import type { FruitType } from "../types";

export function Calendar() {
    const [currentDate] = useState(new Date());
    const { fruits } = useFruitStore();
    const start = useMemo(() => startOfMonth(currentDate), [currentDate]);
    const end = useMemo(() => endOfMonth(currentDate), [currentDate]);
    
    const calendarDays = useMemo(() => eachDayOfInterval({ start, end }), [start, end]);
    
    // Calculate the number of weeks in the month to determine grid height
    const numWeeks = useMemo(() => {
        const firstDayOfMonth = getDay(start);
        const daysInMonth = calendarDays.length;
        return Math.ceil((firstDayOfMonth + daysInMonth) / 7);
    }, [start, calendarDays]);

    const getDayFruits = useCallback((date: Date) => {
        const key = format(date, DATE_FORMAT);
        return fruits[key] || { banana: 0, apple: 0, orange: 0 };
    }, [fruits]);

    // Use effect to calculate available space
    useEffect(() => {
        const handleResize = () => {
            // This will force a re-render when window size changes
            forceUpdate(c => c + 1);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // Force re-render on resize
    const [, forceUpdate] = useState(0);

    return (
        <div className="h-full w-full flex flex-col bg-surface-100">
            <div className="flex-1 overflow-auto px-4 py-4 overscroll-contain flex flex-col">
                {/* Using CSS Grid with gap as per design spec, now with full height */}
                <div 
                    className="grid grid-cols-7 gap-1 flex-1"
                    style={{ 
                        gridTemplateRows: `auto repeat(${numWeeks}, 1fr)`,
                        minHeight: "calc(100% - 8px)" // Account for padding
                    }}
                >
                    {/* Day of week header row */}
                    {[
                        { key: "sun", label: "S" },
                        { key: "mon", label: "M" },
                        { key: "tue", label: "T" },
                        { key: "wed", label: "W" },
                        { key: "thu", label: "T" },
                        { key: "fri", label: "F" },
                        { key: "sat", label: "S" }
                    ].map((day) => (
                        <div key={day.key}
                            className="text-center font-medium p-2 text-ink-400 text-xs"
                        >
                            {day.label}
                        </div>
                    ))}

                    {/* Generate placeholders for days before the first day of the month */}
                    {Array.from({ length: getDay(start) }).map((_placeholder, index) => (
                        <div key={`empty-${index}`} className="aspect-square h-full"></div>
                    ))}

                    {/* Actual calendar days */}
                    {calendarDays.map((day: Date) => {
                        const dayFruits = getDayFruits(day);
                        const totalFruits = Object.values(dayFruits).reduce((sum, count) => sum + count, 0);
                        const isToday = isSameDay(day, new Date());
                        const isCurrentMonth = isSameMonth(day, currentDate);

                        // Get fruit entries with count > 0                        
                        const activeFruits = Object.entries(dayFruits)
                            .filter(([, count]) => count > 0)
                            .map(([fruit]) => fruit as FruitType);

                        return (
                            <div
                                key={day.toISOString()}
                                className={clsx(
                                    "h-full w-full rounded-s p-1 flex flex-col",
                                    "transition-all duration-200",
                                    isToday ? "ring-1 ring-accent bg-accent/10" : "",
                                    !isCurrentMonth && "opacity-25"
                                )}
                            >
                                {/* Day number with proper sizing per design spec */}
                                <div className="text-xs font-medium">
                                    {format(day, "d")}
                                </div>

                                {/* Fruit emojis instead of dots */}
                                {totalFruits > 0 && (
                                    <div className="flex flex-wrap gap-0.5 mt-1">
                                        {/* Show up to 3 fruit emojis */}
                                        {activeFruits.slice(0, 3).map(fruit => (
                                            <span
                                                key={fruit}
                                                className="text-[10px]"
                                                title={`${dayFruits[fruit]} ${fruit}${dayFruits[fruit] > 1 ? "s" : ""}`}
                                            >
                                                {fruitEmojis[fruit]}
                                                {dayFruits[fruit] > 1 && <sub className="text-[7px]">{dayFruits[fruit]}</sub>}
                                            </span>
                                        ))}

                                        {/* Show +N indicator if more than 3 fruit types */}
                                        {activeFruits.length > 3 && (
                                            <span className="text-[8px] text-accent font-medium">
                                                +{activeFruits.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
