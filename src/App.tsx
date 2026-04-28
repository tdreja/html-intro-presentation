import React, { useEffect, useState } from 'react';
import { type Presentation } from './model/Presentation.ts';
import { PresentationContext, PresentationEditorContext } from './model/PresentationContext.ts';
import { SlideShow } from './components/SlideShow.tsx';
import { Countdown } from './components/Countdown.tsx';
import { Editor } from './components/Editor.tsx';
import { EDITOR_REDIRECT_THRESHOLD_SECONDS } from './settings.ts';

function useHash(): string {
    const [hash, setHash] = useState(() => window.location.hash.replace('#', ''));
    useEffect(() => {
        const handler = () => setHash(window.location.hash.replace('#', ''));
        window.addEventListener('hashchange', handler);
        return () => window.removeEventListener('hashchange', handler);
    }, []);
    return hash;
}

function App() {
    const fakePresentation: Presentation = {
        slides: [
            { content: '# Willkommen\n\nDies ist **Slide 1**.\n\n- Punkt A\n- Punkt B\n- Punkt C' },
            { content: '## Technologie\n\nWir nutzen `React` + `TypeScript`.\n\n```ts\nconst x: number = 42;\n```' },
            { content: '### Fazit\n\n> Alles läuft. Zeit läuft ab.\n\nDanke fürs Zuschauen 🎉' },
        ],
        target: new Date(Date.now() + 3 * 60 * 1000), // 3 Minuten
    };
    const [presentation, setPresentation] = useState<Presentation>(fakePresentation);
    useEffect(() => {
        // setPresentation(loadPresentation());
    }, []);

    const route = useHash();

    // Auto-redirect to editor after threshold has passed since presentation ended
    useEffect(() => {
        if (route === 'editor') return;
        const targetTime = presentation.target.getTime();
        const redirectAt = targetTime + EDITOR_REDIRECT_THRESHOLD_SECONDS * 1000;
        const delay = redirectAt - Date.now();
        if (delay <= 0) {
            window.location.hash = 'editor';
            return;
        }
        const id = setTimeout(() => {
            window.location.hash = 'editor';
        }, delay);
        return () => clearTimeout(id);
    }, [presentation.target, route]);

    if (route === 'editor') {
        return (
            <PresentationContext.Provider value={presentation}>
                <PresentationEditorContext.Provider value={setPresentation}>
                    <Editor />
                </PresentationEditorContext.Provider>
            </PresentationContext.Provider>
        );
    }

    return (
        <PresentationContext.Provider value={presentation}>
            <PresentationEditorContext.Provider value={setPresentation}>
                <SlideShow />
                <Countdown />
            </PresentationEditorContext.Provider>
        </PresentationContext.Provider>
    );
}

export default App;
