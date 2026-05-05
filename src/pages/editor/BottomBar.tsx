import React, { ReactElement } from 'react';
import { EditorProps } from './EditorProps.ts';

export const BottomBar = ({}: EditorProps): ReactElement => {
    return (
        <div id="bottom-bar">

            <button className="btn btn-success">
                <span className="material-symbols-outlined">play_arrow</span>
                Slideshow starten
            </button>

            <div className="form-check mb-0">
                <input className="form-check-input" type="checkbox" id="withCountdown" checked />
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
                    value="2026-05-05T18:00"
                    style={{ width: '220px' }}
                />
            </div>

        </div>
    );
};
