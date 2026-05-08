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
        if (json) {
            setSlideshow(fromYaml(parse(json)));
        }
    }, []);
    return state;
}
