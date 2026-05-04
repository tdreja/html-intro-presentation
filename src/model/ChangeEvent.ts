import { LocalDateTime } from '@js-joda/core';
import { Presentation, Slide } from './Presentation.ts';

export interface ChangeEvent {
    readonly apply: (editedPresentation: Presentation, editedSlide: LocalDateTime | null) => [Presentation, LocalDateTime | null],
}

export interface ChangeSet {
    /**
     * Events that can be reverted by Ctrl-Z
     */
    readonly previousEvents: Array<ChangeEvent>,
    /**
     * Events that can be recreated by Ctrl-Y
     */
    readonly futureEvents: Array<ChangeEvent>,
}

export const emptyChangeSet: ChangeSet = {
    previousEvents: [],
    futureEvents: [],
};

export function applyChanges(
    presentation: Presentation,
    editedSlide: LocalDateTime | null,
    changeSet: ChangeSet,
): [Presentation, LocalDateTime | null] {
    let editedPresentation = presentation;
    let nextEditedSlide = editedSlide;
    for (const event of changeSet.previousEvents) {
        [editedPresentation, nextEditedSlide] = event.apply(editedPresentation, nextEditedSlide);
    }
    return [editedPresentation, nextEditedSlide];
}

export function addChange(changes: ChangeSet, change?: ChangeEvent | null): ChangeSet {
    if (!change) {
        return changes;
    }
    const previousEvents = [...changes.previousEvents, change];
    if (previousEvents.length > 20) {
        return {
            previousEvents: previousEvents.slice(1),
            futureEvents: [],
        };
    }
    return {
        previousEvents,
        futureEvents: [],
    };
}

export function revertLastChange(changes: ChangeSet): ChangeSet {
    if (changes.previousEvents.length === 0) {
        return changes;
    }
    const previousEvents = [...changes.previousEvents];
    const futureEvents = [...changes.futureEvents];
    const lastEvent = previousEvents.pop()!;
    futureEvents.unshift(lastEvent);
    return {
        previousEvents,
        futureEvents,
    };
}

export function redoLastChange(changes: ChangeSet): ChangeSet {
    if (changes.futureEvents.length === 0) {
        return changes;
    }
    const previousEvents = [...changes.previousEvents];
    const futureEvents = [...changes.futureEvents];
    const nextEvent = futureEvents.shift()!;
    previousEvents.push(nextEvent);
    return {
        previousEvents,
        futureEvents,
    };
}

export class TargetChangeEvent implements ChangeEvent {
    private readonly _target: LocalDateTime;

    public constructor(target: LocalDateTime) {
        this._target = target;
    }

    public apply(editedPresentation: Presentation, editedSlide: LocalDateTime | null): [Presentation, LocalDateTime | null] {
        return [
            {
                ...editedPresentation,
                target: this._target,
            },
            editedSlide,
        ];
    }
}

export class AddSlideEvent implements ChangeEvent {
    private readonly _slide: Slide;

    public constructor(content: string) {
        this._slide = {
            id: LocalDateTime.now(),
            content: content,
        };
    }

    public apply(editedPresentation: Presentation): [Presentation, LocalDateTime | null] {
        return [
            {
                ...editedPresentation,
                slides: [...editedPresentation.slides, this._slide],
            }, this._slide.id,
        ];
    }
}

export class RemoveSlideEvent implements ChangeEvent {
    private readonly _id: LocalDateTime;

    public constructor(id: LocalDateTime) {
        this._id = id;
    }

    public apply(editedPresentation: Presentation, editedSlide: LocalDateTime | null): [Presentation, LocalDateTime | null] {
        const slides: Array<Slide> = editedPresentation.slides.filter((slide) => slide.id !== this._id);
        const nextEditedSlide = (editedSlide === this._id) ? null : editedSlide;
        return [
            {
                ...editedPresentation,
                slides: slides,
            },
            nextEditedSlide,
        ];
    }
}

export class UpdateSlideContentEvent implements ChangeEvent {
    private readonly _id: LocalDateTime;
    private readonly _content: string;

    public constructor(id: LocalDateTime, content: string) {
        this._id = id;
        this._content = content;
    }

    public apply(editedPresentation: Presentation, editedSlide: LocalDateTime | null): [Presentation, LocalDateTime | null] {
        const slides: Array<Slide> = [];
        for (const slide of editedPresentation.slides) {
            if (slide.id === this._id) {
                slides.push({
                    ...slide,
                    content: this._content,
                });
            } else {
                slides.push(slide);
            }
        }
        return [
            {
                ...editedPresentation,
                slides: slides,
            },
            editedSlide,
        ];
    }
}

export class UpdateSelectedSlideEvent implements ChangeEvent {
    private readonly _id: LocalDateTime | null;

    public constructor(id: LocalDateTime | null) {
        this._id = id;
    }

    public apply(editedPresentation: Presentation): [Presentation, LocalDateTime | null] {
        return [editedPresentation, this._id];
    }
}
