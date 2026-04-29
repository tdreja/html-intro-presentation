import { LocalDateTime } from '@js-joda/core';
import { LocalDateTimeInput, printLocalDateTime, toLocalDateTime } from '../utils/DateTimeUtils.ts';

export type Html = string;

export interface Slide {
    content: Html,
}

export interface Presentation {
    slides: Slide[],
    target: LocalDateTime,
}

export type JsonSlide = Partial<Slide>;

export interface JsonPresentation {
    slides?: JsonSlide[],
    target?: LocalDateTimeInput | null,
}

export function toJson(presentation?: Presentation | null): JsonPresentation {
    if (!presentation) {
        return {};
    }
    return {
        slides: presentation.slides,
        target: printLocalDateTime(presentation.target),
    };
}

export function fromJson(json?: JsonPresentation | null): Presentation {
    if (!json) {
        return {
            slides: [],
            target: LocalDateTime.now().minusMinutes(1),
        };
    }
    const slides: Array<Slide> = [];
    if (json.slides) {
        for (const slide of json.slides) {
            if (slide.content) {
                slides.push({
                    content: slide.content,
                });
            }
        }
    }
    const target: LocalDateTime | null = toLocalDateTime(json.target);
    return {
        slides,
        target: target || LocalDateTime.now().minusMinutes(1),
    };
}

export const inactivePresentation: Presentation = {
    slides: [],
    target: LocalDateTime.now().minusMinutes(1),
};
