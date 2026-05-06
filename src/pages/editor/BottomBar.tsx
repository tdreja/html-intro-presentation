import React, { ReactElement, useEffect, useState } from 'react';
import { EditorProps } from './EditorProps.ts';
import { TargetChangeEvent } from '../../model/ChangeEvent.ts';
import { Button, Form } from 'react-bootstrap';
import { useI18N } from '../../i18n/I18NContext.tsx';

export const BottomBar = ({ editedSlideshow, onAddChange }: EditorProps): ReactElement => {
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

    return (
        <Form id="bottom-bar">
            <Button role="button" variant="success">
                <span className="material-symbols-outlined">play_arrow</span>
                {i18n.editor.btnStartSlideshow}
            </Button>

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

        </Form>
    );
};
