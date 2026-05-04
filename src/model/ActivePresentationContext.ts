import { inactivePresentation, type Presentation, type Slide } from './Presentation.ts';
import { type Context, createContext } from 'react';

export type ActivePresentation = {
    presentation: Presentation,
    updatePresentation: (presentation: Presentation) => void,
};

const defaultCurrentPresentation: ActivePresentation = {
    presentation: inactivePresentation,
    updatePresentation: () => {},
};

export const ActivePresentationContext: Context<ActivePresentation> = createContext<ActivePresentation>(
    defaultCurrentPresentation,
);
