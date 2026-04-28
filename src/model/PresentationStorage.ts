import { fromJson, inactivePresentation, type Presentation, toJson } from './Presentation.ts';

export function storePresentation(presentation?: Presentation | null) {
    if (presentation) {
        window.localStorage.setItem('presentation', JSON.stringify(toJson(presentation)));
    } else {
        window.localStorage.removeItem('presentation');
    }
}

export function loadPresentation(): Presentation {
    const json = window.localStorage.getItem('presentation');
    if (json) {
        return fromJson(JSON.parse(json));
    }
    return inactivePresentation;
}
