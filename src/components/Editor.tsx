import React, { useContext, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { PresentationContext, PresentationEditorContext } from '../model/PresentationContext.ts';
import './presentation.css';

export function Editor() {
    const presentation = useContext(PresentationContext);
    const setPresentation = useContext(PresentationEditorContext);
    const { slides } = presentation;

    const [selectedIndex, setSelectedIndex] = useState(0);
    const currentSlide = slides[selectedIndex] ?? null;

    function addSlide() {
        const newSlides = [...slides, { content: '<h1>Neue Folie</h1><p>Inhalt hier...</p>' }];
        setPresentation({ ...presentation, slides: newSlides });
        setSelectedIndex(newSlides.length - 1);
    }

    function removeSlide(index: number) {
        if (slides.length <= 1) return;
        const newSlides = slides.filter((_, i) => i !== index);
        setPresentation({ ...presentation, slides: newSlides });
        setSelectedIndex(Math.min(selectedIndex, newSlides.length - 1));
    }

    function updateCurrentSlide(content: string) {
        const newSlides = slides.map((slide, i) =>
            i === selectedIndex ? { ...slide, content } : slide);
        setPresentation({ ...presentation, slides: newSlides });
    }

    return (
        <div className="editor-layout">
            {/* Header */}
            <div className="editor-header">
                <a href="#" className="editor-nav-link">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Zurück zur Präsentation
                </a>
                <span className="editor-title">Editor</span>
                <span className="editor-slide-info">
                    {'Folie '}
                    {selectedIndex + 1}
                    {' / '}
                    {slides.length}
                </span>
            </div>

            {/* Quill Editor */}
            <div className="editor-preview-area">
                {currentSlide
                    ? (
                        <div className="editor-quill-wrapper">
                            <ReactQuill
                                theme="snow"
                                value={currentSlide.content}
                                onChange={updateCurrentSlide}
                            />
                        </div>
                    )
                    : (
                        <div className="editor-preview-empty">Keine Folie ausgewählt</div>
                    )}
            </div>

            {/* Carousel */}
            <div className="editor-carousel-bar">
                <div className="editor-carousel">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`editor-thumb${index === selectedIndex ? ' editor-thumb--active' : ''}`}
                            onClick={() => setSelectedIndex(index)}
                            title={`Folie ${index + 1}`}
                        >
                            <div className="editor-thumb-number">{index + 1}</div>
                            <div className="editor-thumb-preview">
                                <div
                                    className="editor-thumb-inner"
                                    dangerouslySetInnerHTML={{ __html: slide.content }}
                                />
                            </div>
                            <button
                                className="editor-thumb-remove"
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
                    <div className="editor-thumb editor-thumb--add" onClick={addSlide} title="Folie hinzufügen">
                        <span className="material-symbols-outlined">add</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
