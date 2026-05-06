import { Slide } from './Slide.ts';
import { LocalDateTime } from '@js-joda/core';

export type SlideShowId = `${string}-${string}-${string}-${string}-${string}`;

/**
 * Container for the entire slideshow
 */
export interface Slideshow {
    /**
     * Unique ID of the current slideshow
     */
    readonly id: SlideShowId,
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
        id: crypto.randomUUID(),
        slides: [],
        countdownTarget: null,
    };
}
