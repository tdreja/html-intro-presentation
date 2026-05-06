import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react';
import './editor-style.css';
import 'material-symbols';
import { TopBar } from './TopBar.tsx';
import {
    addChange,
    applyChanges,
    ChangeEvent,
    ChangeSet,
    emptyChangeSet,
    redoLastChange,
    revertLastChange,
    UpdateSlideContentEvent,
} from '../../model/ChangeEvent.ts';
import { SlideCarousel } from './SlideCarousel.tsx';
import { SlideEditor } from './SlideEditor.tsx';
import { BottomBar } from './BottomBar.tsx';
import { SlideId } from '../../model/Slide.ts';
import { findSlideContent, Slideshow } from '../../model/Slideshow.ts';
import '../global-style.css';
import { SlideshowContext } from '../../component/SlideshowContext.ts';
import { RouteContext } from '../../component/RouteContext.ts';

export const Editor = (): ReactElement => {
    // Attach to the overall UI
    const [slideshow, setSlideshow] = useContext(SlideshowContext);
    const [_, setRoute] = useContext(RouteContext);

    // Hold the edited changes as internal state!
    const [changeSet, setChangeSet] = useState<ChangeSet>(emptyChangeSet);
    const [editedSlideshow, setEditedSlideshow] = useState<Slideshow>(slideshow);
    const [editedSlideId, setEditedSlideId] = useState<SlideId | null>(null);
    const [slideContent, setSlideContent] = useState<string>('');

    const onApplyChanges = useCallback((newChangeset: ChangeSet) => {
        // First apply all changes to the slideshow!
        let finalizedChangeset: ChangeSet = newChangeset;
        const [nextSlideShow, nextEditedSlideId] = applyChanges(slideshow, null, finalizedChangeset);

        // We may have edited an existing slide?
        if (editedSlideId && nextEditedSlideId !== editedSlideId) {
            const currentContent = findSlideContent(nextSlideShow, editedSlideId);
            // We have unsaved changes, so we need to add an update event for the current slide!
            if (currentContent !== slideContent) {
                finalizedChangeset
                    = addChange(finalizedChangeset, new UpdateSlideContentEvent(editedSlideId, slideContent));
            }
        }

        // We apply our unsaved content to the newly selected slide!
        if (editedSlideId === null && nextEditedSlideId && slideContent !== '') {

        }

        // Update our slideshow state
        setEditedSlideshow(nextSlideShow);
        setEditedSlideId(nextEditedSlideId);
        setSlideContent(findSlideContent(nextSlideShow, nextEditedSlideId) || '');

        console.log('Changes?', finalizedChangeset.appliedEvents);
        return finalizedChangeset;
    }, [
        editedSlideId,
        setEditedSlideId,
        editedSlideshow,
        setEditedSlideshow,
        slideContent,
        setSlideContent,
        slideshow]);

    // Callbacks to add, undo and redo changes
    const onAddChange = useCallback((event: ChangeEvent) => {
        const newChangeset = onApplyChanges(addChange(changeSet, event));
        setChangeSet(newChangeset);
    }, [changeSet, setChangeSet]);
    const onUndoLastChange = useCallback(() => {
        const newChangeset = onApplyChanges(revertLastChange(changeSet));
        setChangeSet(newChangeset);
    }, [changeSet, setChangeSet]);
    const onRedoLastChange = useCallback(() => {
        const newChangeset = onApplyChanges(redoLastChange(changeSet));
        setChangeSet(newChangeset);
    }, [changeSet, setChangeSet]);

    const onStartSlideshow = () => {};

    // Reset the editor, if the slideshow was changed!
    useEffect(() => {
        setEditedSlideshow(slideshow);
        setEditedSlideId(null);
        setChangeSet(emptyChangeSet);
        setSlideContent('');
    }, [slideshow]);

    return (
        <div id="editor-page">
            {/* ══ TOP BAR ══ */}
            <TopBar
                editedSlideId={editedSlideId}
                editedSlideshow={editedSlideshow}
                changeSet={changeSet}
                onAddChange={onAddChange}
                onRedoLastChange={onRedoLastChange}
                onUndoLastChange={onUndoLastChange}
            />

            {/* ══ EDITOR AREA ══ */}
            <div id="editor-area">

                {/* Slide Carousel */}
                <SlideCarousel
                    editedSlideId={editedSlideId}
                    editedSlideshow={editedSlideshow}
                    changeSet={changeSet}
                    onAddChange={onAddChange}
                    onRedoLastChange={onRedoLastChange}
                    onUndoLastChange={onUndoLastChange}
                />

                {/* Slide Editor */}
                <SlideEditor
                    editedSlideId={editedSlideId}
                    editedSlideshow={editedSlideshow}
                    onAddChange={onAddChange}
                    changeSet={changeSet}
                    onRedoLastChange={onRedoLastChange}
                    onUndoLastChange={onUndoLastChange}
                    slideContent={slideContent}
                    setSlideContent={setSlideContent}
                />

            </div>

            {/* ══ BOTTOM BAR ══ */}
            <BottomBar
                editedSlideId={editedSlideId}
                editedSlideshow={editedSlideshow}
                onAddChange={onAddChange}
                changeSet={changeSet}
                onRedoLastChange={onRedoLastChange}
                onUndoLastChange={onUndoLastChange}
                onStartSlideshow={onStartSlideshow}
            />
        </div>
    );
};
