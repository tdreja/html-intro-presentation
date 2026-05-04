import { parseCurrentRoute, Route } from '../model/Route.ts';
import { useEffect, useState } from 'react';

/**
 * Automatically tracks the current route based on the URL hash and updates when it changes.
 */
export function useRoute(): Route {
    const [route, setRoute] = useState(() => parseCurrentRoute());
    useEffect(() => {
        const handler = () => setRoute(parseCurrentRoute());
        window.addEventListener('hashchange', handler);
        return () => window.removeEventListener('hashchange', handler);
    }, []);
    return route;
}
