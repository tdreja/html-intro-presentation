import React, { ReactElement } from 'react';
import { EditorProps } from './EditorProps.ts';

export const TopBar = ({ }: EditorProps): ReactElement => {
    return (
        <div id="top-bar">
            <span className="fw-semibold me-2" style={{ fontSize: '1.1rem' }}>
                <span className="material-symbols-outlined">slideshow</span>
                Slideshow Editor
            </span>

            <button className="btn btn-primary">
                <span className="material-symbols-outlined">download</span>
                Download Slideshow
            </button>

            <div className="upload-group">
                <div className="drop-zone">
                    <span className="material-symbols-outlined">upload</span>
                    Upload Slideshow
                    <small>(Drag &amp; Drop)</small>
                </div>
                <button className="btn btn-outline-primary btn-sm w-100">
                    <span className="material-symbols-outlined">folder_open</span>
                    Datei auswählen
                </button>
            </div>

            <div className="upload-group">
                <div className="drop-zone">
                    <span className="material-symbols-outlined">image</span>
                    Upload Images as Slides
                    <small>(Drag &amp; Drop)</small>
                </div>
                <button className="btn btn-outline-primary btn-sm w-100">
                    <span className="material-symbols-outlined">folder_open</span>
                    Bilder auswählen
                </button>
            </div>
        </div>
    );
};
