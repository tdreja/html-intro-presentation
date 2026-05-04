import React, { useCallback, useContext, useEffect, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { ActivePresentationContext } from '../model/ActivePresentationContext.ts';
import './editor.css';
import {
    addChange,
    applyChanges,
    ChangeEvent,
    ChangeSet,
    emptyChangeSet, redoLastChange,
    revertLastChange,
} from '../model/ChangeEvent.ts';
import { SlideEditor } from './SlideEditor.tsx';
import { TargetTimeEditor } from './TargetTimeEditor.tsx';
import { LocalDateTime } from '@js-joda/core';
import { SlideCarousel } from './SlideCarousel.tsx';

export function Editor() {
    // Presentation currently shown to the user
    const activePresentation = useContext(ActivePresentationContext);
    // Presentation currently being edited
    const [editedPresentation, setEditedPresentation] = useState(activePresentation.presentation);
    // Changes that made the active presentation to the edited presentation
    const [changes, setChanges] = useState<ChangeSet>(emptyChangeSet);
    // Currenly edited slide
    const [editedSlideIndex, setEditedSlideIndex] = useState<LocalDateTime | null>(null);
    const editedSlide = editedSlideIndex !== null
        ? editedPresentation.slides.find((slide) => slide.id === editedSlideIndex)
        : null;
    // Is the selected date past already?
    const isPast = LocalDateTime.now().isAfter(editedPresentation.target);

    // Add a new change to the pipeline
    const onAddChange = useCallback((change: ChangeEvent) => {
        setChanges((prev) => addChange(prev, change));
    }, [setChanges]);

    const onRevertLastChange = useCallback(() => {
        setChanges((prev) => revertLastChange(prev));
    }, [setChanges]);

    const onRedoLastChange = useCallback(() => {
        setChanges((prev) => redoLastChange(prev));
    }, [setChanges]);

    // Reset changes when the main presentation is updated!
    useEffect(() => {
        setChanges(emptyChangeSet);
    }, [activePresentation]);

    // Update the edited presentation whenever changes are made
    useEffect(() => {
        const [nextPresentation, nextEditedSlide] = applyChanges(
            activePresentation.presentation,
            editedSlideIndex,
            changes,
        );
        setEditedPresentation(nextPresentation);
        setEditedSlideIndex(nextEditedSlide);
    }, [changes]);

    return (
        <div className="editor-layout d-flex flex-column vw-100 vh-100 overflow-hidden">
            {/* Header */}
            <div className="editor-header d-flex align-items-center justify-content-between flex-shrink-0 border-bottom gap-3">
                <a
                    href={isPast ? undefined : '#'}
                    aria-disabled={isPast}
                    className={`editor-nav-link d-flex align-items-center gap-1 text-decoration-none${isPast ? ' disabled text-muted pe-none' : ''}`}
                    onClick={() => {
                        if (!isPast) {
                            activePresentation.updatePresentation(editedPresentation);
                        }
                    }}
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Zurück zur Präsentation
                </a>
                <span className="editor-title font-monospace fw-bold">Editor</span>
                <span className="editor-slide-info font-monospace small">
                    {editedPresentation.slides.length}
                </span>
            </div>

            {/* Quill Editor */}
            <SlideEditor
                editedSlide={editedSlide}
                onAddChange={onAddChange}
            />

            {/* Target Date & Time */}
            <TargetTimeEditor
                targetTime={editedPresentation.target}
                onAddChange={onAddChange}
            />

            {/* Carousel */}
            <SlideCarousel
                slides={editedPresentation.slides}
                editedSlideIndex={editedSlideIndex}
                onAddChange={onAddChange}
            />
        </div>
    );
}
