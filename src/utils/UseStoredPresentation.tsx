import { inactivePresentation, type Presentation } from '../model/Presentation.ts';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { loadPresentation } from '../model/PresentationStorage.ts';

/**
 * Automatically stores the current presentation in the browsers storage
 */
export function useStoredPresentation(): [Presentation, Dispatch<SetStateAction<Presentation>>] {
    const state = useState(inactivePresentation);
    useEffect(() => {
        state[1](loadPresentation());
    }, []);
    return state;
}
