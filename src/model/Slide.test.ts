import { describe, expect, it } from '@jest/globals';

import { toHtmlData } from './Html.ts';

describe('asHtml', () => {
    it('returns empty paragraph for undefined', () => {
        expect(toHtmlData(undefined)).toBe('<p></p>');
    });

    it('returns empty paragraph for null', () => {
        expect(toHtmlData(null)).toBe('<p></p>');
    });

    it('returns empty paragraph for empty string', () => {
        expect(toHtmlData('')).toBe('<p></p>');
    });

    it('returns value as-is when already valid HTML', () => {
        expect(toHtmlData('<p>Hello</p>')).toBe('<p>Hello</p>');
    });

    it('wraps plain text in div', () => {
        expect(toHtmlData('Hello World')).toBe('<div>Hello World</div>');
    });

    it('wraps text starting with < but not ending with > in div', () => {
        expect(toHtmlData('<not closed')).toBe('<div><not closed</div>');
    });

    it('wraps text ending with > but not starting with < in div', () => {
        expect(toHtmlData('not opened>')).toBe('<div>not opened></div>');
    });
});
