import { describe, expect, it } from '@jest/globals';

import { asHtml } from './Html.ts';

describe('asHtml', () => {
    it('returns empty paragraph for undefined', () => {
        expect(asHtml(undefined)).toBe('<p></p>');
    });

    it('returns empty paragraph for null', () => {
        expect(asHtml(null)).toBe('<p></p>');
    });

    it('returns empty paragraph for empty string', () => {
        expect(asHtml('')).toBe('<p></p>');
    });

    it('returns value as-is when already valid HTML', () => {
        expect(asHtml('<p>Hello</p>')).toBe('<p>Hello</p>');
    });

    it('wraps plain text in div', () => {
        expect(asHtml('Hello World')).toBe('<div>Hello World</div>');
    });

    it('wraps text starting with < but not ending with > in div', () => {
        expect(asHtml('<not closed')).toBe('<div><not closed</div>');
    });

    it('wraps text ending with > but not starting with < in div', () => {
        expect(asHtml('not opened>')).toBe('<div>not opened></div>');
    });
});
