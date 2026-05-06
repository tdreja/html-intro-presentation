import { type Context, createContext, type Dispatch, type SetStateAction } from 'react';
import { emptySlideshow, Slideshow } from '../model/Slideshow.ts';

export type SlideshowState = [Slideshow, Dispatch<SetStateAction<Slideshow>>];

const defaultSlideshowState: SlideshowState = [
    emptySlideshow(),
    () => {},
];

export const SlideshowContext: Context<SlideshowState> = createContext<SlideshowState>(
    defaultSlideshowState,
);
