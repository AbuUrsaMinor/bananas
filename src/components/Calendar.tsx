import clsx from "clsx";
import { eachDayOfInterval, endOfMonth, format, getDay, isSameDay, isSameMonth, startOfMonth } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DATE_FORMAT, fruitEmojis } from "../constants";
import { testLocalStorage } from "../localStorage-test";
import { useFruitStore } from "../store/fruitStore";
import type { FruitType } from "../types";

export function Calendar() {
    const [currentDate] = useState(new Date());
    const { fruits, debug, addFruit } = useFruitStore();
    const start = useMemo(() => startOfMonth(currentDate), [currentDate]);
    const end = useMemo(() => endOfMonth(currentDate), [currentDate]);

    // Debug: log store contents and test localStorage
    useEffect(() => {
        console.log("Calendar component fruits:", debug());
        testLocalStorage();
    }, [fruits, debug]);

    // Debug function to add a test fruit when the component mounts
    useEffect(() => {
        // Add test fruit to today''s date
        const today = format(new Date(), DATE_FORMAT);
        console.log("Adding test banana on mount to:", today);
        addFruit(today, "banana");
    }, [addFruit]);

    const getDayFruits = useCallback((date: Date) => {
        const key = format(date, DATE_FORMAT);
        console.log("Getting fruits for date:", key, "Value:", fruits[key]);
        return fruits[key] || { banana: 0, apple: 0, orange: 0 };
    }, [fruits]);

    const calendarDays = useMemo(() => eachDayOfInterval({ start, end }), [start, end]);

    return (
        <div className="h-full w-full flex flex-col bg-surface-100">
            <div className="flex-1 overflow-auto px-4 py-4 overscroll-contain">
                {/* Using CSS Grid with gap as per design spec */}
                <div className="grid grid-cols-7 gap-1">
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
                        <div key={`empty-${index}`} className="aspect-square min-h-[44px]"></div>
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
                                    "aspect-square min-h-[44px] rounded-s",
                                    "transition-all duration-200",
                                    isToday ? "ring-1 ring-accent bg-accent/10" : "",
                                    !isCurrentMonth && "opacity-25"
                                )}
                            >
                                {/* Day number with proper sizing per design spec */}
                                <div className="text-xs font-medium px-1 py-1">
                                    {format(day, "d")}
                                </div>

                                {/* Fruit emojis instead of dots */}
                                {totalFruits > 0 && (
                                    <div className="flex flex-wrap gap-0.5 px-1">
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
