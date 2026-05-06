import React, { ReactElement } from 'react';
import { EditorProps } from './EditorProps.ts';
import { Slide } from '../../model/Slide.ts';
import { DisplayHtml } from '../../component/DisplayHtml.tsx';
import { AddSlideEvent, ChangeEvent, RemoveSlideEvent, UpdateSelectedSlideEvent } from '../../model/ChangeEvent.ts';
import { Button, ButtonGroup, Dropdown, DropdownMenu } from 'react-bootstrap';

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
            onClick={(ev) => {
                ev.stopPropagation();
                onAddChange(new UpdateSelectedSlideEvent(slide.id));
            }}
        >
            <div className="thumb-preview">
                <DisplayHtml html={slide.content} />
            </div>
            <div className="thumb-footer">
                <span className="thumb-index">{index}</span>
                <button
                    className="btn btn-outline-danger btn-remove btn-sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddChange(new RemoveSlideEvent(slide.id));
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
                    key={slide.id}
                    slide={slide}
                    current={editedSlideId === slide.id}
                    index={index + 1}
                    onAddChange={onAddChange}
                />
            ))}

            <div id="carousel-actions">
                <Dropdown as={ButtonGroup}>
                    <Button
                        type="button"
                        variant="outline-success"
                        onClick={(ev) => {
                            ev.stopPropagation();
                            onAddChange(new AddSlideEvent());
                        }}
                    >
                        <span className="material-symbols-outlined">add</span>
                        Neue Slide
                    </Button>
                    <Dropdown.Toggle variant="outline-success"></Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>Test</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
};
