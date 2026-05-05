import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import './editor-style.css';
import 'material-symbols';
import { TopBar } from './TopBar.tsx';
import { addChange, applyChanges, ChangeEvent, ChangeSet, emptyChangeSet } from '../../model/ChangeEvent.ts';
import { SlideCarousel } from './SlideCarousel.tsx';
import { SlideEditor } from './SlideEditor.tsx';
import { BottomBar } from './BottomBar.tsx';
import { SlideId } from '../../model/Slide.ts';
import { emptySlideShow, SlideShow } from '../../model/SlideShow.ts';
import '../global-style.css';

export const Editor = (): ReactElement => {
    const [changeSet, setChangeSet] = useState<ChangeSet>(emptyChangeSet);
    const [editedSlideshow, setEditedSlideshow] = useState<SlideShow>(emptySlideShow());
    const [editedSlideId, setEditedSlideId] = useState<SlideId | null>(null);

    const onAddChange = useCallback((event: ChangeEvent) => {
        setChangeSet((prev) => addChange(prev, event));
    }, [setChangeSet]);
    const onUndoLastChange = useCallback(() => {
    }, [changeSet, setChangeSet]);
    const onRedoLastChange = useCallback(() => {
    }, [changeSet, setChangeSet]);

    useEffect(() => {
        const [nextSlideShow, nextEditedSlideId] = applyChanges(emptySlideShow(), null, changeSet);
        setEditedSlideshow(nextSlideShow);
        setEditedSlideId(nextEditedSlideId);
    }, [changeSet]);

    return (
        <div id="editor-page">
            {/* ══ TOP BAR ══ */}
            <TopBar
                editedSlideId={editedSlideId}
                editedSlideShow={editedSlideshow}
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
                    editedSlideShow={editedSlideshow}
                    changeSet={changeSet}
                    onAddChange={onAddChange}
                    onRedoLastChange={onRedoLastChange}
                    onUndoLastChange={onUndoLastChange}
                />

                {/* Slide Editor */}
                <SlideEditor
                    editedSlideId={editedSlideId}
                    editedSlideShow={editedSlideshow}
                    onAddChange={onAddChange}
                    changeSet={changeSet}
                    onRedoLastChange={onRedoLastChange}
                    onUndoLastChange={onUndoLastChange}
                />

            </div>

            {/* ══ BOTTOM BAR ══ */}
            <BottomBar
                editedSlideId={editedSlideId}
                editedSlideShow={editedSlideshow}
                onAddChange={onAddChange}
                changeSet={changeSet}
                onRedoLastChange={onRedoLastChange}
                onUndoLastChange={onUndoLastChange}
            />
        </div>
    );
};
