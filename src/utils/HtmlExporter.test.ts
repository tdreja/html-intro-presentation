import { describe, expect, it } from '@jest/globals';
import { alterHtml } from './HtmlExporter';

const startComment = '/*** Slideshow Start ***/';
const endComment = '/*** Slideshow End ***/';

function buildHtml(between: string = ''): string {
    return `<script>\n${startComment}${between}${endComment}\n</script>`;
}

describe('alterHtml', () => {
    it('inserts content between markers', () => {
        const html = buildHtml();
        const result = alterHtml(html, 'MY_CONTENT');
        expect(result).toContain(`${startComment}\nwindow.SLIDESHOW=\`\nMY_CONTENT\n\`;\n${endComment}`);
    });

    it('replaces existing content between markers', () => {
        const html = buildHtml('\nwindow.SLIDESHOW=`\nOLD\n`;\n');
        const result = alterHtml(html, 'NEW_CONTENT');
        expect(result).toContain('NEW_CONTENT');
        expect(result).not.toContain('OLD');
    });

    it('returns html unchanged when start marker missing', () => {
        const html = `<script>\n${endComment}\n</script>`;
        expect(alterHtml(html, 'X')).toBe(html);
    });

    it('returns html unchanged when end marker missing', () => {
        const html = `<script>\n${startComment}\n</script>`;
        expect(alterHtml(html, 'X')).toBe(html);
    });

    it('returns html unchanged when markers in wrong order', () => {
        const html = `<script>\n${endComment}\n${startComment}\n</script>`;
        expect(alterHtml(html, 'X')).toBe(html);
    });

    it('preserves content before start marker', () => {
        const html = buildHtml();
        const result = alterHtml(html, 'DATA');
        expect(result.startsWith('<script>\n')).toBe(true);
    });

    it('preserves content after end marker', () => {
        const html = buildHtml() + '\nSOME_TAIL';
        const result = alterHtml(html, 'DATA');
        expect(result.endsWith('SOME_TAIL')).toBe(true);
    });

    it('handles empty new content', () => {
        const html = buildHtml();
        const result = alterHtml(html, '');
        expect(result).toContain(`${startComment}\nwindow.SLIDESHOW=\`\n\n\`;\n${endComment}`);
    });
});
