import { describe, expect, it } from '@jest/globals';
import { generateUuidV4, toUuidV4, toUuidV4OrRandom, UUID_V4_REGEX } from './UuidV4';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const INVALID_VALUES = ['', 'not-a-uuid', '12345', 'gggggggg-0000-0000-0000-000000000000'];

describe('generateUuid', () => {
    it('returns valid UUID format', () => {
        const uuid = generateUuidV4();
        expect(uuid).toMatch(UUID_V4_REGEX);
    });

    it('returns unique values', () => {
        const a = generateUuidV4();
        const b = generateUuidV4();
        expect(a).not.toBe(b);
    });
});

describe('toUuid', () => {
    it('returns UUID for valid string', () => {
        expect(toUuidV4(VALID_UUID)).toBe(VALID_UUID);
    });

    it('returns null for undefined', () => {
        expect(toUuidV4(undefined)).toBeNull();
    });

    it('returns null for null', () => {
        expect(toUuidV4(null)).toBeNull();
    });

    it.each(INVALID_VALUES)('returns null for invalid value "%s"', (value) => {
        expect(toUuidV4(value)).toBeNull();
    });

    it('accepts uppercase UUID', () => {
        const upper = VALID_UUID.toUpperCase();
        expect(toUuidV4(upper)).toBe(upper);
    });
});

describe('toUuidOrRandom', () => {
    it('returns given UUID when valid', () => {
        expect(toUuidV4OrRandom(VALID_UUID)).toBe(VALID_UUID);
    });

    it('returns new UUID for undefined', () => {
        const result = toUuidV4OrRandom(undefined);
        expect(result).toMatch(UUID_V4_REGEX);
    });

    it('returns new UUID for null', () => {
        const result = toUuidV4OrRandom(null);
        expect(result).toMatch(UUID_V4_REGEX);
    });

    it.each(INVALID_VALUES)('returns new UUID for invalid value "%s"', (value) => {
        const result = toUuidV4OrRandom(value);
        expect(result).toMatch(UUID_V4_REGEX);
    });
});
