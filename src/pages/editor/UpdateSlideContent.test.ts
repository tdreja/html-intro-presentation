import { describe, expect, it } from '@jest/globals';
import { ChangeEvent, UpdateSlideContentEvent } from '../../model/ChangeEvent.ts';
import { updateSlideContent } from './UpdateSlideContent.ts';
import { SlideId } from '../../model/Slide.ts';
import { emptySlideshow, Slideshow } from '../../model/Slideshow.ts';
import { asHtml } from '../../model/Html.ts';

describe('UpdateSlideContent', () => {
    const slideIdA: SlideId = crypto.randomUUID();
    const slideIdB: SlideId = crypto.randomUUID();

    let events: Array<ChangeEvent> = [];
    const onAddChange = (event: ChangeEvent) => events.push(event);
    const slideShow: Slideshow = emptySlideshow();

    // --- No-op cases ---

    it('SlideID stays the same? No changes!', () => {
        events = [];
        const result
            = updateSlideContent(slideShow, slideIdA, onAddChange, slideIdA, 'New Content');
        expect(result).toBe(false);
        expect(events).toHaveLength(0);
    });
    it('SlideID stays null? No changes!', () => {
        events = [];
        const result
            = updateSlideContent(slideShow, null, onAddChange, null, 'New Content');
        expect(result).toBe(false);
        expect(events).toHaveLength(0);
    });

    // --- editedSlideId not in slideShow → reset ---

    it('Switch to unknown slide → reset to empty', () => {
        events = [];
        const result = updateSlideContent(slideShow, slideIdA, onAddChange, null, null);
        expect(result).toEqual(['<span></span>', null, 0]);
        expect(events).toHaveLength(0);
    });

    it('Switch to null from known lastId → no old-slide event (slide not in show), reset', () => {
        events = [];
        const result = updateSlideContent(slideShow, null, onAddChange, slideIdA, '<p>old</p>');
        // lastEditedSlideId not found in empty show → no event
        expect(result).toEqual(['<span></span>', null, 0]);
        expect(events).toHaveLength(0);
    });

    // --- Slides present in slideShow ---

    const contentA = asHtml('<p>Hello A</p>');
    const contentB = asHtml('<p>Hello B</p>');
    const slideShowWithSlides: Slideshow = {
        ...emptySlideshow(),
        slides: [
            { id: slideIdA, content: contentA },
            { id: slideIdB, content: contentB },
        ],
    };

    it('Switch slide, old content unchanged → no event, return new slide data', () => {
        events = [];
        // lastEditedSlideId=slideIdA, content matches stored → no event
        const result = updateSlideContent(slideShowWithSlides, slideIdB, onAddChange, slideIdA, contentA);
        expect(result).toEqual([contentB, slideIdB, 2]);
        expect(events).toHaveLength(0);
    });

    it('Switch slide, old content changed → fires event for old slide, returns new slide data', () => {
        events = [];
        const modifiedContent = '<div>Changed</div>';
        const result = updateSlideContent(slideShowWithSlides, slideIdB, onAddChange, slideIdA, modifiedContent);
        expect(result).toEqual([contentB, slideIdB, 2]);
        expect(events).toHaveLength(1);
        expect(events[0]).toBeInstanceOf(UpdateSlideContentEvent);
    });

    it('Switch to first slide → returns index 1', () => {
        events = [];
        const result = updateSlideContent(slideShowWithSlides, slideIdA, onAddChange, null, null);
        expect(result).toEqual([contentA, slideIdA, 1]);
        expect(events).toHaveLength(0);
    });

    it('lastEditedSlideId=null, editedSlideId known, content null → no event, return stored content', () => {
        events = [];
        const result = updateSlideContent(slideShowWithSlides, slideIdA, onAddChange, null, null);
        expect(result).toEqual([contentA, slideIdA, 1]);
        expect(events).toHaveLength(0);
    });

    it('lastEditedSlideId=null, editedSlideId known, content empty → no event, return stored content', () => {
        events = [];
        const result = updateSlideContent(slideShowWithSlides, slideIdA, onAddChange, null, '');
        expect(result).toEqual([contentA, slideIdA, 1]);
        expect(events).toHaveLength(0);
    });

    it('lastEditedSlideId=null, editedSlideId known, content non-empty → fires event, returns override content', () => {
        events = [];
        const newContent = '<p>Override</p>';
        const result = updateSlideContent(slideShowWithSlides, slideIdA, onAddChange, null, newContent);
        expect(result).toEqual([newContent, slideIdA, 1]);
        expect(events).toHaveLength(1);
        expect(events[0]).toBeInstanceOf(UpdateSlideContentEvent);
    });

    it('lastEditedSlideId=null, editedSlideId unknown, content non-empty → fires event, resets (slide not found)', () => {
        events = [];
        const unknownId: SlideId = crypto.randomUUID();
        const newContent = '<p>Unknown</p>';
        const result = updateSlideContent(slideShowWithSlides, unknownId, onAddChange, null, newContent);
        // overrideSlideContent set but slide not in show → reset
        expect(result).toEqual(['<span></span>', null, 0]);
        expect(events).toHaveLength(1);
        expect(events[0]).toBeInstanceOf(UpdateSlideContentEvent);
    });

    it('Switch to null from slide with changed content → fires event, returns reset', () => {
        events = [];
        const modifiedContent = '<div>Modified</div>';
        const result = updateSlideContent(slideShowWithSlides, null, onAddChange, slideIdA, modifiedContent);
        expect(result).toEqual(['<span></span>', null, 0]);
        expect(events).toHaveLength(1);
        expect(events[0]).toBeInstanceOf(UpdateSlideContentEvent);
    });
});
