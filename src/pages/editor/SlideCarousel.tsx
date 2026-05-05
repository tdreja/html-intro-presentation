import React, { ReactElement } from 'react';
import { EditorProps } from './EditorProps.ts';
import { Slide } from '../../model/Slide.ts';
import { DisplayHtml } from '../../component/DisplayHtml.tsx';
import { get, isEqual } from '../../model/TypeContainer.ts';
import { AddSlideEvent, ChangeEvent, RemoveSlideEvent, UpdateSelectedSlideEvent } from '../../model/ChangeEvent.ts';

type SlideProps = {
    slide: Slide,
    current: boolean,
    index: number,
    onAddChange: (ev: ChangeEvent) => void,
};

const SlidePreview = ({ slide, current, index, onAddChange }: SlideProps): ReactElement => {
    return (
        <div
            className={`slide-thumb ${current ? 'active' : ''}`}
            onClick={() => onAddChange(new UpdateSelectedSlideEvent(slide.id))}
        >
            <div className="thumb-preview">
                <DisplayHtml html={slide.content} />
            </div>
            <div className="thumb-footer">
                <span className="thumb-index">{index}</span>
                <button
                    className="btn btn-outline-danger btn-remove btn-sm"
                    onClick={(e) => {
                        onAddChange(new RemoveSlideEvent(slide.id));
                        e.stopPropagation();
                    }}
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
};

export const SlideCarousel = ({ editedSlideShow, editedSlideId, onAddChange }: EditorProps): ReactElement => {
    return (
        <div id="slide-carousel">
            <h6>Slides</h6>

            {editedSlideShow.slides.map((slide, index) => (
                <SlidePreview
                    key={get(slide.id)}
                    slide={slide}
                    current={isEqual(slide.id, editedSlideId)}
                    index={index + 1}
                    onAddChange={onAddChange}
                />
            ))}

            <div id="carousel-actions">
                <button
                    className="btn btn-outline-success btn-add"
                    onClick={() => onAddChange(new AddSlideEvent())}
                >
                    <span className="material-symbols-outlined">add</span>
                    Neue Slide
                </button>
            </div>
        </div>
    );
};
