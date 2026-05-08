import { ChangeEvent, ChangeSet } from '../../model/ChangeEvent.ts';
import { Slideshow } from '../../model/Slideshow.ts';
import { UuidV4 } from '../../model/UuidV4.ts';

export interface EditorProps {
    editedSlideshow: Slideshow,
    editedSlideId: UuidV4 | null,
    editedSlideContent: string,
    changeSet: ChangeSet,
    onAddChange: (event: ChangeEvent) => void,
    onUndoLastChange: () => void,
    onRedoLastChange: () => void,
    onChangeEditedSlideId: (slideId: UuidV4 | null) => Slideshow,
}
