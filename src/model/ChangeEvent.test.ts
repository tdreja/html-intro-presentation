import { describe, expect, it } from '@jest/globals';
import { LocalDateTime } from '@js-joda/core';
import {
    addChange,
    AddSlideEvent,
    applyChanges,
    emptyChangeSet,
    redoLastChange,
    RemoveSlideEvent,
    revertLastChange,
    TargetChangeEvent,
    UpdateSelectedSlideEvent,
    UpdateSlideContentEvent,
} from './ChangeEvent';
import { emptySlideshow } from './Slideshow';
import { asHtml } from './Slide';
import { CHANGE_SET_SIZE } from '../settings.ts';

// ── helpers ────────────────────────────────────────────────────────────────
function emptySlideShowWithSlides(count: number) {
    const show = emptySlideshow();
    const slides = Array.from({ length: count }, () => ({
        id: crypto.randomUUID(),
        content: asHtml('<p>slide</p>'),
    }));
    return { ...show, slides };
}

// ── emptyChangeSet ─────────────────────────────────────────────────────────

describe('emptyChangeSet', () => {
    it('has empty previousEvents', () => {
        expect(emptyChangeSet.appliedEvents).toHaveLength(0);
    });

    it('has empty futureEvents', () => {
        expect(emptyChangeSet.pendingEvents).toHaveLength(0);
    });
});

// ── applyChanges ───────────────────────────────────────────────────────────

describe('applyChanges', () => {
    it('returns unchanged slideShow when no events', () => {
        const show = emptySlideshow();
        const [result] = applyChanges(show, null, emptyChangeSet);
        expect(result).toBe(show);
    });

    it('applies multiple events in order', () => {
        const show = emptySlideshow();
        const e1 = new AddSlideEvent('<p>A</p>');
        const e2 = new AddSlideEvent('<p>B</p>');
        const changeSet = { previousEvents: [e1, e2], futureEvents: [] };
        const [result] = applyChanges(show, null, changeSet);
        expect(result.slides).toHaveLength(2);
        expect(result.slides[0].content).toBe('<p>A</p>');
        expect(result.slides[1].content).toBe('<p>B</p>');
    });

    it('threads editedSlideId through events', () => {
        const show = emptySlideshow();
        const e1 = new AddSlideEvent();
        const changeSet = { previousEvents: [e1], futureEvents: [] };
        const [resultShow, resultId] = applyChanges(show, null, changeSet);
        expect(resultId).not.toBeNull();
        expect(resultShow.slides[0].id).toEqual(resultId);
    });
});

// ── addChange ──────────────────────────────────────────────────────────────

describe('addChange', () => {
    it('returns same changeSet when change is undefined', () => {
        const result = addChange(emptyChangeSet, undefined);
        expect(result).toBe(emptyChangeSet);
    });

    it('returns same changeSet when change is null', () => {
        const result = addChange(emptyChangeSet, null);
        expect(result).toBe(emptyChangeSet);
    });

    it('appends event to previousEvents', () => {
        const event = new AddSlideEvent();
        const result = addChange(emptyChangeSet, event);
        expect(result.appliedEvents).toHaveLength(1);
        expect(result.appliedEvents[0]).toBe(event);
    });

    it('clears futureEvents when new event added', () => {
        const existing = new AddSlideEvent();
        const future = new AddSlideEvent();
        const changeSet = { previousEvents: [existing], futureEvents: [future] };
        const result = addChange(changeSet, new AddSlideEvent());
        expect(result.pendingEvents).toHaveLength(0);
    });

    it(`caps previousEvents at ${CHANGE_SET_SIZE}, dropping oldest`, () => {
        let changeSet = emptyChangeSet;
        for (let i = 0; i < CHANGE_SET_SIZE; i++) {
            changeSet = addChange(changeSet, new AddSlideEvent());
        }
        expect(changeSet.appliedEvents).toHaveLength(CHANGE_SET_SIZE);
        const oldest = changeSet.appliedEvents[0];
        const newChange = new AddSlideEvent();
        changeSet = addChange(changeSet, newChange);
        expect(changeSet.appliedEvents).toHaveLength(CHANGE_SET_SIZE);
        expect(changeSet.appliedEvents[0]).not.toBe(oldest);
        expect(changeSet.appliedEvents[CHANGE_SET_SIZE - 1]).toBe(newChange);
    });
});

// ── revertLastChange ───────────────────────────────────────────────────────

describe('revertLastChange', () => {
    it('returns same changeSet when previousEvents empty', () => {
        const result = revertLastChange(emptyChangeSet);
        expect(result).toBe(emptyChangeSet);
    });

    it('moves last previousEvent to front of futureEvents', () => {
        const e1 = new AddSlideEvent();
        const e2 = new AddSlideEvent();
        const changeSet = { previousEvents: [e1, e2], futureEvents: [] };
        const result = revertLastChange(changeSet);
        expect(result.appliedEvents).toHaveLength(1);
        expect(result.appliedEvents[0]).toBe(e1);
        expect(result.pendingEvents).toHaveLength(1);
        expect(result.pendingEvents[0]).toBe(e2);
    });

    it('prepends to existing futureEvents', () => {
        const e1 = new AddSlideEvent();
        const e2 = new AddSlideEvent();
        const e3 = new AddSlideEvent();
        const changeSet = { previousEvents: [e1, e2], futureEvents: [e3] };
        const result = revertLastChange(changeSet);
        expect(result.pendingEvents[0]).toBe(e2);
        expect(result.pendingEvents[1]).toBe(e3);
    });
});

// ── redoLastChange ─────────────────────────────────────────────────────────

describe('redoLastChange', () => {
    it('returns same changeSet when futureEvents empty', () => {
        const result = redoLastChange(emptyChangeSet);
        expect(result).toBe(emptyChangeSet);
    });

    it('moves first futureEvent to end of previousEvents', () => {
        const e1 = new AddSlideEvent();
        const e2 = new AddSlideEvent();
        const changeSet = { previousEvents: [e1], futureEvents: [e2] };
        const result = redoLastChange(changeSet);
        expect(result.pendingEvents).toHaveLength(0);
        expect(result.appliedEvents).toHaveLength(2);
        expect(result.appliedEvents[1]).toBe(e2);
    });

    it('keeps remaining futureEvents in order', () => {
        const e1 = new AddSlideEvent();
        const e2 = new AddSlideEvent();
        const changeSet = { previousEvents: [], futureEvents: [e1, e2] };
        const result = redoLastChange(changeSet);
        expect(result.pendingEvents).toHaveLength(1);
        expect(result.pendingEvents[0]).toBe(e2);
        expect(result.appliedEvents[0]).toBe(e1);
    });
});

// ── TargetChangeEvent ──────────────────────────────────────────────────────

describe('TargetChangeEvent', () => {
    it('has unique ChangeId', () => {
        const e1 = new TargetChangeEvent(null);
        const e2 = new TargetChangeEvent(null);
        expect(e1.id).not.toBe(e2.id);
    });

    it('sets countdownTarget to given LocalDateTime', () => {
        const target = LocalDateTime.of(2026, 1, 1, 12, 0);
        const show = emptySlideshow();
        const [result] = new TargetChangeEvent(target).apply(show, null);
        expect(result.countdownTarget).toEqual(target);
    });

    it('sets countdownTarget to null', () => {
        const show = { ...emptySlideshow(), countdownTarget: LocalDateTime.of(2025, 6, 1, 9, 0) };
        const [result] = new TargetChangeEvent(null).apply(show, null);
        expect(result.countdownTarget).toBeNull();
    });

    it('preserves editedSlideId', () => {
        const id = crypto.randomUUID();
        const [, resultId] = new TargetChangeEvent(null).apply(emptySlideshow(), id);
        expect(resultId).toBe(id);
    });
});

// ── AddSlideEvent ──────────────────────────────────────────────────────────

describe('AddSlideEvent', () => {
    it('has unique ChangeId', () => {
        const e1 = new AddSlideEvent();
        const e2 = new AddSlideEvent();
        expect(e1.id).not.toBe(e2.id);
    });

    it('appends new slide to slideShow', () => {
        const show = emptySlideshow();
        const [result] = new AddSlideEvent('<p>hello</p>').apply(show);
        expect(result.slides).toHaveLength(1);
        expect(result.slides[0].content).toBe('<p>hello</p>');
    });

    it('sets editedSlideId to new slide id', () => {
        const show = emptySlideshow();
        const [result, slideId] = new AddSlideEvent().apply(show);
        expect(slideId).not.toBeNull();
        expect(result.slides[0].id).toEqual(slideId);
    });

    it('creates slide with empty content when called without args', () => {
        const [result] = new AddSlideEvent().apply(emptySlideshow());
        expect(result.slides[0].content).toBe('');
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
        const [result] = new RemoveSlideEvent(targetId).apply(show, null);
        expect(result.slides).toHaveLength(1);
        expect(result.slides[0].id).toEqual(show.slides[1].id);
    });

    it('clears editedSlideId when removed slide was selected', () => {
        const show = emptySlideShowWithSlides(2);
        const targetId = show.slides[0].id;
        const [, resultId] = new RemoveSlideEvent(targetId).apply(show, targetId);
        expect(resultId).toBeNull();
    });

    it('preserves editedSlideId when it refers to different slide', () => {
        const show = emptySlideShowWithSlides(2);
        const removeId = show.slides[0].id;
        const keepId = show.slides[1].id;
        const [, resultId] = new RemoveSlideEvent(removeId).apply(show, keepId);
        expect(resultId).toEqual(keepId);
    });
});

// ── UpdateSlideContentEvent ────────────────────────────────────────────────

describe('UpdateSlideContentEvent', () => {
    it('has unique ChangeId', () => {
        const id = crypto.randomUUID();
        expect(new UpdateSlideContentEvent(id).id).not.toBe(
            new UpdateSlideContentEvent(id).id,
        );
    });

    it('updates content of matching slide', () => {
        const show = emptySlideShowWithSlides(2);
        const targetId = show.slides[0].id;
        const [result] = new UpdateSlideContentEvent(targetId, '<p>new</p>').apply(show, null);
        expect(result.slides[0].content).toBe('<p>new</p>');
        expect(result.slides[1].content).toBe(show.slides[1].content);
    });

    it('does not modify other slides', () => {
        const show = emptySlideShowWithSlides(3);
        const targetId = show.slides[1].id;
        const [result] = new UpdateSlideContentEvent(targetId, '<b>x</b>').apply(show, null);
        expect(result.slides[0].content).toBe(show.slides[0].content);
        expect(result.slides[2].content).toBe(show.slides[2].content);
    });

    it('preserves editedSlideId', () => {
        const show = emptySlideShowWithSlides(1);
        const targetId = show.slides[0].id;
        const otherId = crypto.randomUUID();
        const [, resultId] = new UpdateSlideContentEvent(targetId, '<p>x</p>').apply(show, otherId);
        expect(resultId).toEqual(otherId);
    });
});

// ── UpdateSelectedSlideEvent ───────────────────────────────────────────────

describe('UpdateSelectedSlideEvent', () => {
    it('has unique ChangeId', () => {
        const e1 = new UpdateSelectedSlideEvent(null);
        const e2 = new UpdateSelectedSlideEvent(null);
        expect(e1.id).not.toBe(e2.id);
    });

    it('sets editedSlideId to given id', () => {
        const show = emptySlideshow();
        const id = crypto.randomUUID();
        const [, resultId] = new UpdateSelectedSlideEvent(id).apply(show);
        expect(resultId).toEqual(id);
    });

    it('sets editedSlideId to null', () => {
        const show = emptySlideshow();
        const [, resultId] = new UpdateSelectedSlideEvent(null).apply(show);
        expect(resultId).toBeNull();
    });

    it('does not mutate slideShow', () => {
        const show = emptySlideshow();
        const [result] = new UpdateSelectedSlideEvent(null).apply(show);
        expect(result).toBe(show);
    });
});
