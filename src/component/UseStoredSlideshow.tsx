import { useEffect, useState } from 'react';
import { SlideshowState } from './SlideshowContext.ts';
import { emptySlideshow } from '../model/Slideshow.ts';

/**
 * Automatically stores the current presentation in the browsers storage
 */
export function useStoredSlideshow(): SlideshowState {
    const state = useState(emptySlideshow());
    const [_, setSlideshow] = state;
    useEffect(() => {
        // setSlideshow(undefined);
    }, []);
    return state;
}
