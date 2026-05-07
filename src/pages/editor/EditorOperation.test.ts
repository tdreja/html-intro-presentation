import { describe, expect, it } from '@jest/globals';
import { checkForSlideContentChanges } from './EditorOperation.ts';
import { UpdateSlideContentEvent } from '../../model/ChangeEvent.ts';
import { SlideId } from '../../model/Slide.ts';
import { emptySlideshow, Slideshow } from '../../model/Slideshow.ts';
import { asHtml } from '../../model/Html.ts';

describe('checkForSlideContentChanges', () => {
    const slideIdA: SlideId = crypto.randomUUID();
    const slideIdB: SlideId = crypto.randomUUID();

    const contentA = asHtml('<p>Hello A</p>');
    const contentB = asHtml('<p>Hello B</p>');

    const slideshow: Slideshow = {
        ...emptySlideshow(),
        slides: [
            { id: slideIdA, content: contentA },
            { id: slideIdB, content: contentB },
        ],
    };

    const emptyShow: Slideshow = emptySlideshow();

    // --- Empty / no-op cases ---

    it('empty editorContent → no changes', () => {
        const result = checkForSlideContentChanges(slideshow, slideIdA, slideIdB, '');
        expect(result).toEqual({ prependChange: null, appendChange: null });
    });

    it('empty paragraph editorContent → no changes', () => {
        const result = checkForSlideContentChanges(slideshow, slideIdA, slideIdB, '<p></p>');
        expect(result).toEqual({ prependChange: null, appendChange: null });
    });

    it('null editedSlideId, null moveToSlideId, non-empty content → no changes', () => {
        const result = checkForSlideContentChanges(emptyShow, null, null, '<p>Content</p>');
        expect(result).toEqual({ prependChange: null, appendChange: null });
    });

    // --- No editedSlideId, but moveToSlideId present ---

    it('null editedSlideId, moveToSlideId set → appendChange with UpdateSlideContentEvent', () => {
        const result = checkForSlideContentChanges(emptyShow, null, slideIdA, '<p>New</p>');
        expect(result.prependChange).toBeNull();
        expect(result.appendChange).toBeInstanceOf(UpdateSlideContentEvent);
        expect((result.appendChange as UpdateSlideContentEvent).moveToSlide).toBe(slideIdA);
    });

    // --- editedSlideId present, content changed ---

    it('editedSlideId present, content differs from stored → prependChange with UpdateSlideContentEvent', () => {
        const result = checkForSlideContentChanges(slideshow, slideIdA, slideIdB, '<p>Changed</p>');
        expect(result.appendChange).toBeNull();
        expect(result.prependChange).toBeInstanceOf(UpdateSlideContentEvent);
        expect((result.prependChange as UpdateSlideContentEvent).moveToSlide).toBe(slideIdA);
    });

    // --- editedSlideId present, content unchanged ---

    it('editedSlideId present, content matches stored → no changes', () => {
        const result = checkForSlideContentChanges(slideshow, slideIdA, slideIdB, contentA);
        expect(result).toEqual({ prependChange: null, appendChange: null });
    });

    // --- editedSlideId not found in slideshow ---

    it('editedSlideId unknown in slideshow, content differs → prependChange (content not null in store)', () => {
        const unknownId: SlideId = crypto.randomUUID();
        // findSlideContent returns null → null !== '<p>X</p>' → prepend change
        const result = checkForSlideContentChanges(slideshow, unknownId, slideIdB, '<p>X</p>');
        expect(result.appendChange).toBeNull();
        expect(result.prependChange).toBeInstanceOf(UpdateSlideContentEvent);
        expect((result.prependChange as UpdateSlideContentEvent).moveToSlide).toBe(unknownId);
    });
});
