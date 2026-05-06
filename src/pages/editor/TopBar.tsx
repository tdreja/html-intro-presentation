import React, { ReactElement } from 'react';
import { EditorProps } from './EditorProps.ts';
import { useI18N } from '../../i18n/I18NContext.tsx';

export const TopBar = ({ }: EditorProps): ReactElement => {
    const i18n = useI18N();
    return (
        <div id="top-bar">
            <span className="fw-semibold me-2" style={{ fontSize: '1.1rem' }}>
                <span className="material-symbols-outlined">slideshow</span>
                {i18n.editor.titleSlideshowEditor}
            </span>

            <button className="btn btn-primary">
                <span className="material-symbols-outlined">download</span>
                {i18n.editor.btnDownloadSlideshow}
            </button>

            <div className="upload-group">
                <div className="drop-zone">
                    <span className="material-symbols-outlined">upload</span>
                    {i18n.editor.titleUploadSlideshow}
                </div>
                <button className="btn btn-outline-primary btn-sm w-100">
                    <span className="material-symbols-outlined">folder_open</span>
                    {i18n.editor.btnUploadSlideshow}
                </button>
            </div>

            <div className="upload-group">
                <div className="drop-zone">
                    <span className="material-symbols-outlined">image</span>
                    {i18n.editor.titleUploadImagesAsSlides}
                </div>
                <button className="btn btn-outline-primary btn-sm w-100">
                    <span className="material-symbols-outlined">folder_open</span>
                    {i18n.editor.btnUploadImagesAsSlides}
                </button>
            </div>
        </div>
    );
};
