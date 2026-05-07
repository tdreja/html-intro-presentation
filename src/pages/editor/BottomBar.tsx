import React, { ReactElement, useEffect, useState } from 'react';
import { EditorProps } from './EditorProps.ts';
import { ChangeEvent, TargetChangeEvent } from '../../model/ChangeEvent.ts';
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import { useI18N } from '../../i18n/I18NContext.tsx';
import { I18N } from '../../i18n/I18N.ts';

function describeChangeEvent(i18n: I18N, action: string, event?: ChangeEvent | null): string {
    if (!event) {
        return action;
    }
    return `${action}: ${event.describe(i18n)}`;
}

type BottomBarProps = EditorProps & {
    readonly onStartSlideshow: () => void,
};

export const BottomBar = ({
    editedSlideshow,
    changeSet,
    onAddChange,
    onUndoLastChange,
    onRedoLastChange,
    onStartSlideshow,
}: BottomBarProps): ReactElement => {
    const i18n = useI18N();
    const [countdownTime, setCountdownTime] = useState<string>('2026-05-05T18:00');
    const [useCountdown, setUseCountdown] = useState<boolean>(!!editedSlideshow.countdownTarget);

    useEffect(() => {
        if (useCountdown) {
            // TODO Alter countdown
        } else if (editedSlideshow.countdownTarget) {
            onAddChange(new TargetChangeEvent(null));
        }
    }, [countdownTime, useCountdown]);

    // noinspection HtmlUnknownAnchorTarget
    return (
        <Form id="bottom-bar">
            <ButtonGroup size="sm">
                <Button
                    variant={changeSet.appliedEvents.isEmpty() ? 'outline-secondary' : 'outline-primary'}
                    disabled={changeSet.appliedEvents.isEmpty()}
                    onClick={onUndoLastChange}
                >
                    {describeChangeEvent(i18n, i18n.editor.btnUndo, changeSet.appliedEvents.peek())}
                </Button>
                <Button
                    variant={changeSet.pendingEvents.isEmpty() ? 'outline-secondary' : 'outline-primary'}
                    disabled={changeSet.pendingEvents.isEmpty()}
                    onClick={onRedoLastChange}
                >
                    {describeChangeEvent(i18n, i18n.editor.btnRedo, changeSet.pendingEvents.peek())}
                </Button>
            </ButtonGroup>

            <div className="d-flex flex-row align-items-center gap-4">
                <Form.Group controlId="useCountdown">
                    <Form.Check
                        checked={useCountdown}
                        onChange={(e) => setUseCountdown(e.target.checked)}
                        label={i18n.editor.formCheckboxWithCountdown}
                    />
                </Form.Group>

                <Form.Group controlId="countdownEnd">
                    <Form.Label>{i18n.editor.formDatePickerCountdown}</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        value={countdownTime}
                        onChange={(e) => setCountdownTime(e.target.value)}
                    />
                </Form.Group>
            </div>

            <Button onClick={onStartSlideshow}>
                <span className="material-symbols-outlined">play_arrow</span>
                {i18n.editor.btnStartSlideshow}
            </Button>
        </Form>
    );
};
