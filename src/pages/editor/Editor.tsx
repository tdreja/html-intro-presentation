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
} from '../../model/ChangeEvent.ts';
import { SlideCarousel } from './SlideCarousel.tsx';
import { SlideEditor } from './SlideEditor.tsx';
import { BottomBar } from './BottomBar.tsx';
import { SlideId } from '../../model/Slide.ts';
import { Slideshow } from '../../model/Slideshow.ts';
import '../global-style.css';
import { SlideshowContext } from '../../component/SlideshowContext.ts';

export const Editor = (): ReactElement => {
    // Attach to the overall UI
    const [slideshow] = useContext(SlideshowContext);

    // Hold the edited changes as internal state!
    const [changeSet, setChangeSet] = useState<ChangeSet>(emptyChangeSet);
    const [editedSlideshow, setEditedSlideshow] = useState<Slideshow>(slideshow);
    const [editedSlideId, setEditedSlideId] = useState<SlideId | null>(null);

    // Callbacks to add, undo and redo changes
    const onAddChange = useCallback((event: ChangeEvent) => {
        setChangeSet((prev) => addChange(prev, event));
    }, [setChangeSet]);
    const onUndoLastChange = useCallback(() => {
        setChangeSet((prev) => revertLastChange(prev));
    }, [setChangeSet]);
    const onRedoLastChange = useCallback(() => {
        setChangeSet((prev) => redoLastChange(prev));
    }, [setChangeSet]);

    // Changes to the changeset affect the presentation state!
    useEffect(() => {
        const [nextSlideShow, nextEditedSlideId] = applyChanges(slideshow, null, changeSet);
        setEditedSlideshow(nextSlideShow);
        setEditedSlideId(nextEditedSlideId);
    }, [changeSet]);

    // Reset the editor, if the slideshow was changed!
    useEffect(() => {
        setEditedSlideshow(slideshow);
        setEditedSlideId(null);
        setChangeSet(emptyChangeSet);
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
            />
        </div>
    );
};
