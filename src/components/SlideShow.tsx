// noinspection HtmlUnknownAnchorTarget

import React, { useContext, useEffect, useRef, useState } from 'react';
import { PresentationContext } from '../model/PresentationContext.ts';
import { SECONDS_PER_SLIDE } from '../settings.ts';
import './presentation.css';

export function SlideShow() {
    const presentation = useContext(PresentationContext);
    const { slides, target } = presentation;
    const [expired, setExpired] = useState(() => target.getTime() <= Date.now());

    useEffect(() => {
        setExpired(target.getTime() <= Date.now());
        const id = setInterval(() => {
            if (target.getTime() <= Date.now()) {
                setExpired(true);
                clearInterval(id);
            }
        }, 500);
        return () => clearInterval(id);
    }, [target]);

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
        }, SECONDS_PER_SLIDE * 1000);
        return () => {
            clearInterval(id);
            if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
        };
    }, [slides]);

    if (expired) {
        return (
            <div className="slide-container slide-container--expired">
                <a href="#editor" className="editor-button editor-button--center">
                    Zum Editor
                </a>
            </div>
        );
    }

    if (!slides.length) {
        return (
            <div className="slide-container">
                <div className="slide-content slide-empty">
                    Keine Slides geladen.
                </div>
            </div>
        );
    }

    const slide = slides[currentIndex];

    return (
        <div className="slide-container">
            {transitioning && prevIndex !== null && (
                <div className="slide-content slide-content--exit"
                     dangerouslySetInnerHTML={{ __html: slides[prevIndex].content }}
                />
            )}
            <div
                className={`slide-content${transitioning ? ' slide-content--enter' : ''}`}
                dangerouslySetInnerHTML={{ __html: slide.content }}
            />
            <div className="slide-counter">
                {currentIndex + 1}
                {' / '}
                {slides.length}
            </div>
            <a href="#editor" className="editor-button editor-button--ghost" title="Zum Editor">
                <span className="material-symbols-outlined">edit</span>
            </a>
        </div>
    );
}
