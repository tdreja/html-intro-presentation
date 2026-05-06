import { ChangeEvent, ChangeSet } from '../../model/ChangeEvent.ts';
import { Slideshow } from '../../model/Slideshow.ts';
import { SlideId } from '../../model/Slide.ts';

export interface EditorProps {
    editedSlideshow: Slideshow,
    editedSlideId: SlideId | null,
    changeSet: ChangeSet,
    onAddChange: (event: ChangeEvent) => void,
    onUndoLastChange: () => void,
    onRedoLastChange: () => void,
}
