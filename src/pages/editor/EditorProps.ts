import { ChangeEvent, ChangeSet } from '../../model/ChangeEvent.ts';
import { SlideShow } from '../../model/SlideShow.ts';
import { SlideId } from '../../model/Slide.ts';

export interface EditorProps {
    editedSlideShow: SlideShow,
    editedSlideId: SlideId | null,
    changeSet: ChangeSet,
    onAddChange: (event: ChangeEvent) => void,
    onUndoLastChange: () => void,
    onRedoLastChange: () => void,
}
