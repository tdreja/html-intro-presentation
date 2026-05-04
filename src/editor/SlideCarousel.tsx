import React, { ReactElement } from 'react';
import { Slide } from '../model/Presentation.ts';
import { LocalDateTime } from '@js-joda/core';
import { AddSlideEvent, ChangeEvent, RemoveSlideEvent, UpdateSelectedSlideEvent } from '../model/ChangeEvent.ts';
import { printLocalDateTime } from '../utils/DateTimeUtils.ts';

type Props = {
    slides: Array<Slide>,
    editedSlideIndex: LocalDateTime | null,
    onAddChange: (changeEvent: ChangeEvent) => void,
};

export const SlideCarousel = ({
    editedSlideIndex,
    slides,
    onAddChange,
}: Props): ReactElement => {
    return (
        <div className="editor-carousel-bar flex-shrink-0 border-top overflow-x-auto">
            <div className="editor-carousel d-flex gap-2 h-100 align-items-center">
                {slides.map((slide, index) => (
                    <div
                        key={printLocalDateTime(slide.id)}
                        className={`editor-thumb position-relative d-flex align-items-center justify-content-center overflow-hidden rounded-2${slide.id === editedSlideIndex ? ' editor-thumb--active' : ''}`}
                        onClick={() => onAddChange(new UpdateSelectedSlideEvent(slide.id))}
                        title={`Folie ${index + 1}`}
                    >
                        <div className="editor-thumb-number position-absolute font-monospace user-select-none pe-none">{index + 1}</div>
                        <div className="editor-thumb-preview w-100 h-100 overflow-hidden d-grid align-items-start">
                            <div
                                className="editor-thumb-inner"
                                dangerouslySetInnerHTML={{ __html: slide.content }}
                            />
                        </div>
                        <button
                            className="editor-thumb-remove position-absolute border-0 d-flex align-items-center justify-content-center p-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddChange(new RemoveSlideEvent(slide.id));
                            }}
                            title="Folie löschen"
                            disabled={slides.length <= 1}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                ))}
                <div
                    className="editor-thumb editor-thumb--add position-relative d-flex flex-column align-items-center justify-content-center overflow-hidden rounded-2"
                    onClick={() => onAddChange(new AddSlideEvent(''))}
                    title="Folie hinzufügen"
                >
                    <span className="material-symbols-outlined">add</span>
                </div>
            </div>
        </div>
    );
};
