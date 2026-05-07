import { describe, expect, it } from '@jest/globals';
import { LocalDateTime } from '@js-joda/core';
import { fromLocalDateTime, fromLocalDateTimeOr, toLocalDateTime } from './DateTimeUtils.ts';

const FIXED: LocalDateTime = LocalDateTime.of(2025, 3, 15, 14, 30);
const FIXED_STRING = '2025-03-15T14:30';

describe('toLocalDateTime', () => {
    describe('null / undefined input', () => {
        it('returns null for undefined', () => {
            expect(toLocalDateTime(undefined)).toBeNull();
        });

        it('returns null for null', () => {
            expect(toLocalDateTime(null)).toBeNull();
        });
    });

    describe('LocalDateTime input', () => {
        it('returns same LocalDateTime instance', () => {
            expect(toLocalDateTime(FIXED)).toBe(FIXED);
        });
    });

    describe('string input', () => {
        it('parses ISO date-time string', () => {
            const result = toLocalDateTime('2025-03-15T14:30:00');
            expect(result).not.toBeNull();
            expect(result!.year()).toBe(2025);
            expect(result!.monthValue()).toBe(3);
            expect(result!.dayOfMonth()).toBe(15);
            expect(result!.hour()).toBe(14);
            expect(result!.minute()).toBe(30);
        });

        it('returns null for invalid string', () => {
            expect(toLocalDateTime('not-a-date')).toBeNull();
        });

        it('returns null for empty string', () => {
            expect(toLocalDateTime('')).toBeNull();
        });
    });

    describe('number input', () => {
        it('parses epoch milliseconds', () => {
            const jsDate = new Date('2025-03-15T14:30:00Z');
            const result = toLocalDateTime(jsDate.getTime());
            expect(result).not.toBeNull();
            expect(result!.year()).toBe(2025);
            expect(result!.monthValue()).toBe(3);
            expect(result!.dayOfMonth()).toBe(15);
        });
    });

    describe('Date input', () => {
        it('parses JS Date object', () => {
            const jsDate = new Date('2025-03-15T14:30:00Z');
            const result = toLocalDateTime(jsDate);
            expect(result).not.toBeNull();
            expect(result!.year()).toBe(2025);
            expect(result!.monthValue()).toBe(3);
            expect(result!.dayOfMonth()).toBe(15);
        });

        it('returns null for invalid Date', () => {
            expect(toLocalDateTime(new Date('invalid'))).toBeNull();
        });
    });
});

describe('fromLocalDateTime', () => {
    describe('valid input', () => {
        it('formats LocalDateTime to yyyy-MM-ddTHH:mm', () => {
            expect(fromLocalDateTime(FIXED)).toBe(FIXED_STRING);
        });

        it('formats ISO string input', () => {
            expect(fromLocalDateTime('2025-03-15T14:30:00')).toBe(FIXED_STRING);
        });

        it('formats JS Date input', () => {
            const jsDate = new Date('2025-03-15T14:30:00Z');
            const result = fromLocalDateTime(jsDate);
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
        });
    });

    describe('null / undefined input', () => {
        it('returns null for null', () => {
            expect(fromLocalDateTime(null)).toBeNull();
        });

        it('returns null for undefined', () => {
            expect(fromLocalDateTime(undefined)).toBeNull();
        });
    });

    describe('invalid input', () => {
        it('returns null for invalid string', () => {
            expect(fromLocalDateTime('not-a-date')).toBeNull();
        });
    });
});

describe('fromLocalDateTimeOr', () => {
    describe('valid input', () => {
        it('formats LocalDateTime input', () => {
            expect(fromLocalDateTimeOr(FIXED, FIXED)).toBe(FIXED_STRING);
        });

        it('formats ISO string input', () => {
            expect(fromLocalDateTimeOr(FIXED, '2025-03-15T14:30:00')).toBe(FIXED_STRING);
        });

        it('formats JS Date input', () => {
            const jsDate = new Date('2025-03-15T14:30:00Z');
            const result = fromLocalDateTimeOr(FIXED, jsDate);
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
        });
    });

    describe('null / undefined input uses fallback', () => {
        it('uses fallback when input is null', () => {
            expect(fromLocalDateTimeOr(FIXED, null)).toBe(FIXED_STRING);
        });

        it('uses fallback when input is undefined', () => {
            expect(fromLocalDateTimeOr(FIXED, undefined)).toBe(FIXED_STRING);
        });

        it('uses fallback for invalid string', () => {
            expect(fromLocalDateTimeOr(FIXED, 'not-a-date')).toBe(FIXED_STRING);
        });
    });
});
