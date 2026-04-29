import { DateTimeFormatter, LocalDateTime, nativeJs } from '@js-joda/core';

const formFormat: DateTimeFormatter = DateTimeFormatter.ofPattern('yyyy-MM-dd\'T\'HH:mm');

export type LocalDateTimeInput = string | number | Date | LocalDateTime;

export function toLocalDateTime(input?: LocalDateTimeInput | null): LocalDateTime | null {
    if (!input) {
        return null;
    }
    if (input instanceof LocalDateTime) {
        return input;
    }
    let jsDate: Date | null = null;
    if (typeof input === 'string' || typeof input === 'number') {
        jsDate = new Date(input);
    } else if (input instanceof Date) {
        jsDate = input;
    }
    if (jsDate && !isNaN(jsDate.getTime())) {
        return LocalDateTime.from(nativeJs(jsDate));
    }
    return null;
}

export function printLocalDateTime(input?: LocalDateTimeInput | null, fallback?: LocalDateTime): string {
    let localDateTime = toLocalDateTime(input);
    if (!localDateTime) {
        if (fallback) {
            localDateTime = fallback;
        } else {
            localDateTime = LocalDateTime.now();
        }
    }
    return localDateTime.format(formFormat);
}
