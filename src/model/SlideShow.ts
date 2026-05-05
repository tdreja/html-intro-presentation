import { TypeContainer, uniqueIdentifier } from './TypeContainer.ts';
import { Slide } from './Slide.ts';
import { LocalDateTime } from '@js-joda/core';

/**
 * Unique ID for each slideshow
 */
export type SlideShowId = TypeContainer<string> & {
    value: `${string}-${string}-${string}-${string}-${string}`,
    typeId: 'SlideShowId',
};

/**
 * Container for the entire slideshow
 */
export interface SlideShow {
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

/**
 * Generates a new slide ID based on the current timestamp
 */
export function getNextSlideShowId(): SlideShowId {
    return uniqueIdentifier('SlideShowId');
}

export function emptySlideShow(): SlideShow {
    return {
        id: getNextSlideShowId(),
        slides: [],
        countdownTarget: null,
    };
}
