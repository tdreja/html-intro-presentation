import { useEffect, useState } from 'react';
import { SlideshowState } from './SlideshowContext.ts';
import { emptySlideshow } from '../model/Slideshow.ts';
import { fromYaml } from '../model/YamlModel.ts';
import { parse } from 'yaml';

/**
 * Automatically stores the current presentation in the browsers storage
 */
export function useStoredSlideshow(): SlideshowState {
    const state = useState(emptySlideshow());
    const [_, setSlideshow] = state;
    useEffect(() => {
        const json = localStorage.getItem('slideshow');
        const jsonSlideshow = json ? fromYaml(parse(json)) : null;
        const data = window.SLIDESHOW;
        const dataSlideshow = data ? fromYaml(parse(data)) : null;

        // Pick the most current possible slideshow!
        if (jsonSlideshow) {
            if (dataSlideshow && jsonSlideshow.lastUpdate.isBefore(dataSlideshow.lastUpdate)) {
                setSlideshow(dataSlideshow);
            } else {
                setSlideshow(jsonSlideshow);
            }
        } else if (dataSlideshow) {
            setSlideshow(dataSlideshow);
        }
    }, []);
    return state;
}
