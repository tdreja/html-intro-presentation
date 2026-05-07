import React, { Dispatch, ReactElement, SetStateAction } from 'react';
import { EditorProps } from './EditorProps.ts';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useI18N } from '../../i18n/I18NContext.tsx';

type SlideEditorProps = EditorProps & {
    setEditedSlideContent: Dispatch<SetStateAction<string>>,
};

export const SlideEditor = ({
    editedSlideshow,
    editedSlideId,
    editedSlideContent,
    setEditedSlideContent,
}: SlideEditorProps): ReactElement => {
    const i18n = useI18N();
    const slideIndex
        = (editedSlideId && editedSlideshow.slides.findIndex((s) => s.id === editedSlideId) + 1) || 0;
    return (
        <div id="slide-editor-wrapper">
            {slideIndex > 0 && (
                <h6>{`${i18n.editor.titleSlide} ${slideIndex}`}</h6>
            )}
            <ReactQuill
                theme="snow"
                value={editedSlideContent}
                onChange={setEditedSlideContent}
                modules={{
                    toolbar: [
                        [{ header: 1 }, { header: 2 }, { header: 3 }],
                        ['bold', 'italic', 'underline'],
                        [{ align: [] }],
                        ['image'],
                        ['clean'],
                    ],
                }}
            />
        </div>
    );
};
