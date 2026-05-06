import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react';
import { EditorProps } from './EditorProps.ts';
import { TargetChangeEvent } from '../../model/ChangeEvent.ts';
import { Form } from 'react-bootstrap';
import { useI18N } from '../../i18n/I18NContext.tsx';
import { SlideshowContext } from '../../component/SlideshowContext.ts';

export const BottomBar = ({ editedSlideshow, changeSet, onAddChange }: EditorProps): ReactElement => {
    const i18n = useI18N();
    const [_, setSlideshow] = useContext(SlideshowContext);
    const [countdownTime, setCountdownTime] = useState<string>('2026-05-05T18:00');
    const [useCountdown, setUseCountdown] = useState<boolean>(!!editedSlideshow.countdownTarget);

    useEffect(() => {
        if (useCountdown) {
            // TODO Alter countdown
        } else if (editedSlideshow.countdownTarget) {
            onAddChange(new TargetChangeEvent(null));
        }
    }, [countdownTime, useCountdown]);

    // Apply our current data and start the slideshow!
    const onStartSlideshow = useCallback(() => {
        // Update the current slideshow!
        if (changeSet.appliedEvents.length > 0) {
            setSlideshow(editedSlideshow);
        }
        // TODO set route!
    }, [editedSlideshow, changeSet, setSlideshow]);

    // noinspection HtmlUnknownAnchorTarget
    return (
        <Form id="bottom-bar">
            <a
                role="button"
                href="#presentation"
                className="btn btn-primary"
                onClick={onStartSlideshow}
            >
                <span className="material-symbols-outlined">play_arrow</span>
                {i18n.editor.btnStartSlideshow}
            </a>

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
