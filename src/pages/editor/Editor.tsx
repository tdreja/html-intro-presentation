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
import { RouteContext } from '../../component/RouteContext.ts';
import { checkForSlideContentChanges } from './EditorOperation.ts';
import { emptyHtmlParagraph } from '../../model/Html.ts';

export const Editor = (): ReactElement => {
    // Attach to the overall UI
    const [slideshow, setSlideshow] = useContext(SlideshowContext);
    const [_, setRoute] = useContext(RouteContext);

    // Hold the edited changes as internal state!
    const [changeSet, setChangeSet] = useState<ChangeSet>(emptyChangeSet);
    const [editedSlideshow, setEditedSlideshow] = useState<Slideshow>(slideshow);
    const [editedSlideId, setEditedSlideId] = useState<SlideId | null>(null);
    const [editedSlideContent, setEditedSlideContent] = useState<string>(emptyHtmlParagraph);

    // Checks if we need to save the current slide content, before we move to another slide!
    const onCheckSlideContent = useCallback((moveToSlide?: SlideId | null) => {
        return checkForSlideContentChanges(editedSlideshow, editedSlideId, editedSlideContent, moveToSlide);
    }, [editedSlideshow, editedSlideId, editedSlideContent]);

    // Applies the finalized changeset to the slideshow and shows these to the user!
    const onApplyChanges = useCallback((
        newChangeSet: ChangeSet,
        moveToSlide: SlideId | null,
    ) => {
        const newSlideshow = applyChanges(slideshow, newChangeSet);
        setEditedSlideshow(newSlideshow);
        setChangeSet(newChangeSet);

        // Ensure that we either move to a valid slide or reset the editor!
        const idToMoveTo: SlideId | null = moveToSlide || editedSlideId;
        const slideToMoveTo = newSlideshow.slides.find((slide) => slide.id === idToMoveTo);
        if (slideToMoveTo) {
            setEditedSlideId(idToMoveTo);
            setEditedSlideContent(slideToMoveTo.content);
        } else {
            setEditedSlideId(null);
            setEditedSlideContent(emptyHtmlParagraph);
        }
    }, [setChangeSet, slideshow, setEditedSlideshow, editedSlideId, setEditedSlideId, setEditedSlideContent]);

    // Adds another event to the changeset
    const onAddChange = useCallback((event: ChangeEvent) => {
        const check = onCheckSlideContent(event.moveToSlide);
        let newChangeSet: ChangeSet = changeSet;
        if (check.prependChange) {
            newChangeSet = addChange(newChangeSet, check.prependChange);
        }
        newChangeSet = addChange(newChangeSet, event);
        if (check.appendChange) {
            newChangeSet = addChange(newChangeSet, check.appendChange);
        }
        onApplyChanges(newChangeSet, event.moveToSlide);
    }, [changeSet, onApplyChanges, onCheckSlideContent]);

    // Undos the last change, if possible!
    const onUndoLastChange = useCallback(() => {
        const check = onCheckSlideContent(null);
        let newChangeSet: ChangeSet = changeSet;
        if (check.prependChange) {
            newChangeSet = addChange(newChangeSet, check.prependChange);
        } else if (check.appendChange) {
            newChangeSet = addChange(newChangeSet, check.appendChange);
        }
        onApplyChanges(revertLastChange(newChangeSet), null);
    }, [changeSet, onApplyChanges]);

    // Redos the last change, if possible!
    const onRedoLastChange = useCallback(() => {
        onApplyChanges(redoLastChange(changeSet), null);
    }, [changeSet, onApplyChanges]);

    // Moves to another slide for editing
    const onChangeEditedSlideId = useCallback((slideId: SlideId | null) => {
        const check = onCheckSlideContent(slideId);
        let newChangeSet: ChangeSet = changeSet;
        if (check.prependChange) {
            newChangeSet = addChange(newChangeSet, check.prependChange);
        } else if (check.appendChange) {
            newChangeSet = addChange(newChangeSet, check.appendChange);
        }
        onApplyChanges(newChangeSet, slideId);
    }, [changeSet, editedSlideId, setEditedSlideId, onCheckSlideContent, onApplyChanges]);

    const onStartSlideshow = () => {};

    // Reset the editor, if the slideshow was changed!
    useEffect(() => {
        setEditedSlideshow(slideshow);
        setEditedSlideId(null);
        setChangeSet(emptyChangeSet);
        setEditedSlideContent('');
    }, [slideshow]);

    return (
        <div id="editor-page">
            {/* ══ TOP BAR ══ */}
            <TopBar
                editedSlideId={editedSlideId}
                editedSlideshow={editedSlideshow}
                editedSlideContent={editedSlideContent}
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
                    editedSlideContent={editedSlideContent}
                    changeSet={changeSet}
                    onAddChange={onAddChange}
                    onRedoLastChange={onRedoLastChange}
                    onUndoLastChange={onUndoLastChange}
                    onChangeEditedSlideId={onChangeEditedSlideId}
                />

                {/* Slide Editor */}
                <SlideEditor
                    editedSlideId={editedSlideId}
                    editedSlideshow={editedSlideshow}
                    editedSlideContent={editedSlideContent}
                    setEditedSlideContent={setEditedSlideContent}
                    changeSet={changeSet}
                    onAddChange={onAddChange}
                    onRedoLastChange={onRedoLastChange}
                    onUndoLastChange={onUndoLastChange}
                />

            </div>

            {/* ══ BOTTOM BAR ══ */}
            <BottomBar
                editedSlideId={editedSlideId}
                editedSlideshow={editedSlideshow}
                editedSlideContent={editedSlideContent}
                onAddChange={onAddChange}
                changeSet={changeSet}
                onRedoLastChange={onRedoLastChange}
                onUndoLastChange={onUndoLastChange}
                onStartSlideshow={onStartSlideshow}
            />
        </div>
    );
};
