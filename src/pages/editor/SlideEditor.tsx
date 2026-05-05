import React, { ReactElement } from 'react';
import { EditorProps } from './EditorProps.ts';

export const SlideEditor = ({}: EditorProps): ReactElement => {
    return (
        <div id="slide-editor">
            <label htmlFor="slide-content">Slide 1 – Inhalt</label>
            <div id="slide-16-9-wrap">
                <textarea id="slide-content" className="form-control" placeholder="Slide-Inhalt hier eingeben…&#10;&#10;Unterstützt Markdown, HTML oder Plain Text."></textarea>
            </div>
        </div>
    );
};
