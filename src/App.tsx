import React, { useEffect, useState } from 'react';
import { inactivePresentation, type Presentation } from './model/Presentation.ts';
import { loadPresentation } from './model/PresentationStorage.ts';
import { PresentationContext, PresentationEditorContext } from './model/PresentationContext.ts';

function App() {
    const [presentation, setPresentation] = useState<Presentation>(inactivePresentation);
    useEffect(() => {
        setPresentation(loadPresentation());
    }, []);

    return (
        <PresentationContext.Provider value={presentation}>
            <PresentationEditorContext.Provider value={setPresentation}>
                <div>Test</div>
            </PresentationEditorContext.Provider>
        </PresentationContext.Provider>
    );
}

export default App;
