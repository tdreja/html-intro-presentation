import React, { useEffect, useState } from 'react';
import { type Presentation } from './model/Presentation.ts';
import { PresentationContext, PresentationEditorContext } from './model/PresentationContext.ts';
import { SlideShow } from './components/SlideShow.tsx';
import { Countdown } from './components/Countdown.tsx';

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
