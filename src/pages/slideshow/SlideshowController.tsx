import React, { ReactElement, useContext, useState } from 'react';
import { Button, Carousel } from 'react-bootstrap';
import './slideshow-style.css';
import { SlideshowContext } from '../../component/SlideshowContext.ts';
import { DisplayHtml } from '../../component/DisplayHtml.tsx';
import { Countdown } from './Countdown.tsx';
import { RouteContext } from '../../component/RouteContext.ts';
import { Route } from '../../model/Route.ts';

export const SlideshowController = (): ReactElement => {
    const [slideshow] = useContext(SlideshowContext);
    const [_, setRoute] = useContext(RouteContext);
    const [slideIndex, setSlideIndex] = useState<number>(0);
    return (
        <div id="slideshow-controller">
            <Carousel activeIndex={slideIndex} onSelect={setSlideIndex} indicators={false} wrap className="m-3">
                {slideshow.slides.map((slide) => (
                    <Carousel.Item key={slide.id}>
                        <DisplayHtml html={slide.content} />
                    </Carousel.Item>
                ))}
            </Carousel>
            <div id="slideshow-bottom">
                <Button variant="outline-primary" id="to-editor-button" onClick={() => setRoute(Route.EDITOR)}>
                    <span className="material-symbols-outlined">dashboard_customize</span>
                </Button>
                <Countdown />
            </div>
        </div>
    );
};
