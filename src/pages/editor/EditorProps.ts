import { ChangeEvent, ChangeSet } from '../../model/ChangeEvent.ts';

export interface EditorProps {
    changeSet: ChangeSet,
    onAddChange: (event: ChangeEvent) => void,
    onUndoLastChange: () => void,
    onRedoLastChange: () => void,
}
