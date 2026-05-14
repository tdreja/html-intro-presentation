import React, { ReactElement, useCallback } from 'react';
import { EditorProps } from './EditorProps.ts';
import { useI18N } from '../../i18n/I18NContext.tsx';
import { importFileList } from '../../utils/FileListLoader.ts';
import { alterHtml, openCurrentDocument } from '../../utils/HtmlExporter.ts';
import { stringify } from 'yaml';
import { toYaml } from '../../model/YamlModel.ts';
import { Button } from 'react-bootstrap';

function downloadHtmlFile(yaml: string, fileName: string) {
    const href = document.createElement('a');
    href.download = fileName;
    href.href = URL.createObjectURL(new Blob([yaml], { type: 'text/html' }));
    href.click();
}

export const TopBar = ({ onChangeEditedSlideId }: EditorProps): ReactElement => {
    const i18n = useI18N();

    const onExportSlideshow = useCallback(() => {
        const slideshow = onChangeEditedSlideId(null);
        const yaml = stringify(toYaml(slideshow));
        const newHtml = alterHtml(openCurrentDocument(), yaml);
        downloadHtmlFile(newHtml, 'slideshow.html');
    }, [onChangeEditedSlideId]);

    const onUploadFile = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawData = importFileList(event.target.files);
    }, []);

    const onDropFile = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const rawData = importFileList(event.dataTransfer.files);
    }, []);

    return (
        <div id="top-bar">
            <span className="fw-semibold me-2" style={{ fontSize: '1.1rem' }}>
                <span className="material-symbols-outlined">slideshow</span>
                {i18n.editor.titleSlideshowEditor}
            </span>

            <div
                className="row"
            >
                <label
                    htmlFor="uploadHtmlFile"
                    className="form-label"
                >
                    Temp
                </label>
                <input
                    type="file"
                    className="form-control"
                    id="uploadHtmlFile"
                    onChange={onUploadFile}
                    onDrop={onDropFile}
                    accept="text/html,.html"
                    placeholder="Quiz Datei ablegen"
                />
            </div>

            <Button onClick={onExportSlideshow} variant="outline-primary">
                <span className="material-symbols-outlined">download</span>
                {i18n.editor.btnExportSlideshow}
            </Button>
        </div>
    );
};
