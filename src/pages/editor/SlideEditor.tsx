import React, { Dispatch, ReactElement, SetStateAction, useEffect, useRef } from 'react';
import { EditorProps } from './EditorProps.ts';
import { useI18N } from '../../i18n/I18NContext.tsx';
import { createEditor, NotectlEditor } from '@notectl/core';

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

    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<NotectlEditor | null>(null);

    useEffect(() => {
        let mounted = true;

        createEditor({
            placeholder: 'Start typing...',
            autofocus: true,
        }).then((editor) => {
            if (!mounted || !containerRef.current) {
                return;
            }
            containerRef.current.appendChild(editor);
            editorRef.current = editor;
            editor.on('stateChange', () => {
                editor.getContentHTML().then((html) => {
                    setEditedSlideContent(html);
                });
            });
        });

        return () => {
            mounted = false;
            void editorRef.current?.destroy();
        };
    }, []);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.setContentHTML(editedSlideContent)
                .then(() => {});
        }
    }, [editorRef, editedSlideId]);

    return (<div ref={containerRef} />);
};
