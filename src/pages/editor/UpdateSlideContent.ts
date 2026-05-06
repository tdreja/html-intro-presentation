import { SlideId } from '../../model/Slide.ts';
import { ChangeEvent, UpdateSlideContentEvent } from '../../model/ChangeEvent.ts';
import { Slideshow } from '../../model/Slideshow.ts';

function isEmptyHtml(html: string | null) {
    if (!html) {
        return true;
    }
    if (html.length === 0) {
        return true;
    }
    return '<p></p>' === html || '<span></span>' === html;
}

export function updateSlideContent(
    editedSlideshow: Slideshow,
    editedSlideId: SlideId | null,
    onAddChange: (event: ChangeEvent) => void,
    lastEditedSlideId: SlideId | null,
    slideContent: string | null,
): [string, SlideId | null, number] | false {
    // The edited slide hasn't changed!
    if (editedSlideId === lastEditedSlideId) {
        return false;
    }

    // Check if we have changed an old slide!
    const oldSlide
        = editedSlideshow.slides.find((slide) => slide.id === lastEditedSlideId);
    if (lastEditedSlideId && oldSlide && oldSlide.content !== slideContent) {
        // Fire the changes to the current slide!
        onAddChange(new UpdateSlideContentEvent(lastEditedSlideId, slideContent));
    }

    let overrideSlideContent: string | null = null;
    // We changed a non-exstistent slide?
    if (lastEditedSlideId === null && editedSlideId && !isEmptyHtml(slideContent)) {
        // Fire the changes to the current slide!
        onAddChange(new UpdateSlideContentEvent(editedSlideId, slideContent));
        overrideSlideContent = slideContent;
    }

    // Find the matching data for the current slide
    for (const [index, slide] of editedSlideshow.slides.entries()) {
        if (slide.id === editedSlideId) {
            return [overrideSlideContent ? overrideSlideContent : slide.content, slide.id, index + 1];
        }
    }

    // No data? Reset to empty!
    return ['<span></span>', null, 0];
}
