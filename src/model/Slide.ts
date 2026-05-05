export type SlideId = `${string}-${string}-${string}-${string}-${string}`;

/**
 * Container for HTML content
 */
export type HtmlData = `<${string}>${string}</${string}>`;

/**
 * A single slide within the presentation, with a unique identifier and the displayed content
 */
export interface Slide {
    /**
     * Unique identifier for the slide
     */
    readonly id: SlideId,
    /**
     * Content of the slide
     */
    content: HtmlData,
}

/**
 * Wraps the given content as HTML
 */
export function asHtml(value?: string | null): HtmlData {
    if (!value || value.length === 0) {
        return '<span></span>';
    }
    if (value.startsWith('<') && value.endsWith('>')) {
        return value as HtmlData;
    }
    return `<div>${value}</div>` as HtmlData;
}
