import { LocalDateTime } from '@js-joda/core';
import { Slideshow } from './Slideshow.ts';
import { Slide, SlideId } from './Slide.ts';
import { CHANGE_SET_SIZE } from '../settings.ts';
import { I18N } from '../i18n/I18N.ts';
import { Stack } from '../utils/Stack.ts';
import { asHtml, HtmlData } from './Html.ts';

export type ChangeEventId = `${string}-${string}-${string}-${string}-${string}`;

export interface ChangeEvent {
    /**
     * Unique ID of the event itself
     */
    readonly id: ChangeEventId,
    /**
     * Is the event moving the UI to another slide?
     */
    readonly moveToSlide: SlideId | null,
    /**
     * Apply the event to the slideshow
     */
    readonly apply: (slideShow: Slideshow) => Slideshow,
    /**
     * Describe the event
     */
    readonly describe: (i18n: I18N) => string,
}

export interface ChangeSet {
    /**
     * Events that can be reverted by Ctrl-Z
     */
    readonly appliedEvents: Stack<ChangeEvent>,
    /**
     * Events that can be recreated by Ctrl-Y
     */
    readonly pendingEvents: Stack<ChangeEvent>,
}

export const emptyChangeSet: ChangeSet = {
    appliedEvents: new Stack<ChangeEvent>(CHANGE_SET_SIZE),
    pendingEvents: new Stack<ChangeEvent>(CHANGE_SET_SIZE),
};

export function applyChanges(
    slideShow: Slideshow,
    changeSet: ChangeSet,
): Slideshow {
    let editShow = slideShow;
    for (const event of changeSet.appliedEvents) {
        editShow = event.apply(editShow);
    }
    return editShow;
}

export function addChange(changes: ChangeSet, change?: ChangeEvent | null): ChangeSet {
    if (!change) {
        return changes;
    }
    changes.appliedEvents.push(change);
    return {
        ...changes,
    };
}

export function revertLastChange(changes: ChangeSet): ChangeSet {
    const lastChange = changes.appliedEvents.pop();
    if (!lastChange) {
        return changes;
    }
    changes.pendingEvents.push(lastChange);
    return {
        ...changes,
    };
}

export function redoLastChange(changes: ChangeSet): ChangeSet {
    const pendingChange = changes.pendingEvents.pop();
    if (!pendingChange) {
        return changes;
    }
    changes.appliedEvents.push(pendingChange);
    return {
        ...changes,
    };
}

abstract class AbstractChangeEvent implements ChangeEvent {
    protected readonly _id: ChangeEventId;
    protected readonly _moveToSlide: SlideId | null;

    protected constructor(moveToSlide: SlideId | null) {
        this._id = crypto.randomUUID();
        this._moveToSlide = moveToSlide;
    }

    public get id(): ChangeEventId {
        return this._id;
    }

    public get moveToSlide(): SlideId | null {
        return this._moveToSlide;
    }

    public abstract apply(slideShow: Slideshow): Slideshow;

    public abstract describe(i18n: I18N): string;
}

export class TargetChangeEvent extends AbstractChangeEvent {
    private readonly _target: LocalDateTime | null;

    public constructor(target: LocalDateTime | null) {
        super(null);
        this._target = target;
    }

    public apply(slideShow: Slideshow): Slideshow {
        return {
            ...slideShow,
            countdownTarget: this._target,
        };
    }

    public describe(i18n: I18N): string {
        return i18n.changeEvent.changeTarget;
    }
}

export class AddSlideEvent extends AbstractChangeEvent {
    private readonly _slide: Slide;

    public constructor(content?: string | null) {
        super(crypto.randomUUID());
        this._slide = {
            id: this._moveToSlide!,
            content: asHtml(content),
        };
    }

    public get moveToSlide(): SlideId {
        return this._moveToSlide!;
    }

    public apply(slideShow: Slideshow): Slideshow {
        return {
            ...slideShow,
            slides: [...slideShow.slides, this._slide],
        };
    }

    public describe(i18n: I18N): string {
        return i18n.changeEvent.addSlide;
    }
}

export class RemoveSlideEvent extends AbstractChangeEvent {
    private readonly _removedSlide: SlideId;
    public constructor(id: SlideId) {
        super(null);
        this._removedSlide = id;
    }

    public get moveToSlide(): null {
        return null;
    }

    public apply(slideShow: Slideshow): Slideshow {
        const slides: Array<Slide> = slideShow.slides.filter((slide) => slide.id !== this._removedSlide);
        return {
            ...slideShow,
            slides: slides,
        };
    }

    public describe(i18n: I18N): string {
        return i18n.changeEvent.removeSlide;
    }
}

export class UpdateSlideContentEvent extends AbstractChangeEvent {
    private readonly _content: HtmlData;

    public constructor(id: SlideId, content?: string | null) {
        super(id);
        this._content = asHtml(content);
    }

    public get moveToSlide(): SlideId {
        return this._moveToSlide!;
    }

    public apply(slideShow: Slideshow): Slideshow {
        const slides: Array<Slide> = [];
        for (const slide of slideShow.slides) {
            if (this.moveToSlide === slide.id) {
                slides.push({
                    ...slide,
                    content: this._content,
                });
            } else {
                slides.push(slide);
            }
        }
        return {
            ...slideShow,
            slides: slides,
        };
    }

    public describe(i18n: I18N): string {
        return i18n.changeEvent.updateSlide;
    }
}
