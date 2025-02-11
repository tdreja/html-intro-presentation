package de.dreja.introgenerator.service;

import de.dreja.introgenerator.model.Presentation;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class PresentationCache {

    private long lastId;
    private final Map<Long, CacheEntry> presentations = new HashMap<>();
    private final Duration timeout = Duration.ofDays(1);

    @Nullable
    public Presentation getPresentation(long presentationId) {
        final CacheEntry entry = presentations.get(presentationId);
        if (entry == null) {
            return null;
        }
        final Instant now = Instant.now();
        if (entry.validUntil().isBefore(now)) {
            synchronized (presentations) {
                presentations.remove(presentationId);
            }
            return null;
        }
        return entry.presentation;
    }

    @Nonnull
    public Presentation updatePresentation(long presentationId, @Nonnull Presentation presentation) {
        final Instant now = Instant.now();
        synchronized (presentations) {
            final CacheEntry newEntry = new CacheEntry(now.plus(timeout), presentation);
            presentations.put(presentationId, newEntry);
        }
        return presentation.withId(presentationId);
    }

    @Nonnull
    public Presentation storePresentation(@Nonnull Presentation presentation) {
        synchronized (presentations) {
            lastId++;
            final Presentation stored = presentation.withId(lastId);
            presentations.put(stored.id(), new CacheEntry(Instant.now().plus(timeout), stored));
            return stored;
        }
    }

    private record CacheEntry(@Nonnull Instant validUntil,
                              @Nonnull Presentation presentation) {
    }
}
