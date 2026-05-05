import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import './editor-style.css';
import 'material-symbols';
import { TopBar } from './TopBar.tsx';
import { addChange, applyChanges, ChangeEvent, ChangeSet, emptyChangeSet } from '../../model/ChangeEvent.ts';
import { SlideCarousell } from './SlideCarousell.tsx';
import { SlideEditor } from './SlideEditor.tsx';
import { BottomBar } from './BottomBar.tsx';
import { SlideId } from '../../model/Slide.ts';
import { emptySlideShow, SlideShow } from '../../model/SlideShow.ts';
import { isEqual } from '../../model/TypeContainer.ts';

export const Editor = (): ReactElement => {
    const [changeSet, setChangeSet] = useState<ChangeSet>(emptyChangeSet);
    const [editedSlideshow, setEditedSlideshow] = useState<SlideShow>(emptySlideShow());
    const [editedSlideId, setEditedSlideId] = useState<SlideId | null>(null);
    const editedSlide = editedSlideshow.slides.find((slide) => isEqual(slide.id, editedSlideId));

    const onAddChange = useCallback((event: ChangeEvent) => {
        setChangeSet((prev) => addChange(prev, event));
    }, [setChangeSet]);
    const onUndoLastChange = useCallback(() => {
    }, [changeSet, setChangeSet]);
    const onRedoLastChange = useCallback(() => {
    }, [changeSet, setChangeSet]);

    useEffect(() => {
        const [nextSlideShow, nextEditedSlideId] = applyChanges(editedSlideshow, editedSlideId, changeSet);
        setEditedSlideshow(nextSlideShow);
        setEditedSlideId(nextEditedSlideId);
    }, [changeSet]);

    return (
        <div id="editor-page">
            {/* ══ TOP BAR ══ */}
            <TopBar
                editedSlide={editedSlide}
                editedSlideShow={editedSlideshow}
                changeSet={changeSet}
                onAddChange={onAddChange}
                onRedoLastChange={onRedoLastChange}
                onUndoLastChange={onUndoLastChange}
            />

            {/* ══ EDITOR AREA ══ */}
            <div id="editor-area">

                {/* Slide Carousel */}
                <SlideCarousell
                    editedSlide={editedSlide}
                    editedSlideShow={editedSlideshow}
                    changeSet={changeSet}
                    onAddChange={onAddChange}
                    onRedoLastChange={onRedoLastChange}
                    onUndoLastChange={onUndoLastChange}
                />

                {/* Slide Editor */}
                <SlideEditor
                    editedSlide={editedSlide}
                    editedSlideShow={editedSlideshow}
                    onAddChange={onAddChange}
                    changeSet={changeSet}
                    onRedoLastChange={onRedoLastChange}
                    onUndoLastChange={onUndoLastChange}
                />

            </div>

            {/* ══ BOTTOM BAR ══ */}
            <BottomBar
                editedSlide={editedSlide}
                editedSlideShow={editedSlideshow}
                onAddChange={onAddChange}
                changeSet={changeSet}
                onRedoLastChange={onRedoLastChange}
                onUndoLastChange={onUndoLastChange}
            />
        </div>
    );
};
