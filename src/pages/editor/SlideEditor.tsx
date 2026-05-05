import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { EditorProps } from './EditorProps.ts';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { SlideId } from '../../model/Slide.ts';
import { UpdateSlideContentEvent } from '../../model/ChangeEvent.ts';

const quillModules = {
    toolbar: {
        container: '#quill-toolbar',
    },
};

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

    const onBlur = useCallback(() => {
        const slide = editedSlideShow.slides.find((slide) => slide.id === slideId);
        if (slideId && slide && slide.content !== slideContent) {
            onAddChange(new UpdateSlideContentEvent(slideId, slideContent));
        }
    }, [slideId, slideContent, editedSlideShow]);

    return (
        <div id="slide-editor-wrapper">
            {slideIndex > 0 && (<h5>{`Slide ${slideIndex}`}</h5>)}
            <div id="quill-toolbar">
                <button className="ql-header" value="1" />
                <button className="ql-header" value="2" />
                <button className="ql-header" value="3" />
                <button className="ql-bold" />
                <button className="ql-italic" />
                <button className="ql-underline" />
                <button className="ql-list" value="ordered" />
                <button className="ql-list" value="bullet" />
                <button className="ql-image" />
            </div>
            <ReactQuill
                theme="snow"
                value={slideContent}
                onChange={setSlideContent}
                modules={quillModules}
                onBlur={onBlur}
            />
        </div>
    );
};
