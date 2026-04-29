import React, { useContext, useEffect, useState } from 'react';
import { ActivePresentationContext } from '../model/ActivePresentationContext.ts';
import './presentation.css';
import { ChronoUnit, LocalDateTime } from '@js-joda/core';

function formatCountdown(ms: number): string {
    if (ms <= 0) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${mm}:${ss}`;
    }
    return `${mm}:${ss}`;
}

export function Countdown() {
    const { presentation } = useContext(ActivePresentationContext);
    const { target } = presentation;
    const [remaining, setRemaining] = useState<number>(() => LocalDateTime.now().until(target, ChronoUnit.MILLIS));

    useEffect(() => {
        setRemaining(LocalDateTime.now().until(target, ChronoUnit.MILLIS));
        const id = setInterval(() => {
            setRemaining(LocalDateTime.now().until(target, ChronoUnit.MILLIS));
        }, 500);
        return () => clearInterval(id);
    }, [target]);

    const lastMinute = remaining > 0 && remaining <= 60_000;
    const expired = remaining <= 0;

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

    return <div className={className}>{formatCountdown(remaining)}</div>;
}
