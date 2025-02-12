package de.dreja.introgenerator.service;

import de.dreja.introgenerator.model.entity.Entity;
import de.dreja.introgenerator.model.entity.Event;
import de.dreja.introgenerator.model.entity.Presentation;
import jakarta.annotation.Nonnull;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Random;
import java.util.function.IntFunction;

@Service
public class EntityCache {

    private static final Duration INITIAL_DURATION = Duration.ofMinutes(15);

    private int lastId;
    private final Map<Integer, VersionHistory<Presentation>> presentations;
    private final Map<Integer, VersionHistory<Event>> events;

    EntityCache() {
        lastId = new Random().nextInt(100_000);
        this.presentations = new HashMap<>();
        this.events = new HashMap<>();
    }

    @Nonnull
    public Presentation newPresentation() {
        return createNew(Presentation::new, this.presentations);
    }

    @Nonnull
    public Presentation update(@Nonnull Presentation presentation) {
        return update(presentation, this.presentations);
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
    public Event newEvent() {
        return createNew(Event::new, this.events);
    }

    @Nonnull
    public Event update(@Nonnull Event event) {
        return update(event, this.events);
    }

    @Nonnull
    private <E extends Entity> E createNew(@Nonnull IntFunction<E> constructor,
                                           @Nonnull Map<Integer, VersionHistory<E>> allEntities) {
        synchronized (this) {
            lastId++;
            final E entity = constructor.apply(lastId);
            allEntities.put(entity.id(), new VersionHistory<>(entity));
            return entity;
        }
    }

    @Nonnull
    private <E extends Entity> E update(@Nonnull E input, @Nonnull Map<Integer, VersionHistory<E>> allEntities) {
        synchronized (this) {
            final VersionHistory<E> versionHistory = allEntities.get(lastId);
            if (versionHistory == null) {
                allEntities.put(input.id(), new VersionHistory<>(input));
                return input;
            } else {
                return versionHistory.update(input);
            }
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
