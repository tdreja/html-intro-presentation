import React, { useEffect, useMemo } from 'react';
import { ActivePresentation, ActivePresentationContext } from './model/ActivePresentationContext.ts';
import { SlideShow } from './presentation/SlideShow.tsx';
import { Countdown } from './presentation/Countdown.tsx';
import { Editor } from './editor/Editor.tsx';
import { EDITOR_REDIRECT_THRESHOLD } from './settings.ts';
import { Route } from './model/Route.ts';
import { useRoute } from './utils/UseRoute.tsx';
import { useStoredPresentation } from './utils/UseStoredPresentation.tsx';
import { ChronoUnit, LocalDateTime } from '@js-joda/core';
import { CountdownContext, useCountdown } from './utils/UseCountdown.tsx';

function App() {
    const route = useRoute();
    const [presentation, setPresentation] = useStoredPresentation();
    const activePresentation: ActivePresentation = useMemo(() => ({
        presentation,
        updatePresentation: setPresentation,
    }), [presentation, setPresentation]);
    const timeRemaining = useCountdown(activePresentation);

    // Auto-redirect to editor after threshold has passed since presentation ended
    useEffect(() => {
        if (route === Route.EDITOR) {
            return;
        }
        const endOfPresentation = presentation.target.plus(EDITOR_REDIRECT_THRESHOLD);
        const now = LocalDateTime.now();
        if (now.isAfter(endOfPresentation)) {
            window.location.hash = 'editor';
            return;
        }
        const remainingMillis = now.until(endOfPresentation, ChronoUnit.MILLIS);
        const id = setTimeout(() => {
            window.location.hash = 'editor';
        }, remainingMillis);
        return () => clearTimeout(id);
    }, [presentation.target, route]);

    return (
        <ActivePresentationContext.Provider value={activePresentation}>
            <CountdownContext.Provider value={timeRemaining}>
                {route === Route.EDITOR && (
                    <Editor />
                )}
                {route === Route.PRESENTATION && (
                    <>
                        <SlideShow />
                        <Countdown />
                    </>
                )}
            </CountdownContext.Provider>
        </ActivePresentationContext.Provider>
    );
}

export default App;
