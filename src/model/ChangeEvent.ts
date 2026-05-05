import { LocalDateTime } from '@js-joda/core';
import { isEqual, TypeContainer, uniqueIdentifier } from './TypeContainer.ts';
import { SlideShow } from './SlideShow.ts';
import { asHtml, getNextSlideId, Html, Slide, SlideId } from './Slide.ts';
import { CHANGE_SET_SIZE } from '../settings.ts';

export type ChangeId = TypeContainer<string> & {
    value: `${string}-${string}-${string}-${string}-${string}`,
    typeId: 'ChangeId',
};

export interface ChangeEvent {
    readonly id: ChangeId,
    readonly apply: (slideShow: SlideShow, editedSlideId: SlideId | null) => [SlideShow, SlideId | null],
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
    slideShow: SlideShow,
    editedSlideId: SlideId | null,
    changeSet: ChangeSet,
): [SlideShow, SlideId | null] {
    let editShow = slideShow;
    let editSlId = editedSlideId;
    for (const event of changeSet.previousEvents) {
        [editShow, editSlId] = event.apply(editShow, editSlId);
    }
    return [editShow, editSlId];
}

export function addChange(changes: ChangeSet, change?: ChangeEvent | null): ChangeSet {
    if (!change) {
        return changes;
    }
    const previousEvents = [...changes.previousEvents, change];
    if (previousEvents.length > CHANGE_SET_SIZE) {
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

abstract class AbstractChangeEvent implements ChangeEvent {
    protected readonly _id: ChangeId;

    protected constructor() {
        this._id = uniqueIdentifier('ChangeId');
    }

    public get id(): ChangeId {
        return this._id;
    }

    public abstract apply(slideShow: SlideShow, editedSlideId: SlideId | null): [SlideShow, SlideId | null];
}

export class TargetChangeEvent extends AbstractChangeEvent {
    private readonly _target: LocalDateTime | null;

    public constructor(target: LocalDateTime | null) {
        super();
        this._target = target;
    }

    public apply(slideShow: SlideShow, editedSlideId: SlideId | null): [SlideShow, SlideId | null] {
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
            id: getNextSlideId(),
            content: asHtml(content),
        };
    }

    public apply(slideShow: SlideShow): [SlideShow, SlideId | null] {
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

    public apply(slideShow: SlideShow, editedSlideId: SlideId | null): [SlideShow, SlideId | null] {
        const slides: Array<Slide> = slideShow.slides.filter((slide) => !isEqual(slide.id, this._slideId));
        const nextEditedSlide = isEqual(this._slideId, editedSlideId) ? null : editedSlideId;
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
    private readonly _content: Html;

    public constructor(id: SlideId, content?: string | null) {
        super();
        this._slideId = id;
        this._content = asHtml(content);
    }

    public apply(slideShow: SlideShow, editedSlideId: SlideId | null): [SlideShow, SlideId | null] {
        const slides: Array<Slide> = [];
        for (const slide of slideShow.slides) {
            if (isEqual(slide.id, this._slideId)) {
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

    public apply(slideShow: SlideShow): [SlideShow, SlideId | null] {
        return [slideShow, this._slideId];
    }
}
