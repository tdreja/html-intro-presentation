import { Slide, SlideId } from './Slide.ts';
import { LocalDateTime } from '@js-joda/core';
import { Html } from './Presentation.ts';

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

/**
 * Tries to fetch the content of a slide with the given ID within the slideshow
 */
export function findSlideContent(slideshow?: Slideshow | null, slideId?: SlideId | null): Html | null {
    if (!slideshow || !slideId) {
        return null;
    }
    const slide = slideshow.slides.find((s) => s.id === slideId);
    return slide ? slide.content : null;
}
