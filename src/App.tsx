import React, { useEffect, useMemo, useState } from 'react';
import { useStoredSlideshow } from './component/UseStoredSlideshow.tsx';
import { Editor } from './pages/editor/Editor.tsx';
import { i18n, I18NContext } from './i18n/I18NContext.tsx';
import { parseCurrentRoute, Route } from './model/Route.ts';
import { SlideshowContext } from './component/SlideshowContext.ts';
import { SlideshowController } from './pages/slideshow/SlideshowController.tsx';
import { RouteContext } from './component/RouteContext.ts';

function App() {
    // I18N for translations
    const currentI18N = useMemo(() => {
        return i18n();
    }, []);

    // Route Status
    const routeState = useState<Route>(parseCurrentRoute());
    const [route, setRoute] = routeState;
    useEffect(() => {
        const handler = () => setRoute(parseCurrentRoute());
        window.addEventListener('hashchange', handler);
        return () => window.removeEventListener('hashchange', handler);
    }, []);

    // Update the route in the URL as well!
    useEffect(() => {
        const current = parseCurrentRoute();
        if (current !== route) {
            window.location.hash = route;
        }
    }, [route]);

    // Presentation currently shown to the user or being edited
    const slideshowState = useStoredSlideshow();

    return (
        <I18NContext.Provider value={currentI18N}>
            <RouteContext value={routeState}>
                <SlideshowContext value={slideshowState}>
                    {route === Route.EDITOR && (
                        <Editor />
                    )}
                    {route === Route.PRESENTATION && (
                        <SlideshowController />
                    )}
                </SlideshowContext>
            </RouteContext>
        </I18NContext.Provider>
    );
}

export default App;
