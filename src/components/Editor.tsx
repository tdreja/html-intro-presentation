import React, { useCallback, useContext, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { PresentationContext, PresentationEditorContext } from '../model/PresentationContext.ts';
import './presentation.css';

function toDateTimeLocal(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function Editor() {
    const presentation = useContext(PresentationContext);
    const setPresentation = useContext(PresentationEditorContext);
    const { slides, target } = presentation;
    const isPast = target.getTime() <= Date.now();

    const [selectedIndex, setSelectedIndex] = useState(0);
    const currentSlide = slides[selectedIndex] ?? null;

    const updateTarget = useCallback((value: string) => {
        const parsed = new Date(value);
        if (!isNaN(parsed.getTime())) {
            setPresentation({ ...presentation, target: parsed });
        }
    }, [presentation, setPresentation]);

    const addSlide = useCallback(() => {
        const newSlides = [...slides, { content: '<h1>Neue Folie</h1><p>Inhalt hier...</p>' }];
        setPresentation({ ...presentation, slides: newSlides });
        setSelectedIndex(newSlides.length - 1);
    }, [presentation, slides, setPresentation]);

    const removeSlide = useCallback((index: number) => {
        if (slides.length <= 1) return;
        const newSlides = slides.filter((_, i) => i !== index);
        setPresentation({ ...presentation, slides: newSlides });
        setSelectedIndex(Math.min(selectedIndex, newSlides.length - 1));
    }, [presentation, slides, selectedIndex, setPresentation]);

    const updateCurrentSlide = useCallback((content: string) => {
        const newSlides = slides.map((slide, i) =>
            i === selectedIndex ? { ...slide, content } : slide);
        setPresentation({ ...presentation, slides: newSlides });
    }, [presentation, slides, selectedIndex, setPresentation]);

    return (
        <div className="editor-layout d-flex flex-column vw-100 vh-100 overflow-hidden">
            {/* Header */}
            <div className="editor-header d-flex align-items-center justify-content-between flex-shrink-0 border-bottom gap-3">
                <a
                    href={isPast ? undefined : '#'}
                    aria-disabled={isPast}
                    className={`editor-nav-link d-flex align-items-center gap-1 text-decoration-none${isPast ? ' disabled text-muted pe-none' : ''}`}
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Zurück zur Präsentation
                </a>
                <span className="editor-title font-monospace fw-bold">Editor</span>
                <span className="editor-slide-info font-monospace small">
                    {'Folie '}
                    {selectedIndex + 1}
                    {' / '}
                    {slides.length}
                </span>
            </div>

            {/* Quill Editor */}
            <div className="editor-preview-area flex-grow-1 d-flex align-items-stretch justify-content-center p-3 overflow-hidden">
                {currentSlide
                    ? (
                        <div className="editor-quill-wrapper d-flex flex-column w-100 h-100">
                            <ReactQuill
                                theme="snow"
                                value={currentSlide.content}
                                onChange={updateCurrentSlide}
                            />
                        </div>
                    )
                    : (
                        <div className="editor-preview-empty text-center">Keine Folie ausgewählt</div>
                    )}
            </div>

            {/* Target Date & Time */}
            <div className="editor-target-bar flex-shrink-0 border-top d-flex align-items-center gap-3 px-4 py-2">
                <label htmlFor="target-datetime" className="form-label mb-0 fw-semibold text-nowrap">
                    <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1.1rem' }}>event</span>
                    Präsentation endet am
                </label>
                <input
                    id="target-datetime"
                    type="datetime-local"
                    className="form-control form-control-sm w-auto"
                    value={toDateTimeLocal(target)}
                    onChange={(e) => updateTarget(e.target.value)}
                />
            </div>

            {/* Carousel */}
            <div className="editor-carousel-bar flex-shrink-0 border-top overflow-x-auto">
                <div className="editor-carousel d-flex gap-2 h-100 align-items-center">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`editor-thumb position-relative d-flex align-items-center justify-content-center overflow-hidden rounded-2${index === selectedIndex ? ' editor-thumb--active' : ''}`}
                            onClick={() => setSelectedIndex(index)}
                            title={`Folie ${index + 1}`}
                        >
                            <div className="editor-thumb-number position-absolute font-monospace user-select-none pe-none">{index + 1}</div>
                            <div className="editor-thumb-preview w-100 h-100 overflow-hidden d-flex align-items-start">
                                <div
                                    className="editor-thumb-inner"
                                    dangerouslySetInnerHTML={{ __html: slide.content }}
                                />
                            </div>
                            <button
                                className="editor-thumb-remove position-absolute border-0 d-flex align-items-center justify-content-center p-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeSlide(index);
                                }}
                                title="Folie löschen"
                                disabled={slides.length <= 1}
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    ))}
                    <div className="editor-thumb editor-thumb--add position-relative d-flex flex-column align-items-center justify-content-center overflow-hidden rounded-2" onClick={addSlide} title="Folie hinzufügen">
                        <span className="material-symbols-outlined">add</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
