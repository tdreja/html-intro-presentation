import { describe, it, expect } from '@jest/globals';
import { getNextSlideId, asHtml } from './Slide';

describe('getNextSlideId', () => {
    it('returns object with typeId SlideId', () => {
        const id = getNextSlideId();
        expect(id.typeId).toBe('SlideId');
    });

    it('returns valid UUID v4 format', () => {
        const id = getNextSlideId();
        expect(id.value).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        );
    });

    it('returns unique ids on each call', () => {
        const a = getNextSlideId();
        const b = getNextSlideId();
        expect(a.value).not.toBe(b.value);
    });
});

describe('asHtml', () => {
    it('wraps string as Html with typeId Html', () => {
        const html = asHtml('<p>hello</p>');
        expect(html.typeId).toBe('Html');
        expect(html.value).toBe('<p>hello</p>');
    });

    it('returns empty Html for empty string', () => {
        const html = asHtml('');
        expect(html.value).toBe('');
        expect(html.typeId).toBe('Html');
    });

    it('returns empty Html for null', () => {
        const html = asHtml(null);
        expect(html.value).toBe('');
        expect(html.typeId).toBe('Html');
    });

    it('returns empty Html for undefined', () => {
        const html = asHtml(undefined);
        expect(html.value).toBe('');
        expect(html.typeId).toBe('Html');
    });

    it('returns empty Html when called with no arguments', () => {
        const html = asHtml();
        expect(html.value).toBe('');
        expect(html.typeId).toBe('Html');
    });
});
