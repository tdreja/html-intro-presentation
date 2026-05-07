import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { SlideshowContext } from '../../component/SlideshowContext.ts';
import { ChronoUnit, Duration, LocalDateTime } from '@js-joda/core';

const COUNTDOWN_REFRESH_INTERVAL = Duration.ofMillis(250);

function formatTimeRemaining(duration: Duration): string {
    if (duration.isZero() || duration.isNegative()) {
        return '00:00';
    }
    const hours = duration.toHoursPart();
    const minutes = String(duration.toMinutesPart()).padStart(2, '0');
    const seconds = String(duration.toSecondsPart()).padStart(2, '0');
    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
    }
    return `${minutes}:${seconds}`;
}

export const Countdown = (): ReactElement | undefined => {
    const [slideshow] = useContext(SlideshowContext);
    const [timeRemaining, setTimeRemaining] = useState<Duration>(Duration.ZERO);

    useEffect(() => {
        const target = slideshow.countdownTarget;
        if (target) {
            const updateCountdown = setInterval(() => {
                setTimeRemaining(Duration.ofMillis(target.until(LocalDateTime.now(), ChronoUnit.MILLIS)));
            }, COUNTDOWN_REFRESH_INTERVAL.toMillis());
            return () => clearInterval(updateCountdown);
        }
    }, [slideshow]);

    // Skip any missing countdowns
    if (!slideshow.countdownTarget) {
        return undefined;
    }
    return (
        <span>{formatTimeRemaining(timeRemaining)}</span>
    );
};
