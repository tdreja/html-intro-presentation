import { HtmlData } from './Html.ts';

export type SlideId = `${string}-${string}-${string}-${string}-${string}`;

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
