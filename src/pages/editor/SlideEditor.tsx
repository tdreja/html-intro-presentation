import React, { ReactElement, useEffect, useState } from 'react';
import { EditorProps } from './EditorProps.ts';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { SlideId } from '../../model/Slide.ts';
import { UpdateSlideContentEvent } from '../../model/ChangeEvent.ts';

export const SlideEditor = ({ editedSlideShow, editedSlideId, onAddChange }: EditorProps): ReactElement => {
    const [slideId, setSlideId] = useState<SlideId | null>(editedSlideId);
    const [slideIndex, setSlideIndex] = useState<number>(0);
    const [slideContent, setSlideContent] = useState<string>('');

    useEffect(() => {
        // No change here!
        if (slideId === editedSlideId) {
            return;
        }
        // Old content was changed?
        const oldSlide = editedSlideShow.slides.find((slide) => slide.id === slideId);
        if (slideId && oldSlide && oldSlide.content !== slideContent) {
            onAddChange(new UpdateSlideContentEvent(slideId, slideContent));
        }
        // Update current content
        setSlideId(editedSlideId);
        for (const [index, slide] of editedSlideShow.slides.entries()) {
            if (slide.id === editedSlideId) {
                setSlideIndex(index + 1);
                setSlideContent(slide.content);
                return;
            }
        }
        setSlideContent('');
    }, [editedSlideId]);

    return (
        <div id="slide-editor-wrapper">
            {slideIndex > 0 && (<h5>{`Slide ${slideIndex}`}</h5>)}
            <ReactQuill
                theme="snow"
                value={slideContent}
                onChange={setSlideContent}
                modules={{
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        ['image', 'code-block'],
                    ],
                }}
                onBlur={() => {
                    const slide = editedSlideShow.slides.find((slide) => slide.id === slideId);
                    if (slideId && slide && slide.content !== slideContent) {
                        onAddChange(new UpdateSlideContentEvent(slideId, slideContent));
                    }
                }}
            />
        </div>
    );
};
