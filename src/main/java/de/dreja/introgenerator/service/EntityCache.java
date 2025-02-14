package de.dreja.introgenerator.service;

import de.dreja.introgenerator.model.entity.Entity;
import de.dreja.introgenerator.model.entity.Event;
import de.dreja.introgenerator.model.entity.Presentation;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Stream;

@Service
public class EntityCache {

    private final Map<Integer, Entity> entities;
    private final Map<Integer, Set<Integer>> parentToChild;

    EntityCache() {
        entities = new HashMap<>();
        parentToChild = new HashMap<>();
    }

    @Nullable
    public Presentation getPresentation(int id) {
        return get(id, Presentation.class);
    }

    public boolean storePresentation(@Nullable Presentation presentation) {
        return store(presentation);
    }

    @Nonnull
    public Stream<Event> getEventsOf(@Nullable Presentation presentation) {
        return getChildrenOf(presentation, Event.class);
    }

    public boolean addToPresentation(@Nullable Presentation presentation, @Nullable Event event) {
        return link(presentation, event);
    }

    public boolean removeFromPresentation(@Nullable Presentation presentation, @Nullable Event event) {
        return unlink(presentation, event);
    }

    @Nullable
    public Event getEvent(int id) {
        return get(id, Event.class);
    }

    public boolean storeEvent(@Nullable Event event) {
        return store(event);
    }

    @Nullable
    private <E extends Entity> E get(@Nullable Integer id, @Nonnull Class<E> entityType) {
        if (id == null || id <= 0) {
            return null;
        }
        final Entity entity = entities.get(id);
        if (entityType.isInstance(entity)) {
            return entityType.cast(entity);
        }
        return null;
    }

    private <E extends Entity> boolean store(@Nullable E entity) {
        if (entity == null) {
            return false;
        }
        final int id = entity.id();
        if (id <= 0) {
            return false;
        }
        // Only one write at a time!
        synchronized (entities) {
            final Entity old = entities.put(id, entity);
            return Objects.equals(old, entity);
        }
    }

    @Nonnull
    private <E extends Entity> Stream<E> getChildrenOf(@Nullable Entity parent,
                                                       @Nonnull Class<E> entityType) {
        if (parent == null) {
            return Stream.empty();
        }
        final int parentId = parent.id();
        if (parentId <= 0) {
            return Stream.empty();
        }
        final Set<Integer> children = parentToChild.get(parentId);
        if (children == null) {
            return Stream.empty();
        }
        return children.stream()
                .map(child -> get(child, entityType))
                .filter(Objects::nonNull);
    }

    private boolean link(@Nullable Entity parent, @Nullable Entity child) {
        if (parent == null || child == null) {
            return false;
        }
        final int parentId = parent.id();
        final int childId = child.id();
        if (parentId <= 0 || childId <= 0) {
            return false;
        }
        // Only one write at a time!
        synchronized (entities) {
            return parentToChild.computeIfAbsent(parentId, k -> new HashSet<>()).add(childId);
        }
    }

    private boolean unlink(@Nullable Entity parent, @Nullable Entity child) {
        if (parent == null || child == null) {
            return false;
        }
        final int parentId = parent.id();
        final int childId = child.id();
        if (parentId <= 0 || childId <= 0) {
            return false;
        }
        // Only one write at a time!
        synchronized (entities) {
            final Set<Integer> children = parentToChild.get(parentId);
            if(children == null) {
                return false;
            }
            final boolean removed = children.remove(childId);
            if(children.isEmpty()) {
                parentToChild.remove(parentId);
            }
            return removed;
        }
    }
}
