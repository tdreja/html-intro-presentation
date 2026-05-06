/**
 * Basic shared type of all translations
 */
export type I18NTranslation = {
    [key: string]: string,
};

/**
 * Translations for the editor UI
 */
export interface EditorI18N extends I18NTranslation {
    btnStartSlideshow: string,
    btnAddSlide: string,
    btnDownloadSlideshow: string,
    btnUploadSlideshow: string,
    btnUploadImagesAsSlides: string,
    titleSlideshowEditor: string,
    titleUploadSlideshow: string,
    titleUploadImagesAsSlides: string,
    titleSlides: string,
    titleSlide: string,
    formCheckboxWithCountdown: string,
    formDatePickerCountdown: string,
}

/**
 * All translations
 */
export interface I18N {
    readonly editor: EditorI18N,
}
