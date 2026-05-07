import React, { ReactElement, useContext } from 'react';
import { Carousel } from 'react-bootstrap';
import './slideshow-style.css';
import { SlideshowContext } from '../../component/SlideshowContext.ts';
import { DisplayHtml } from '../../component/DisplayHtml.tsx';
import { Countdown } from './Countdown.tsx';

export const SlideshowController = (): ReactElement => {
    const [slideshow] = useContext(SlideshowContext);
    return (
        <div id="slideshow-controller">
            <Carousel controls={false} interval={4000} wrap className="m-3">
                {slideshow.slides.map((slide) => (
                    <Carousel.Item key={slide.id}>
                        <DisplayHtml html={slide.content} />
                    </Carousel.Item>
                ))}
            </Carousel>
            <div id="slideshow-bottom">
                <Countdown />
            </div>
        </div>
    );
};
