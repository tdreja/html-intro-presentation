import { describe, expect, it } from '@jest/globals';
import { LocalDateTime } from '@js-joda/core';
import {
    addChange,
    AddSlideEvent,
    applyChanges,
    ChangeEvent,
    ChangeSet,
    emptyChangeSet,
    redoLastChange,
    RemoveSlideEvent,
    revertLastChange,
    TargetChangeEvent,
    UpdateSlideContentEvent,
} from './ChangeEvent';
import { emptySlideshow, Slideshow } from './Slideshow';
import { CHANGE_SET_SIZE } from '../settings.ts';
import { Stack } from '../utils/Stack.ts';
import { toHtmlData } from './Html.ts';

// ── helpers ────────────────────────────────────────────────────────────────

function emptySlideShowWithSlides(count: number): Slideshow {
    const show = emptySlideshow();
    const slides = Array.from({ length: count }, () => ({
        id: crypto.randomUUID(),
        content: toHtmlData('<p>slide</p>'),
    }));
    return { ...show, slides };
}

/** Build a fresh ChangeSet from arrays (oldest → newest order). */
function makeChangeSet(applied: ChangeEvent[], pending: ChangeEvent[] = []): ChangeSet {
    const appliedStack = new Stack<ChangeEvent>(CHANGE_SET_SIZE);
    applied.forEach((e) => appliedStack.push(e));
    const pendingStack = new Stack<ChangeEvent>(CHANGE_SET_SIZE);
    pending.forEach((e) => pendingStack.push(e));
    return { appliedEvents: appliedStack, pendingEvents: pendingStack };
}

// ── emptyChangeSet ─────────────────────────────────────────────────────────

describe('emptyChangeSet', () => {
    const empty = emptyChangeSet();
    it('has empty appliedEvents', () => {
        expect(empty.appliedEvents.isEmpty()).toBe(true);
    });

    it('has empty pendingEvents', () => {
        expect(empty.pendingEvents.isEmpty()).toBe(true);
    });
});

// ── applyChanges ───────────────────────────────────────────────────────────

describe('applyChanges', () => {
    it('returns unchanged slideShow when no events', () => {
        const show = emptySlideshow();
        const result = applyChanges(show, makeChangeSet([]));
        expect(result).toBe(show);
    });

    it('applies events — Stack iterates newest first, so last-pushed runs first', () => {
        const show = emptySlideshow();
        const e1 = new AddSlideEvent('<p>A</p>');
        const e2 = new AddSlideEvent('<p>B</p>');
        // e1 pushed first, e2 second → iterator: e2 then e1
        const result = applyChanges(show, makeChangeSet([e1, e2]));
        expect(result.slides).toHaveLength(2);
        expect(result.slides[0].content).toBe('<p>B</p>');
        expect(result.slides[1].content).toBe('<p>A</p>');
    });

    it('returns Slideshow (not a tuple)', () => {
        const e = new AddSlideEvent('<p>X</p>');
        const result = applyChanges(emptySlideshow(), makeChangeSet([e]));
        expect(result.slides).toHaveLength(1);
    });
});

// ── addChange ──────────────────────────────────────────────────────────────

describe('addChange', () => {
    it('returns same changeSet when change is undefined', () => {
        const cs = makeChangeSet([]);
        expect(addChange(cs, undefined)).toBe(cs);
    });

    it('returns same changeSet when change is null', () => {
        const cs = makeChangeSet([]);
        expect(addChange(cs, null)).toBe(cs);
    });

    it('pushes event onto appliedEvents', () => {
        const cs = makeChangeSet([]);
        const event = new AddSlideEvent();
        addChange(cs, event);
        expect(cs.appliedEvents.size()).toBe(1);
        expect(cs.appliedEvents.peek()).toBe(event);
    });

    it('does NOT clear pendingEvents when new event added', () => {
        const future = new AddSlideEvent();
        const cs = makeChangeSet([], [future]);
        addChange(cs, new AddSlideEvent());
        expect(cs.pendingEvents.size()).toBe(1);
    });

    it(`caps appliedEvents at ${CHANGE_SET_SIZE}, dropping oldest`, () => {
        const cs = makeChangeSet([]);
        for (let i = 0; i < CHANGE_SET_SIZE; i++) {
            addChange(cs, new AddSlideEvent());
        }
        expect(cs.appliedEvents.size()).toBe(CHANGE_SET_SIZE);

        const newest = new AddSlideEvent();
        addChange(cs, newest);
        expect(cs.appliedEvents.size()).toBe(CHANGE_SET_SIZE);
        expect(cs.appliedEvents.peek()).toBe(newest);
    });
});

// ── revertLastChange ───────────────────────────────────────────────────────

describe('revertLastChange', () => {
    it('returns same changeSet when appliedEvents empty', () => {
        const cs = makeChangeSet([]);
        expect(revertLastChange(cs)).toBe(cs);
    });

    it('pops top of appliedEvents onto pendingEvents', () => {
        const e1 = new AddSlideEvent();
        const e2 = new AddSlideEvent();
        const cs = makeChangeSet([e1, e2]); // e1 bottom, e2 top
        revertLastChange(cs);
        expect(cs.appliedEvents.size()).toBe(1);
        expect(cs.appliedEvents.peek()).toBe(e1);
        expect(cs.pendingEvents.size()).toBe(1);
        expect(cs.pendingEvents.peek()).toBe(e2);
    });

    it('pushes reverted event on top of existing pendingEvents', () => {
        const e1 = new AddSlideEvent();
        const e2 = new AddSlideEvent();
        const e3 = new AddSlideEvent();
        // applied: e1 bottom, e2 top | pending: e3
        const cs = makeChangeSet([e1, e2], [e3]);
        revertLastChange(cs); // pop e2, push to pending → e3 bottom, e2 top
        const pending = [...cs.pendingEvents]; // iterator: newest first → [e2, e3]
        expect(pending[0]).toBe(e2);
        expect(pending[1]).toBe(e3);
    });
});

// ── redoLastChange ─────────────────────────────────────────────────────────

describe('redoLastChange', () => {
    it('returns same changeSet when pendingEvents empty', () => {
        const cs = makeChangeSet([]);
        expect(redoLastChange(cs)).toBe(cs);
    });

    it('pops top of pendingEvents onto appliedEvents', () => {
        const e1 = new AddSlideEvent();
        const e2 = new AddSlideEvent();
        const cs = makeChangeSet([e1], [e2]); // pending: e2
        redoLastChange(cs);
        expect(cs.pendingEvents.isEmpty()).toBe(true);
        expect(cs.appliedEvents.size()).toBe(2);
        expect(cs.appliedEvents.peek()).toBe(e2);
    });

    it('keeps remaining pendingEvents, last-in is re-applied first', () => {
        const e1 = new AddSlideEvent();
        const e2 = new AddSlideEvent();
        // pending: e1 bottom, e2 top → pop returns e2
        const cs = makeChangeSet([], [e1, e2]);
        redoLastChange(cs);
        expect(cs.pendingEvents.size()).toBe(1);
        expect(cs.pendingEvents.peek()).toBe(e1);
        expect(cs.appliedEvents.peek()).toBe(e2);
    });
});

// ── TargetChangeEvent ──────────────────────────────────────────────────────

describe('TargetChangeEvent', () => {
    it('has unique ChangeId', () => {
        expect(new TargetChangeEvent(null).id).not.toBe(new TargetChangeEvent(null).id);
    });

    it('sets countdownTarget to given LocalDateTime', () => {
        const target = LocalDateTime.of(2026, 1, 1, 12, 0);
        const result = new TargetChangeEvent(target).apply(emptySlideshow());
        expect(result.countdownTarget).toEqual(target);
    });

    it('sets countdownTarget to null', () => {
        const show = { ...emptySlideshow(), countdownTarget: LocalDateTime.of(2025, 6, 1, 9, 0) };
        const result = new TargetChangeEvent(null).apply(show);
        expect(result.countdownTarget).toBeNull();
    });

    it('moveToSlide is null', () => {
        expect(new TargetChangeEvent(null).moveToSlide).toBeNull();
    });
});

// ── AddSlideEvent ──────────────────────────────────────────────────────────

describe('AddSlideEvent', () => {
    it('has unique ChangeId', () => {
        expect(new AddSlideEvent().id).not.toBe(new AddSlideEvent().id);
    });

    it('appends new slide to slideShow', () => {
        const result = new AddSlideEvent('<p>hello</p>').apply(emptySlideshow());
        expect(result.slides).toHaveLength(1);
        expect(result.slides[0].content).toBe('<p>hello</p>');
    });

    it('moveToSlide equals the new slide id', () => {
        const event = new AddSlideEvent();
        const result = event.apply(emptySlideshow());
        expect(result.slides[0].id).toEqual(event.moveToSlide);
    });

    it('creates slide with default HTML content when called without args', () => {
        const result = new AddSlideEvent().apply(emptySlideshow());
        expect(result.slides[0].content).toBe(toHtmlData());
    });
});

// ── RemoveSlideEvent ───────────────────────────────────────────────────────

describe('RemoveSlideEvent', () => {
    it('has unique ChangeId', () => {
        const id = crypto.randomUUID();
        expect(new RemoveSlideEvent(id).id).not.toBe(new RemoveSlideEvent(id).id);
    });

    it('removes slide with matching id', () => {
        const show = emptySlideShowWithSlides(2);
        const targetId = show.slides[0].id;
        const result = new RemoveSlideEvent(targetId).apply(show);
        expect(result.slides).toHaveLength(1);
        expect(result.slides[0].id).toEqual(show.slides[1].id);
    });

    it('does not remove slide with non-matching id', () => {
        const show = emptySlideShowWithSlides(2);
        const result = new RemoveSlideEvent(crypto.randomUUID()).apply(show);
        expect(result.slides).toHaveLength(2);
    });

    it('moveToSlide is null', () => {
        expect(new RemoveSlideEvent(crypto.randomUUID()).moveToSlide).toBeNull();
    });
});

// ── UpdateSlideContentEvent ────────────────────────────────────────────────

describe('UpdateSlideContentEvent', () => {
    it('has unique ChangeId', () => {
        const id = crypto.randomUUID();
        expect(new UpdateSlideContentEvent(id).id).not.toBe(new UpdateSlideContentEvent(id).id);
    });

    it('updates content of matching slide', () => {
        const show = emptySlideShowWithSlides(2);
        const targetId = show.slides[0].id;
        const result = new UpdateSlideContentEvent(targetId, '<p>new</p>').apply(show);
        expect(result.slides[0].content).toBe('<p>new</p>');
        expect(result.slides[1].content).toBe(show.slides[1].content);
    });

    it('does not modify other slides', () => {
        const show = emptySlideShowWithSlides(3);
        const targetId = show.slides[1].id;
        const result = new UpdateSlideContentEvent(targetId, '<b>x</b>').apply(show);
        expect(result.slides[0].content).toBe(show.slides[0].content);
        expect(result.slides[2].content).toBe(show.slides[2].content);
    });

    it('moveToSlide equals the target slide id', () => {
        const id = crypto.randomUUID();
        expect(new UpdateSlideContentEvent(id, '<p>x</p>').moveToSlide).toEqual(id);
    });
});
