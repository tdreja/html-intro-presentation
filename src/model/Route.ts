/**
 * All available routes
 */
export enum Route {
    EDITOR = 'editor',
    PRESENTATION = 'presentation',
}

/**
 * Parses the current route from the URL hash
 */
export function parseCurrentRoute(): Route {
    const hash = window.location.hash.replace('#', '');
    if (hash === Route.EDITOR) {
        return Route.EDITOR;
    }
    return Route.PRESENTATION;
}
