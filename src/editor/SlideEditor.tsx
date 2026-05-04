import React, { ReactElement, useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { Slide } from '../model/Presentation.ts';
import { ChangeEvent, UpdateSlideContentEvent } from '../model/ChangeEvent.ts';

type Props = {
    editedSlide?: Slide | null,
    onAddChange: (changeEvent: ChangeEvent) => void,
};

export const SlideEditor = ({
    editedSlide,
    onAddChange,
}: Props): ReactElement => {
    const [content, setContent] = useState<string>('');
    useEffect(() => {
        if (editedSlide) {
            setContent(editedSlide.content);
        }
    }, [editedSlide]);
    return (
        <div className="editor-preview-area flex-grow-1 d-flex align-items-stretch justify-content-center p-3 overflow-hidden">
            {editedSlide
                ? (
                    <div className="editor-quill-wrapper d-flex flex-column w-100 h-100">
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            onBlur={() => {
                                if (content !== editedSlide.content) {
                                    onAddChange(new UpdateSlideContentEvent(editedSlide.id, content));
                                }
                            }}
                            modules={{
                                toolbar: [
                                    [{ header: [1, 2, false] }],
                                    ['bold', 'italic', 'underline'],
                                    ['image', 'code-block'],
                                ],
                            }}
                        />
                    </div>
                )
                : (
                    <div className="editor-preview-empty text-center">Keine Folie ausgewählt</div>
                )}
        </div>
    );
};
