import { ChangeEvent, ChangeSet } from '../../model/ChangeEvent.ts';
import { SlideShow } from '../../model/SlideShow.ts';
import { Slide } from '../../model/Slide.ts';

export interface EditorProps {
    editedSlideShow: SlideShow,
    editedSlide: Slide | undefined,
    changeSet: ChangeSet,
    onAddChange: (event: ChangeEvent) => void,
    onUndoLastChange: () => void,
    onRedoLastChange: () => void,
}
