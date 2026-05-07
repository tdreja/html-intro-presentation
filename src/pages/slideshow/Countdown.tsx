import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react';
import { SlideshowContext } from '../../component/SlideshowContext.ts';
import { ChronoUnit, Duration, LocalDateTime } from '@js-joda/core';
import { COUNTDOWN_REFRESH_INTERVAL, HIGHLIGHT_COUNTDOWN_INTERVAL } from '../../settings.ts';

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
    const [highlightCountdown, setHighlightCountdown] = useState<boolean>(false);

    const onRecalculateTimeRemaining = useCallback(() => {
        if (!slideshow.countdownTarget) {
            return;
        }
        const remaining
            = Duration.ofMillis(LocalDateTime.now().until(slideshow.countdownTarget, ChronoUnit.MILLIS));

        // We never store negative durations as state!
        if (remaining.isZero() || remaining.isNegative()) {
            setTimeRemaining(Duration.ZERO);
            return;
        }

        // Calculate if we need to highlight the countdown!
        if (!HIGHLIGHT_COUNTDOWN_INTERVAL.isZero() && remaining.compareTo(HIGHLIGHT_COUNTDOWN_INTERVAL) <= 0) {
            setHighlightCountdown(true);
        }
        setTimeRemaining(remaining);
    }, [slideshow, setTimeRemaining, setHighlightCountdown]);

    useEffect(() => {
        if (slideshow.countdownTarget) {
            const updateCountdown
                = setInterval(onRecalculateTimeRemaining, COUNTDOWN_REFRESH_INTERVAL.toMillis());
            setHighlightCountdown(false);
            onRecalculateTimeRemaining();
            return () => clearInterval(updateCountdown);
        }
    }, [slideshow]);

    // Skip any missing countdowns
    if (!slideshow.countdownTarget) {
        return undefined;
    }
    if (highlightCountdown) {
        return (<h1>{formatTimeRemaining(timeRemaining)}</h1>);
    }
    return (
        <h2>{formatTimeRemaining(timeRemaining)}</h2>
    );
};
