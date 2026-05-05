import React, { ReactElement, useCallback, useState } from 'react';
import './editor-style.css';
import 'material-symbols';
import { TopBar } from './TopBar.tsx';
import { addChange, ChangeEvent, ChangeSet, emptyChangeSet } from '../../model/ChangeEvent.ts';
import { SlideCarousell } from './SlideCarousell.tsx';
import { SlideEditor } from './SlideEditor.tsx';
import { BottomBar } from './BottomBar.tsx';

export const Editor = (): ReactElement => {
    const [changeSet, setChangeSet] = useState<ChangeSet>(emptyChangeSet);
    const onAddChange = useCallback((event: ChangeEvent) => {
        setChangeSet((prev) => addChange(prev, event));
    }, [setChangeSet]);
    const onUndoLastChange = useCallback(() => {
    }, [changeSet, setChangeSet]);
    const onRedoLastChange = useCallback(() => {
    }, [changeSet, setChangeSet]);

    console.log('Test');
    return (
        <div id="editor-page">
            {/* ══ TOP BAR ══ */}
            <TopBar
                changeSet={changeSet}
                onAddChange={onAddChange}
                onRedoLastChange={onRedoLastChange}
                onUndoLastChange={onUndoLastChange}
            />

            {/* ══ EDITOR AREA ══ */}
            <div id="editor-area">

                {/* Slide Carousel */}
                <SlideCarousell
                    changeSet={changeSet}
                    onAddChange={onAddChange}
                    onRedoLastChange={onRedoLastChange}
                    onUndoLastChange={onUndoLastChange}
                />

                {/* Slide Editor */}
                <SlideEditor
                    onAddChange={onAddChange}
                    changeSet={changeSet}
                    onRedoLastChange={onRedoLastChange}
                    onUndoLastChange={onUndoLastChange}
                />

            </div>

            {/* ══ BOTTOM BAR ══ */}
            <BottomBar
                onAddChange={onAddChange}
                changeSet={changeSet}
                onRedoLastChange={onRedoLastChange}
                onUndoLastChange={onUndoLastChange}
            />
        </div>
    );
};
