/**
 * Translations for the editor UI
 */
export interface EditorI18N {
    btnStartSlideshow: string,
    btnAddSlide: string,
    btnUndo: string,
    btnRedo: string,
    titleSlideshowEditor: string,
    titleSlides: string,
    titleSlide: string,
    titleExportSlideshow: string,
    formCheckboxWithCountdown: string,
    formDatePickerCountdown: string,
}

export interface ChangeEventI18N {
    changeTarget: string,
    addSlide: string,
    removeSlide: string,
    updateSlide: string,
    updateSelectedSlide: string,
}

/**
 * All translations
 */
export interface I18N {
    readonly editor: EditorI18N,
    readonly changeEvent: ChangeEventI18N,
}
