import { ActivePresentation } from '../component/SlideshowContext.ts';
import { ChronoUnit, Duration, LocalDateTime } from '@js-joda/core';
import { Context, createContext, useEffect, useState } from 'react';

function calculateCountdownDuration(activePresentation: ActivePresentation): Duration | null {
    const now = LocalDateTime.now();
    if (now.isAfter(activePresentation.presentation.target)) {
        return null;
    }
    return Duration.ofMillis(now.until(activePresentation.presentation.target, ChronoUnit.MILLIS));
}

/**
 * Calculates the remaining time for the active presentation
 */
export function useCountdown(activePresentation: ActivePresentation): Duration | null {
    const [countdown, setCountdown] = useState<Duration | null>(null);
    useEffect(() => {
        const target = calculateCountdownDuration(activePresentation);
        setCountdown(target);
        if (target == null) {
            return;
        }
        const id = setInterval(() => {
            setCountdown(calculateCountdownDuration(activePresentation));
        }, 500);
        return () => clearInterval(id);
    }, [activePresentation]);
    return countdown;
}

export const CountdownContext: Context<Duration | null> = createContext<Duration | null>(null);
