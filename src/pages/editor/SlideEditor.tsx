import React, { Dispatch, ReactElement, SetStateAction, useCallback } from 'react';
import { EditorProps } from './EditorProps.ts';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { UpdateSlideContentEvent } from '../../model/ChangeEvent.ts';
import { useI18N } from '../../i18n/I18NContext.tsx';

type SlideEditorProps = EditorProps & {
    slideContent: string,
    setSlideContent: Dispatch<SetStateAction<string>>,
};

export const SlideEditor = ({
    editedSlideshow,
    editedSlideId,
    onAddChange,
    slideContent,
    setSlideContent,
}: SlideEditorProps): ReactElement => {
    const i18n = useI18N();

    const onBlur = useCallback(() => {
        const slide = editedSlideshow.slides.find((slide) => slide.id === editedSlideId);
        if (editedSlideId && slide && slide.content !== slideContent) {
            onAddChange(new UpdateSlideContentEvent(editedSlideId, slideContent));
        }
    }, [editedSlideId, slideContent, editedSlideshow]);

    return (
        <div id="slide-editor-wrapper">
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
