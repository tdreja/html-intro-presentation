import React, { ReactElement, useEffect, useState } from 'react';
import { EditorProps } from './EditorProps.ts';
import { TargetChangeEvent } from '../../model/ChangeEvent.ts';

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
        <div id="bottom-bar">

            <button className="btn btn-success">
                <span className="material-symbols-outlined">play_arrow</span>
                Slideshow starten
            </button>

            <div className="form-check mb-0">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="withCountdown"
                    checked={useCountdown}
                    onChange={(e) => setUseCountdown(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="withCountdown">
                    Mit Countdown
                </label>
            </div>

            <div className="d-flex flex-column">
                <label className="small-label" htmlFor="countdownEnd">Countdown Endzeitpunkt</label>
                <input
                    className="form-control"
                    type="datetime-local"
                    id="countdownEnd"
                    value={countdownTime}
                    onChange={(e) => setCountdownTime(e.target.value)}
                    style={{ width: '220px' }}
                />
            </div>

        </div>
    );
};
