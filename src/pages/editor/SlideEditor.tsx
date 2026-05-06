import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { EditorProps } from './EditorProps.ts';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { SlideId } from '../../model/Slide.ts';
import { UpdateSlideContentEvent } from '../../model/ChangeEvent.ts';
import { updateSlideContent } from './UpdateSlideContent.ts';

export const SlideEditor = ({ editedSlideShow, editedSlideId, onAddChange }: EditorProps): ReactElement => {
    const [slideId, setSlideId] = useState<SlideId | null>(editedSlideId);
    const [slideIndex, setSlideIndex] = useState<number>(0);
    const [slideContent, setSlideContent] = useState<string>('');

    useEffect(() => {
        const update
            = updateSlideContent(editedSlideShow, editedSlideId, onAddChange, slideId, slideContent);
        // No change here!
        if (!update) {
            return;
        }
        // Forward the changes to the editor
        const [newContent, newId, newIndex] = update;
        setSlideId(newId);
        setSlideIndex(newIndex);
        setSlideContent(newContent);
    }, [editedSlideId]);

    const onBlur = useCallback(() => {
        const slide = editedSlideShow.slides.find((slide) => slide.id === slideId);
        if (slideId && slide && slide.content !== slideContent) {
            onAddChange(new UpdateSlideContentEvent(slideId, slideContent));
        }
    }, [slideId, slideContent, editedSlideShow]);

    return (
        <div id="slide-editor-wrapper">
            {slideIndex > 0 && (
                <h6 className="align-self-start">{`Slide ${slideIndex}`}</h6>
            )}
            <ReactQuill
                theme="snow"
                value={slideContent}
                onChange={setSlideContent}
                modules={{
                    toolbar: [
                        [{ header: 1 }, { header: 2 }, { header: 3 }],
                        ['bold', 'italic', 'underline'],
                        [{ align: [] }],
                        ['image'],
                        ['clean'],
                    ],
                }}
                onBlur={onBlur}
            />
        </div>
    );
};
