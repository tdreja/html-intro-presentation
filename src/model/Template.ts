import { I18N } from '../i18n/I18N.ts';

/**
 * A template for a slide
 */
export interface Template {
    /**
     * Label of the template shown to the user
     */
    readonly label: string,
    /**
     * Renders out the template for the current day
     */
    readonly template: (i18n: I18N) => string,
}
