import React, { ReactElement, useContext } from 'react';
import { SlideshowContext } from '../../component/SlideshowContext.ts';
import { Slide } from '../../model/Slide.ts';
import { CAROUSEL_ID } from './SlideshowController.tsx';

type SingleIndicatorProps = {
    slide: Slide,
    index: number,
    active: boolean,
    onSelect: (index: number) => void,
};

export const Indicator = ({ index, active, onSelect }: SingleIndicatorProps): ReactElement => {
    return (
        <button
            type="button"
            data-bs-target={`#${CAROUSEL_ID}`}
            data-bs-slide-to={index}
            aria-label={`Slide ${index + 1}`}
            aria-current={active ? 'true' : undefined}
            className={active ? 'active' : undefined}
            onClick={() => onSelect(index)}
        />
    );
};

type IndicatorsProps = {
    activeIndex: number,
    onSelect: (index: number) => void,
};

export const Indicators = ({ activeIndex, onSelect }: IndicatorsProps): ReactElement | null => {
    const [slideshow] = useContext(SlideshowContext);
    if (slideshow.slides.length <= 1) {
        return null;
    }
    return (
        <div className="carousel-indicators">
            {slideshow.slides.map((slide, index) => (
                <Indicator
                    key={slide.id}
                    slide={slide}
                    index={index}
                    active={index === activeIndex}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
};
