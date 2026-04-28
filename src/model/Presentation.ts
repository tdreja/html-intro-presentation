export type Html = string;

export interface Slide {
    content: Html,
}

export interface Presentation {
    slides: Slide[],
    target: Date,
}

export type JsonSlide = Partial<Slide>;

export interface JsonPresentation {
    slides?: JsonSlide[],
    target?: string | number | Date,
}

export function toJson(presentation?: Presentation | null): JsonPresentation {
    if (!presentation) {
        return {};
    }
    return {
        slides: presentation.slides,
        target: presentation.target.toISOString(),
    };
}

function oneHourAgo(): Date {
    const date = new Date();
    date.setHours(date.getHours() - 1);
    return date;
}

export function fromJson(json?: JsonPresentation | null): Presentation {
    if (!json) {
        return {
            slides: [],
            target: oneHourAgo(),
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
    return {
        slides,
        target: json.target ? new Date(json.target) : oneHourAgo(),
    };
}

export const inactivePresentation: Presentation = {
    slides: [],
    target: oneHourAgo(),
};
