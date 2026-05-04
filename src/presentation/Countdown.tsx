import React, { useContext } from 'react';
import './presentation.css';
import { Duration } from '@js-joda/core';
import { CountdownContext } from '../utils/UseCountdown.tsx';

function formatCountdown(timeRemaining: Duration | null): string {
    if (!timeRemaining) {
        return '00:00';
    }
    const hours = timeRemaining.toHoursPart();
    const mm = String(timeRemaining.toMinutesPart()).padStart(2, '0');
    const ss = String(timeRemaining.toSecondsPart()).padStart(2, '0');
    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${mm}:${ss}`;
    }
    return `${mm}:${ss}`;
}

export function Countdown() {
    const timeRemaining = useContext(CountdownContext);
    const lastMinute = timeRemaining && timeRemaining.seconds() < 60;
    const expired = !timeRemaining;

    const className = [
        'countdown',
        'position-fixed',
        'font-monospace',
        'fw-bold',
        'user-select-none',
        'pe-none',
        lastMinute ? 'countdown--last-minute' : '',
        expired ? 'countdown--expired' : '',
    ].filter(Boolean).join(' ');

    return <div className={className}>{formatCountdown(timeRemaining)}</div>;
}
