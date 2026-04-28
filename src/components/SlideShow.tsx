import React, { useContext, useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
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
    const indexRef = useRef(currentIndex);
    indexRef.current = currentIndex;

    // Reset to first slide when presentation changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [slides]);

    useEffect(() => {
        if (!slides.length) return;
        const id = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, SECONDS_PER_SLIDE * 1000);
        return () => clearInterval(id);
    }, [slides]);

    if (expired) {
        return <div className="slide-container" />;
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
            <div key={currentIndex} className="slide-content">
                <Markdown>{slide.content}</Markdown>
            </div>
            <div className="slide-counter">
                {currentIndex + 1}
                {' / '}
                {slides.length}
            </div>
        </div>
    );
}
