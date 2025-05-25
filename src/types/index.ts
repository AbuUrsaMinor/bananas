export type FruitType = 'banana' | 'apple' | 'orange';

export interface FruitEntry {
    id: string;
    date: string; // YYYY-MM-DD format
    type: FruitType;
    count: number;
}

export interface DailyFruitCounts {
    [key: string]: { // YYYY-MM-DD as key
        banana: number;
        apple: number;
        orange: number;
    }
}

export interface MonthlyStats {
    banana: number;
    apple: number;
    orange: number;
    total: number;
}
