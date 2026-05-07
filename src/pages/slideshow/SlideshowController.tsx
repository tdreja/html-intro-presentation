import React, { CSSProperties, ReactElement, useContext, useEffect, useState } from 'react';
import { Button, Carousel } from 'react-bootstrap';
import './slideshow-style.css';
import { SlideshowContext } from '../../component/SlideshowContext.ts';
import { DisplayHtml } from '../../component/DisplayHtml.tsx';
import { Countdown } from './Countdown.tsx';
import { RouteContext } from '../../component/RouteContext.ts';
import { Route } from '../../model/Route.ts';
import { Indicators } from './Indicators.tsx';
import { DURATION_PER_SLIDE } from '../../settings.ts';

export const CAROUSEL_ID = 'slideshow-carousel';

export const SlideshowController = (): ReactElement => {
    const [slideshow] = useContext(SlideshowContext);
    const [_, setRoute] = useContext(RouteContext);
    const [slideIndex, setSlideIndex] = useState<number>(0);

    const style: CSSProperties = {
        '--indicator-animation-time': `${DURATION_PER_SLIDE.seconds()}s`,
    } as CSSProperties;

    useEffect(() => {
        if (slideshow.slides.length <= 1) {
            return;
        }
        const autoAdvance = setInterval(() => {
            setSlideIndex((prevIndex) => (prevIndex + 1) % slideshow.slides.length);
        }, DURATION_PER_SLIDE.toMillis());
        return () => clearInterval(autoAdvance);
    }, [slideshow]);

    return (
        <div id="slideshow-controller" style={style}>
            <Carousel
                id={CAROUSEL_ID}
                activeIndex={slideIndex}
                onSelect={setSlideIndex}
                indicators={false}
                interval={null}
                controls={false}
                wrap
                className="m-3"
            >
                {slideshow.slides.map((slide) => (
                    <Carousel.Item key={slide.id}>
                        <DisplayHtml html={slide.content} />
                    </Carousel.Item>
                ))}
            </Carousel>
            <div id="slideshow-bottom">
                <Button variant="outline-secondary" id="to-editor-button" onClick={() => setRoute(Route.EDITOR)}>
                    <span className="material-symbols-outlined">dashboard_customize</span>
                </Button>
                <Indicators
                    activeIndex={slideIndex}
                    onSelect={setSlideIndex}
                />
                <Countdown />
            </div>
        </div>
    );
};
