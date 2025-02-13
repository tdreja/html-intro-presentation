package de.dreja.introgenerator.service;

import de.dreja.introgenerator.model.entity.Entity;
import de.dreja.introgenerator.model.entity.Event;
import de.dreja.introgenerator.model.entity.Presentation;
import de.dreja.introgenerator.model.form.EventForm;
import de.dreja.introgenerator.model.form.PresentationForm;
import jakarta.annotation.Nonnull;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.*;
import java.util.function.IntFunction;
import java.util.function.UnaryOperator;

@Service
public class EntityCache {

    private int lastId;
    private final Map<Integer, VersionHistory<Presentation>> presentations;
    private final Map<Integer, VersionHistory<Event>> events;

    EntityCache() {
        lastId = new Random().nextInt(100_000);
        this.presentations = new HashMap<>();
        this.events = new HashMap<>();
    }

    @Nonnull
    public Presentation newPresentation(final @Nonnull PresentationForm presentationForm) {
        return createNew(id -> new Presentation(id, presentationForm), this.presentations);
    }

    @Nonnull
    public Optional<Presentation> findPresentation(final int id) {
        synchronized (this) {
            return Optional.ofNullable(this.presentations.get(id))
                    .map(VersionHistory::current);
        }
    }

    @Nonnull
    public Presentation update(final int presentationId, final @Nonnull PresentationForm presentationForm) {
        return update(presentationId,
                presentation -> presentation.withUpdatedData(presentationForm), this.presentations);
    }

    @Nonnull
    public Presentation addOrUpdateEvent(final int presentationId, final @Nonnull Event event) {
        return update(presentationId, presentation -> presentation.withEvent(event), this.presentations);
    }

    @Nonnull
    public Presentation restoreLastPresentation(int presentationId) {
        synchronized (this) {
            final VersionHistory<Presentation> history = this.presentations.get(presentationId);
            if(history == null) {
                throw new NoSuchElementException("Presentation not found: " + presentationId);
            }
            return history.restoreLast();
        }
    }

    @Nonnull
    public Event restoreLastEvent(int presentationId, int eventId) {
        synchronized (this) {
            final VersionHistory<Presentation> presentation = this.presentations.get(presentationId);
            if(presentation == null) {
                throw new NoSuchElementException("Presentation not found: " + presentationId);
            }
            final VersionHistory<Event> event = this.events.get(eventId);
            if(event == null) {
                throw new NoSuchElementException("Event not found: " + eventId);
            }
            // Restore event and add to presentation
            final Event restored = event.restoreLast();
            presentation.update(presentation.current().withEvent(restored));
            return restored;
        }
    }

    @Nonnull
    public Event newEvent(final @Nonnull EventForm eventForm) {
        return createNew(id -> new Event(id, eventForm), this.events);
    }

    @Nonnull
    public Event update(final int eventId, final @Nonnull EventForm eventForm) {
        return update(eventId, event -> event.withUpdatedData(eventForm), this.events);
    }

    @Nonnull
    private <E extends Entity> E createNew(@Nonnull IntFunction<E> constructor,
                                           @Nonnull Map<Integer, VersionHistory<E>> allEntities) {
        synchronized (this) {
            lastId++;
            if(lastId < 0) {
                lastId = 1;
            }
            final E entity = constructor.apply(lastId);
            allEntities.put(entity.id(), new VersionHistory<>(entity));
            return entity;
        }
    }

    @Nonnull
    private <E extends Entity> E update(final int id,
                                        final @Nonnull UnaryOperator<E> updateEntity,
                                        final @Nonnull Map<Integer, VersionHistory<E>> allEntities) {
        synchronized (this) {
            final VersionHistory<E> versionHistory = allEntities.get(id);
            if(versionHistory == null) {
                throw new NoSuchElementException("Entity not found: " + id);
            }
            final E entity = versionHistory.current();
            return versionHistory.update(updateEntity.apply(entity));
        }
    }

    private static final class VersionHistory<ENTITY extends Entity> {

        private ENTITY lastVersion;
        private ENTITY current;

        private VersionHistory(@Nonnull ENTITY current) {
            this.current = current;
            this.lastVersion = null;
        }

        @Nonnull
        private ENTITY current() {
            return current;
        }

        @Nonnull
        private ENTITY restoreLast() {
            if (lastVersion == null) {
                return current;
            }
            current = lastVersion;
            lastVersion = null;
            return current;
        }

        @Nonnull
        private ENTITY update(@Nonnull ENTITY newVersion) {
            if (Entity.isEqualVersion(current, newVersion)) {
                return current;
            }
            lastVersion = current;
            current = newVersion;
            return current;
        }
    }
}
