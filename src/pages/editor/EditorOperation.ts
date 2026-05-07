import { addChange, ChangeEvent, ChangeSet, emptyChangeSet, UpdateSlideContentEvent } from '../../model/ChangeEvent.ts';
import { findSlideContent, Slideshow } from '../../model/Slideshow.ts';
import { SlideId } from '../../model/Slide.ts';
import { isEmptyHtml } from '../../model/Html.ts';

/**
 * Additional changes from the html content of the slide before completing the change operation
 */
export interface AdditionalChange {
    /**
     * This change needs to be added before completing the overall operation
     */
    readonly prependChange: ChangeEvent | null,
    /**
     * This change needs to be added after completing the overall operation
     */
    readonly appendChange: ChangeEvent | null,
}

const noChanges: AdditionalChange = {
    prependChange: null,
    appendChange: null,
};

/**
 * Checks if the HTML content of the current slide was changed before we run another change operation
 */
export function checkForSlideContentChanges(
    slideshow: Slideshow,
    editedSlideId: SlideId | null,
    editorContent: string,
    moveToSlideId?: SlideId | null,
): AdditionalChange {
    // Skip any checks if we don't have any relevant content!
    if (isEmptyHtml(editorContent)) {
        return noChanges;
    }

    if (!editedSlideId) {
        // We move to a new slide from none?
        if (moveToSlideId) {
            return {
                prependChange: null,
                appendChange: new UpdateSlideContentEvent(moveToSlideId, editorContent),
            };
        }

        // No other slide? Reject the content!
        return noChanges;
    }

    // Check if the content was edited!
    const currentSlideContent = findSlideContent(slideshow, editedSlideId);
    if (currentSlideContent !== editorContent) {
        return {
            prependChange: new UpdateSlideContentEvent(editedSlideId, editorContent),
            appendChange: null,
        };
    }

    // No changes occurred!
    return noChanges;
}

export function mergeAdditionalChanges(
    changeSet?: ChangeSet | null,
    additionalChanges?: AdditionalChange | null,
    mainEvent?: ChangeEvent | null,
): ChangeSet {
    let newChangeSet: ChangeSet = changeSet || emptyChangeSet();
    if (additionalChanges?.prependChange) {
        newChangeSet = addChange(newChangeSet, additionalChanges.prependChange);
    }
    if (mainEvent) {
        newChangeSet = addChange(newChangeSet, mainEvent);
    }
    if (additionalChanges?.appendChange) {
        newChangeSet = addChange(newChangeSet, additionalChanges.appendChange);
    }
    return newChangeSet;
}
