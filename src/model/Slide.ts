import { TypeContainer, uniqueIdentifier } from './TypeContainer';

/**
 * Container for HTML content
 */
export type Html = TypeContainer<string> & {
    typeId: 'Html',
};

/**
 * Unique ID for each slide
 */
export type SlideId = TypeContainer<string> & {
    value: `${string}-${string}-${string}-${string}-${string}`,
    typeId: 'SlideId',
};

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
    content: Html,
}

/**
 * Generates a new slide ID based on the current timestamp
 */
export function getNextSlideId(): SlideId {
    return uniqueIdentifier('SlideId');
}

/**
 * Wraps the given content as HTML
 */
export function asHtml(value?: string | null): Html {
    if (!value || value.length === 0) {
        return {
            value: '',
            typeId: 'Html',
        };
    }
    return {
        value,
        typeId: 'Html',
    };
}
