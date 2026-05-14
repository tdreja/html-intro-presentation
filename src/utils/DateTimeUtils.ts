import { DateTimeFormatter, LocalDateTime, nativeJs } from '@js-joda/core';
import { YamlLocalDateTime } from '../model/YamlModel.ts';

const FORM_FORMAT: DateTimeFormatter = DateTimeFormatter.ofPattern('yyyy-MM-dd\'T\'HH:mm');

export function toLocalDateTime(input?: YamlLocalDateTime | null): LocalDateTime | null {
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

export function fromLocalDateTime(input?: YamlLocalDateTime | null): string | null {
    const localDateTime = toLocalDateTime(input);
    return localDateTime ? localDateTime.format(FORM_FORMAT) : null;
}

export function fromLocalDateTimeOr(fallback: LocalDateTime, input?: YamlLocalDateTime | null): string {
    const output = fromLocalDateTime(input);
    return output ? output : fallback.format(FORM_FORMAT);
}
