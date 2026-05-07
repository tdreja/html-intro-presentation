import { Slide } from './Slide.ts';
import { LocalDateTime } from '@js-joda/core';
import { HtmlData } from './Html.ts';
import { generateUuidV4, UuidV4 } from './UuidV4.ts';

/**
 * Container for the entire slideshow
 */
export interface Slideshow {
    /**
     * Unique ID of the current slideshow
     */
    readonly id: UuidV4,
    /**
     * All slides that will be displayed
     */
    slides: Slide[],
    /**
     * Optional countdown target, if a countdown should be displayed
     */
    countdownTarget: LocalDateTime | null,
}

export function emptySlideshow(): Slideshow {
    return {
        id: generateUuidV4(),
        slides: [],
        countdownTarget: null,
    };
}

/**
 * Tries to fetch the content of a slide with the given ID within the slideshow
 */
export function findSlideContent(slideshow?: Slideshow | null, slideId?: UuidV4 | null): HtmlData | null {
    if (!slideshow || !slideId) {
        return null;
    }
    const slide = slideshow.slides.find((s) => s.id === slideId);
    return slide ? slide.content : null;
}
