import { Duration } from '@js-joda/core';

/**
 * How long do we show each slide to the user?
 */
export const DURATION_PER_SLIDE: Duration = Duration.ofSeconds(6);

/**
 * How many change events do we keep, until we drop the oldest ones?
 */
export const CHANGE_SET_SIZE = 30;

/**
 * How often do we refresh the displayed countdown timer?
 */
export const COUNTDOWN_REFRESH_INTERVAL = Duration.ofMillis(500);

/**
 * For how long until the end of the countdown do we highlight the timer?
 */
export const HIGHLIGHT_COUNTDOWN_INTERVAL = Duration.ofMinutes(10);
