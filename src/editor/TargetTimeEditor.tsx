import React, { ReactElement } from 'react';
import { printLocalDateTime, toLocalDateTime } from '../utils/DateTimeUtils.ts';
import { LocalDateTime } from '@js-joda/core';
import { ChangeEvent, TargetChangeEvent } from '../model/ChangeEvent.ts';

type Props = {
    targetTime: LocalDateTime,
    onAddChange: (changeEvent: ChangeEvent) => void,
};

export const TargetTimeEditor = ({
    targetTime,
    onAddChange,
}: Props): ReactElement => {
    return (
        <div className="editor-target-bar flex-shrink-0 border-top d-flex align-items-center gap-3 px-4 py-2">
            <label htmlFor="target-datetime" className="form-label mb-0 fw-semibold text-nowrap">
                <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1.1rem' }}>event</span>
                Präsentation endet am
            </label>
            <input
                id="target-datetime"
                type="datetime-local"
                className="form-control form-control-sm w-auto"
                value={printLocalDateTime(targetTime)}
                onChange={(e) => {
                    const dateTime = toLocalDateTime(e.target.value);
                    if (dateTime) {
                        onAddChange(new TargetChangeEvent(dateTime));
                    }
                }}
            />
        </div>
    );
};
