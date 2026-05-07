import { Duration } from '@js-joda/core';

/** Anzeigedauer pro Slide */
export const DURATION_PER_SLIDE: Duration = Duration.ofSeconds(30);

/** Zeit nach Präsentationsende, nach der automatisch der Editor geöffnet wird */
export const EDITOR_REDIRECT_THRESHOLD: Duration = Duration.ofMinutes(5);

/**
 * How many change events do we keep, until we drop the oldest ones?
 */
export const CHANGE_SET_SIZE = 30;
