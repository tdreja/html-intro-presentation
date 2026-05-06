import React, { useMemo } from 'react';
import { useRoute } from './component/UseRoute.tsx';
import { useStoredSlideshow } from './component/UseStoredSlideshow.tsx';
import { Editor } from './pages/editor/Editor.tsx';
import { i18n, I18NContext } from './i18n/I18NContext.tsx';
import { Route } from './model/Route.ts';
import { SlideshowContext } from './component/SlideshowContext.ts';

function App() {
    // I18N for translations
    const currentI18N = useMemo(() => {
        return i18n();
    }, []);

    // Current route: Editor or Presentation
    const route = useRoute();

    // Presentation currently shown to the user or being edited
    const slideshowState = useStoredSlideshow();

    return (
        <I18NContext.Provider value={currentI18N}>
            <SlideshowContext value={slideshowState}>
                {route === Route.EDITOR && (
                    <Editor />
                )}
                {route === Route.PRESENTATION && (
                    <Editor />
                )}
            </SlideshowContext>
        </I18NContext.Provider>
    );
}

export default App;
