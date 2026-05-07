import React, { Dispatch, ReactElement, SetStateAction } from 'react';
import { EditorProps } from './EditorProps.ts';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useI18N } from '../../i18n/I18NContext.tsx';

type SlideEditorProps = EditorProps & {
    setEditedSlideContent: Dispatch<SetStateAction<string>>,
};

export const SlideEditor = ({
    editedSlideContent,
    setEditedSlideContent,
}: SlideEditorProps): ReactElement => {
    const i18n = useI18N();
    return (
        <div id="slide-editor-wrapper">
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
