/**
 * Container for HTML content
 */
export type HtmlData = `<${string}>${string}</${string}>`;

export const emptyHtmlParagraph: HtmlData = '<p></p>';

/**
 * Wraps the given content as HTML
 */
export function toHtmlData(value?: string | null): HtmlData {
    if (!value || value.length === 0) {
        return emptyHtmlParagraph;
    }
    if (value.startsWith('<') && value.endsWith('>')) {
        return value as HtmlData;
    }
    return `<div>${value}</div>` as HtmlData;
}

export function isEmptyHtml(value?: string | HtmlData | null): boolean {
    // Actual empty or undefined strings?
    if (!value || value.length === 0) {
        return true;
    }
    // Empty HTML paragraph?
    return value === emptyHtmlParagraph;
}
