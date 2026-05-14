import React, { ReactElement, useCallback } from 'react';
import { EditorProps } from './EditorProps.ts';
import { useI18N } from '../../i18n/I18NContext.tsx';
import { importFileList } from '../../utils/FileListLoader.ts';
import { alterHtml } from '../../utils/HtmlExporter.ts';
import { stringify } from 'yaml';
import { toYaml } from '../../model/YamlModel.ts';

function downloadYaml(yaml: string, fileName: string) {
    const href = document.createElement('a');
    href.download = fileName;
    href.href = URL.createObjectURL(new Blob([yaml], { type: 'text/html' }));
    href.click();
}

export const TopBar = ({ onChangeEditedSlideId }: EditorProps): ReactElement => {
    const i18n = useI18N();

    const onRecreateSlideshowFile = useCallback((html: string) => {
        const slideshow = onChangeEditedSlideId(null);
        const newHtml = alterHtml(html, stringify(toYaml(slideshow)));
        downloadYaml(newHtml, 'slideshow.html');
    }, [onChangeEditedSlideId]);

    const onUploadFile = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawData = importFileList(event.target.files);
        onRecreateSlideshowFile(await rawData);
    }, [onRecreateSlideshowFile]);

    const onDropFile = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const rawData = importFileList(event.dataTransfer.files);
        onRecreateSlideshowFile(await rawData);
    }, [onRecreateSlideshowFile]);

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
                    {i18n.editor.titleExportSlideshow}
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
        </div>
    );
};
