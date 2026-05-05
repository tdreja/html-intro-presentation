import { describe, it, expect } from '@jest/globals';
import { get, set, isEqual, TypeContainer } from './TypeContainer';

type TestType = TypeContainer<string> & {
    typeId: 'test-type',
};

function asTestType(value: string): TestType {
    return {
        value,
        typeId: 'test-type',
    };
}

describe('get', () => {
    it('returns value from container', () => {
        const item = asTestType('test-value');
        expect(get(item)).toBe('test-value');
    });
});

describe('set', () => {
    it('returns new container with updated value', () => {
        const item = asTestType('alpha');
        expect(set(item, 'beta').value).toBe('beta');
    });

    it('preserves typeId', () => {
        const item = asTestType('alpha');
        expect(set(item, 'beta').typeId).toBe('test-type');
    });

    it('does not mutate original container', () => {
        const original = asTestType('alpha');
        const copy = set(original, 'beta');
        expect(original.value).toBe('alpha');
        expect(copy.value).toBe('beta');
    });
});

describe('isEqual', () => {
    it('returns true for same typeId and same value reference', () => {
        const item = asTestType('alpha');
        expect(isEqual(item, item)).toBe(true);
    });

    it('returns false for different typeIds', () => {
        const item = asTestType('alpha');
        const otherType: TypeContainer<string> = {
            value: 'alpha',
            typeId: 'other-type',
        };
        expect(isEqual(item, otherType)).toBe(false);
    });

    it('returns false when first is null', () => {
        const item = asTestType('alpha');
        expect(isEqual(null, item)).toBe(false);
    });

    it('returns false when second is null', () => {
        const item = asTestType('alpha');
        expect(isEqual(item, null)).toBe(false);
    });

    it('returns true when both are null', () => {
        expect(isEqual(null, null)).toBe(true);
    });

    it('returns true when both are undefined', () => {
        expect(isEqual(undefined, undefined)).toBe(true);
    });

    it('returns false when first undefined, second defined', () => {
        const item = asTestType('alpha');
        expect(isEqual(undefined, item)).toBe(false);
    });
});
