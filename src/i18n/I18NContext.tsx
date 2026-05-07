import { createContext, useContext } from 'react';
import { I18N } from './I18N.ts';
import { I18N_de } from './I18N_de.ts';
import { I18N_en } from './I18N_en.ts';

export const I18NContext = createContext<I18N>(I18N_de);

export const useI18N = (): I18N => {
    return useContext(I18NContext);
};

/**
 * Fetches the appropriate labels based on the user's language settings.
 * Defaults to English if no specific language is detected.
 */
export function i18n(): I18N {
    const language = window.navigator.language;
    if (language && language.startsWith('de')) {
        return I18N_de;
    }
    return I18N_en;
}
