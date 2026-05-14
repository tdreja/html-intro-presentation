import { HtmlData } from './Html.ts';
import { UuidV4 } from './UuidV4.ts';

/**
 * A single slide within the presentation, with a unique identifier and the displayed content
 */
export interface Slide {
    /**
     * Unique identifier for the slide
     */
    readonly id: UuidV4,
    /**
     * Content of the slide
     */
    content: HtmlData,
}
