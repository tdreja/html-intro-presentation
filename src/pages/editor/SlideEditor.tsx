import React, { ReactElement, useEffect, useState } from 'react';
import { EditorProps } from './EditorProps.ts';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { SlideId } from '../../model/Slide.ts';
import { UpdateSlideContentEvent } from '../../model/ChangeEvent.ts';

export const SlideEditor = ({ editedSlideShow, editedSlideId, onAddChange }: EditorProps): ReactElement => {
    const [slideId, setSlideId] = useState<SlideId | null>(editedSlideId);
    const [slideContent, setSlideContent] = useState<string>('');

    useEffect(() => {
        if (slideId !== editedSlideId) {
            setSlideId(editedSlideId);
            const editedSlide = editedSlideShow.slides.find((slide) => slide.id === editedSlideId);
            setSlideContent(editedSlide ? editedSlide.content.value : '');
        }
    }, [slideId, editedSlideId]);

    return (
        <div id="slide-editor-wrapper">
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
                    if (!slideId) {
                        return;
                    }
                    const slide = editedSlideShow.slides.find((slide) => slide.id === slideId);
                    if (slide && slide.content.value !== slideContent) {
                        onAddChange(new UpdateSlideContentEvent(slideId, slideContent));
                    }
                }}
            />
        </div>
    );
};
