import type { FruitType } from './types';

export const DATE_FORMAT = 'yyyy-MM-dd' as const;

export const MIN_VALID_YEAR = 1900;
export const MAX_VALID_YEAR = 2100;

export const fruitEmojis: Record<FruitType, string> = {
    banana: '🍌',
    apple: '🍎',
    orange: '🍊',
} as const;

export const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
