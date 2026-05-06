import { LocalDateTime } from '@js-joda/core';
import { Slideshow } from './Slideshow.ts';
import { asHtml, HtmlData, Slide, SlideId } from './Slide.ts';
import { CHANGE_SET_SIZE } from '../settings.ts';

export type ChangeEventId = `${string}-${string}-${string}-${string}-${string}`;

export interface ChangeEvent {
    readonly id: ChangeEventId,
    readonly apply: (slideShow: Slideshow, editedSlideId: SlideId | null) => [Slideshow, SlideId | null],
}

export interface ChangeSet {
    /**
     * Events that can be reverted by Ctrl-Z
     */
    readonly appliedEvents: Array<ChangeEvent>,
    /**
     * Events that can be recreated by Ctrl-Y
     */
    readonly pendingEvents: Array<ChangeEvent>,
}

export const emptyChangeSet: ChangeSet = {
    appliedEvents: [],
    pendingEvents: [],
};

export function applyChanges(
    slideShow: Slideshow,
    editedSlideId: SlideId | null,
    changeSet: ChangeSet,
): [Slideshow, SlideId | null] {
    let editShow = slideShow;
    let editSlId = editedSlideId;
    for (const event of changeSet.appliedEvents) {
        [editShow, editSlId] = event.apply(editShow, editSlId);
    }
    return [editShow, editSlId];
}

export function addChange(changes: ChangeSet, change?: ChangeEvent | null): ChangeSet {
    if (!change) {
        return changes;
    }
    const previousEvents = [...changes.appliedEvents, change];
    if (previousEvents.length > CHANGE_SET_SIZE) {
        return {
            appliedEvents: previousEvents.slice(1),
            pendingEvents: [],
        };
    }
    return {
        appliedEvents: previousEvents,
        pendingEvents: [],
    };
}

export function revertLastChange(changes: ChangeSet): ChangeSet {
    if (changes.appliedEvents.length === 0) {
        return changes;
    }
    const previousEvents = [...changes.appliedEvents];
    const futureEvents = [...changes.pendingEvents];
    const lastEvent = previousEvents.pop()!;
    futureEvents.unshift(lastEvent);
    return {
        appliedEvents: previousEvents,
        pendingEvents: futureEvents,
    };
}

export function redoLastChange(changes: ChangeSet): ChangeSet {
    if (changes.pendingEvents.length === 0) {
        return changes;
    }
    const previousEvents = [...changes.appliedEvents];
    const futureEvents = [...changes.pendingEvents];
    const nextEvent = futureEvents.shift()!;
    previousEvents.push(nextEvent);
    return {
        appliedEvents: previousEvents,
        pendingEvents: futureEvents,
    };
}

abstract class AbstractChangeEvent implements ChangeEvent {
    protected readonly _id: ChangeEventId;

    protected constructor() {
        this._id = crypto.randomUUID();
    }

    public get id(): ChangeEventId {
        return this._id;
    }

    public abstract apply(slideShow: Slideshow, editedSlideId: SlideId | null): [Slideshow, SlideId | null];
}

export class TargetChangeEvent extends AbstractChangeEvent {
    private readonly _target: LocalDateTime | null;

    public constructor(target: LocalDateTime | null) {
        super();
        this._target = target;
    }

    public apply(slideShow: Slideshow, editedSlideId: SlideId | null): [Slideshow, SlideId | null] {
        return [
            {
                ...slideShow,
                countdownTarget: this._target,
            },
            editedSlideId,
        ];
    }
}

export class AddSlideEvent extends AbstractChangeEvent {
    private readonly _slide: Slide;

    public constructor(content?: string | null) {
        super();
        this._slide = {
            id: crypto.randomUUID(),
            content: asHtml(content),
        };
    }

    public apply(slideShow: Slideshow): [Slideshow, SlideId | null] {
        return [
            {
                ...slideShow,
                slides: [...slideShow.slides, this._slide],
            },
            this._slide.id,
        ];
    }
}

export class RemoveSlideEvent extends AbstractChangeEvent {
    private readonly _slideId: SlideId;

    public constructor(id: SlideId) {
        super();
        this._slideId = id;
    }

    public apply(slideShow: Slideshow, editedSlideId: SlideId | null): [Slideshow, SlideId | null] {
        const slides: Array<Slide> = slideShow.slides.filter((slide) => slide.id !== this._slideId);
        const nextEditedSlide = this._slideId === editedSlideId ? null : editedSlideId;
        return [
            {
                ...slideShow,
                slides: slides,
            },
            nextEditedSlide,
        ];
    }
}

export class UpdateSlideContentEvent extends AbstractChangeEvent {
    private readonly _slideId: SlideId;
    private readonly _content: HtmlData;

    public constructor(id: SlideId, content?: string | null) {
        super();
        this._slideId = id;
        this._content = asHtml(content);
    }

    public apply(slideShow: Slideshow, editedSlideId: SlideId | null): [Slideshow, SlideId | null] {
        const slides: Array<Slide> = [];
        for (const slide of slideShow.slides) {
            if (this._slideId === slide.id) {
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
                ...slideShow,
                slides: slides,
            },
            editedSlideId,
        ];
    }
}

export class UpdateSelectedSlideEvent extends AbstractChangeEvent {
    private readonly _slideId: SlideId | null;

    public constructor(slideId: SlideId | null) {
        super();
        this._slideId = slideId;
    }

    public apply(slideShow: Slideshow): [Slideshow, SlideId | null] {
        return [slideShow, this._slideId];
    }
}
