// noinspection HtmlUnknownAnchorTarget

import React, { useContext, useEffect, useRef, useState } from 'react';
import { SlideshowContext } from '../component/SlideshowContext.ts';
import './presentation.css';
import { DURATION_PER_SLIDE } from '../settings.ts';
import { CountdownContext } from '../utils/UseCountdown.tsx';

export function SlideShow() {
    const activePresentation = useContext(SlideshowContext);
    const { slides } = activePresentation.presentation;
    const timeRemaining = useContext(CountdownContext);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState<number | null>(null);
    const [transitioning, setTransitioning] = useState(false);
    const indexRef = useRef(currentIndex);
    indexRef.current = currentIndex;
    const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Reset to first slide when presentation changes
    useEffect(() => {
        setCurrentIndex(0);
        setPrevIndex(null);
        setTransitioning(false);
    }, [slides]);

    useEffect(() => {
        if (!slides.length) return;
        const id = setInterval(() => {
            const next = (indexRef.current + 1) % slides.length;
            setPrevIndex(indexRef.current);
            setCurrentIndex(next);
            setTransitioning(true);
            if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
            transitionTimerRef.current = setTimeout(() => {
                setTransitioning(false);
                setPrevIndex(null);
            }, 600);
        }, DURATION_PER_SLIDE.toMillis());
        return () => {
            clearInterval(id);
            if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
        };
    }, [slides]);

    if (!timeRemaining) {
        return (
            <div className="slide-container d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden gap-4">
                <a href="#editor" className="editor-button--center">
                    Zum Editor
                </a>
            </div>
        );
    }

    if (!slides.length) {
        return (
            <div className="slide-container d-flex align-items-center justify-content-center position-relative overflow-hidden">
                <div className="slide-content text-center slide-empty">
                    Keine Slides geladen.
                </div>
            </div>
        );
    }

    const slide = slides[currentIndex];

    return (
        <div className="slide-container d-flex align-items-center justify-content-center position-relative overflow-hidden">
            {transitioning && prevIndex !== null && (
                <div
                    className="slide-content slide-content--exit"
                    dangerouslySetInnerHTML={{ __html: slides[prevIndex].content }}
                />
            )}
            <div
                className={`slide-content${transitioning ? ' slide-content--enter' : ''}`}
                dangerouslySetInnerHTML={{ __html: slide.content }}
            />
            <div className="slide-counter font-monospace small user-select-none pe-none">
                {currentIndex + 1}
                {' / '}
                {slides.length}
            </div>
            <a href="#editor" className="editor-button--ghost" title="Zum Editor">
                <span className="material-symbols-outlined">edit</span>
            </a>
        </div>
    );
}
