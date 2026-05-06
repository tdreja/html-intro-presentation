import { describe, expect, it } from '@jest/globals';
import { getNextSlideShowId } from './Slideshow.ts';

describe('getNextSlideId', () => {
    it('returns object with typeId SlideId', () => {
        const id = getNextSlideShowId();
        expect(id.typeId).toBe('SlideId');
    });

    it('returns valid UUID v4 format', () => {
        const id = getNextSlideShowId();
        expect(id.value).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        );
    });

    it('returns unique ids on each call', () => {
        const a = getNextSlideShowId();
        const b = getNextSlideShowId();
        expect(a.value).not.toBe(b.value);
    });
});
