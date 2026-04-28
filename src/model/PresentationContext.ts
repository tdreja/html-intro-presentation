import { inactivePresentation, type Presentation } from './Presentation.ts';
import { type Context, createContext } from 'react';

export type PresentationEditor = (presentation: Presentation) => void;

export const PresentationContext: Context<Presentation> = createContext<Presentation>(
    inactivePresentation,
);
export const PresentationEditorContext: Context<PresentationEditor> = createContext<PresentationEditor>(
    (_: Presentation) => {},
);
