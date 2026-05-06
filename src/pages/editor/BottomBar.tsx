import React, { ReactElement, useEffect, useState } from 'react';
import { EditorProps } from './EditorProps.ts';
import { TargetChangeEvent } from '../../model/ChangeEvent.ts';
import { Button, Col, Form, Row } from 'react-bootstrap';

export const BottomBar = ({ editedSlideShow, onAddChange }: EditorProps): ReactElement => {
    const [countdownTime, setCountdownTime] = useState<string>('2026-05-05T18:00');
    const [useCountdown, setUseCountdown] = useState<boolean>(!!editedSlideShow.countdownTarget);

    useEffect(() => {
        if (useCountdown) {
            // TODO Alter countdown
        } else if (editedSlideShow.countdownTarget) {
            onAddChange(new TargetChangeEvent(null));
        }
    }, [countdownTime, useCountdown]);

    return (
        <Form id="bottom-bar">
            <Button role="button" variant="success">
                <span className="material-symbols-outlined">play_arrow</span>
                Slideshow starten
            </Button>

            <Form.Group controlId="useCountdown">
                <Form.Check
                    checked={useCountdown}
                    onChange={(e) => setUseCountdown(e.target.checked)}
                    label="Mit Countdown"
                />
            </Form.Group>

            <Form.Group controlId="countdownEnd">
                <Form.Label>Countdown Endzeitpunkt</Form.Label>
                <Form.Control
                    type="datetime-local"
                    value={countdownTime}
                    onChange={(e) => setCountdownTime(e.target.value)}
                />
            </Form.Group>

        </Form>
    );
};
