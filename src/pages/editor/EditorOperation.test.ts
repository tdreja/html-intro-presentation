import { describe, expect, it } from '@jest/globals';
import { checkForSlideContentChanges, mergeAdditionalChanges } from './EditorOperation.ts';
import { ChangeEvent, ChangeSet, UpdateSlideContentEvent } from '../../model/ChangeEvent.ts';
import { SlideId } from '../../model/Slide.ts';
import { emptySlideshow, Slideshow } from '../../model/Slideshow.ts';
import { asHtml } from '../../model/Html.ts';
import { Stack } from '../../utils/Stack.ts';

function freshChangeSet(): ChangeSet {
    return {
        appliedEvents: new Stack<ChangeEvent>(30),
        pendingEvents: new Stack<ChangeEvent>(30),
    };
}

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
        const result = checkForSlideContentChanges(slideshow, slideIdA, '', slideIdB);
        expect(result).toEqual({ prependChange: null, appendChange: null });
    });

    it('empty paragraph editorContent → no changes', () => {
        const result = checkForSlideContentChanges(slideshow, slideIdA, '<p></p>', slideIdB);
        expect(result).toEqual({ prependChange: null, appendChange: null });
    });

    it('null editedSlideId, null moveToSlideId, non-empty content → no changes', () => {
        const result = checkForSlideContentChanges(emptyShow, null, '<p>Content</p>', null);
        expect(result).toEqual({ prependChange: null, appendChange: null });
    });

    // --- No editedSlideId, but moveToSlideId present ---

    it('null editedSlideId, moveToSlideId set → appendChange with UpdateSlideContentEvent', () => {
        const result = checkForSlideContentChanges(emptyShow, null, '<p>New</p>', slideIdA);
        expect(result.prependChange).toBeNull();
        expect(result.appendChange).toBeInstanceOf(UpdateSlideContentEvent);
        expect((result.appendChange as UpdateSlideContentEvent).moveToSlide).toBe(slideIdA);
    });

    // --- editedSlideId present, content changed ---

    it('editedSlideId present, content differs from stored → prependChange with UpdateSlideContentEvent', () => {
        const result = checkForSlideContentChanges(slideshow, slideIdA, '<p>Changed</p>', slideIdB);
        expect(result.appendChange).toBeNull();
        expect(result.prependChange).toBeInstanceOf(UpdateSlideContentEvent);
        expect((result.prependChange as UpdateSlideContentEvent).moveToSlide).toBe(slideIdA);
    });

    // --- editedSlideId present, content unchanged ---

    it('editedSlideId present, content matches stored → no changes', () => {
        const result = checkForSlideContentChanges(slideshow, slideIdA, contentA, slideIdB);
        expect(result).toEqual({ prependChange: null, appendChange: null });
    });

    // --- editedSlideId not found in slideshow ---

    it('editedSlideId unknown in slideshow, content differs → prependChange (content not null in store)', () => {
        const unknownId: SlideId = crypto.randomUUID();
        // findSlideContent returns null → null !== '<p>X</p>' → prepend change
        const result = checkForSlideContentChanges(slideshow, unknownId, '<p>X</p>', slideIdB);
        expect(result.appendChange).toBeNull();
        expect(result.prependChange).toBeInstanceOf(UpdateSlideContentEvent);
        expect((result.prependChange as UpdateSlideContentEvent).moveToSlide).toBe(unknownId);
    });
});

describe('mergeAdditionalChanges', () => {
    const slideIdA: SlideId = crypto.randomUUID();
    const slideIdB: SlideId = crypto.randomUUID();
    const slideIdC: SlideId = crypto.randomUUID();

    const prepend = new UpdateSlideContentEvent(slideIdA, '<p>prepend</p>');
    const main = new UpdateSlideContentEvent(slideIdB, '<p>main</p>');
    const append = new UpdateSlideContentEvent(slideIdC, '<p>append</p>');

    function appliedEvents(cs: ChangeSet): ChangeEvent[] {
        return [...cs.appliedEvents];
    }

    it('null changeSet, null additionalChanges, null mainEvent → empty ChangeSet', () => {
        const result = mergeAdditionalChanges(freshChangeSet(), null, null);
        expect(appliedEvents(result)).toHaveLength(0);
    });

    it('no args → empty ChangeSet', () => {
        const result = mergeAdditionalChanges();
        expect(appliedEvents(result)).toHaveLength(0);
    });

    it('only mainEvent → [main]', () => {
        const result = mergeAdditionalChanges(freshChangeSet(), null, main);
        expect(appliedEvents(result)).toEqual([main]);
    });

    it('only prependChange → [prepend]', () => {
        const result = mergeAdditionalChanges(freshChangeSet(), { prependChange: prepend, appendChange: null }, null);
        expect(appliedEvents(result)).toEqual([prepend]);
    });

    it('only appendChange → [append]', () => {
        const result = mergeAdditionalChanges(freshChangeSet(), { prependChange: null, appendChange: append }, null);
        expect(appliedEvents(result)).toEqual([append]);
    });

    it('all three → order: prepend, main, append', () => {
        const result = mergeAdditionalChanges(
            freshChangeSet(),
            { prependChange: prepend, appendChange: append },
            main,
        );
        expect(appliedEvents(result)).toEqual([prepend, main, append]);
    });

    it('existing changeSet preserved, events appended after', () => {
        const existing = freshChangeSet();
        existing.appliedEvents.push(prepend);

        const result = mergeAdditionalChanges(existing, null, main);
        expect(appliedEvents(result)).toEqual([prepend, main]);
    });
});
