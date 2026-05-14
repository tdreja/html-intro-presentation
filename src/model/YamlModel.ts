import { earliestSlideshow, emptySlideshow, Slideshow } from './Slideshow.ts';
import { Slide } from './Slide.ts';
import { toUuidV4OrRandom } from './UuidV4.ts';
import { toHtmlData } from './Html.ts';
import { LocalDateTime } from '@js-joda/core';
import { fromLocalDateTime, toLocalDateTime } from '../utils/DateTimeUtils.ts';

/**
 * A date from the YAML file could be any of that
 */
export type YamlLocalDateTime = string | number | Date | LocalDateTime;

/**
 * A yaml slide may contain content or the fields may be missing!
 */
export interface YamlSlide {
    readonly content?: string | null,
    readonly id?: string | null,
}

/**
 * A yaml slideshow may contain slides or the fields may be missing!
 */
export interface YamlSlideshow {
    readonly id?: string | null,
    readonly slides?: Array<YamlSlide | null | undefined> | null,
    readonly countdownTarget?: YamlLocalDateTime | null,
    readonly lastUpdate?: YamlLocalDateTime | null,
}

function toYamlSlide(slide: Slide): YamlSlide {
    return {
        ...slide,
    };
}

export function toYaml(slideshow: Slideshow): YamlSlideshow {
    return {
        id: slideshow.id,
        slides: slideshow.slides.map(toYamlSlide),
        countdownTarget: slideshow.countdownTarget ? fromLocalDateTime(slideshow.countdownTarget) : null,
        lastUpdate: slideshow.lastUpdate ? fromLocalDateTime(slideshow.lastUpdate) : earliestSlideshow,
    };
}

export function fromYaml(yaml?: YamlSlideshow | null): Slideshow {
    if (!yaml) {
        return emptySlideshow();
    }
    const id = toUuidV4OrRandom(yaml.id);
    const slides: Array<Slide> = [];
    for (const slide of (yaml.slides || [])) {
        if (slide) {
            const slideId = toUuidV4OrRandom(slide.id);
            const content = toHtmlData(slide.content);
            slides.push({ id: slideId, content });
        }
    }
    const countdownTarget = toLocalDateTime(yaml.countdownTarget);
    const lastUpdate = toLocalDateTime(yaml.lastUpdate)!;
    return {
        id,
        slides,
        countdownTarget,
        lastUpdate,
    };
}
