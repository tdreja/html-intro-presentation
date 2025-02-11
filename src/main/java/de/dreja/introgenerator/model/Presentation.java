package de.dreja.introgenerator.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

public record Presentation(@Nonnull
                           @JsonProperty(required = true)
                           Base64Id id,
                           @Nonnull
                           @JsonProperty(required = true)
                           Base64Id version,
                           @Nonnull
                           @JsonProperty(required = true)
                           LocalDateTime countdownEnd,
                           @Nonnull
                           @JsonIgnore
                           Duration countdownRuntime,
                           @Nonnull
                           @JsonProperty(required = true)
                           String title,
                           @JsonProperty
                           @Nullable
                           String subTitle,
                           @Nonnull
                           @JsonIgnore
                           NavigableMap<Base64Id, Event> events) implements Entity {

    public Presentation(@Nonnull Base64Id id,
                        @Nonnull LocalDateTime countdownEnd,
                        @Nonnull Duration countdownRuntime,
                        @Nonnull String title,
                        @Nullable String subTitle) {
        this(id, Base64Id.ONE, countdownEnd, countdownRuntime, title, subTitle,
                Collections.emptyNavigableMap());
    }

    @Nonnull
    public Presentation withCountdownEnd(@Nonnull LocalDateTime countdownEnd) {
        if (this.countdownEnd.equals(countdownEnd)) {
            return this;
        }
        return new Presentation(id, version.next(), countdownEnd, countdownRuntime, title, subTitle, events);
    }

    @Nonnull
    public Presentation withCountdownRuntime(@Nonnull Duration countdownRuntime) {
        if (this.countdownRuntime.equals(countdownRuntime)) {
            return this;
        }
        return new Presentation(id, version.next(), countdownEnd, countdownRuntime, title, subTitle, events);
    }

    @Nonnull
    public Presentation withTitle(@Nonnull String title) {
        if (this.title.equals(title)) {
            return this;
        }
        return new Presentation(id, version.next(), countdownEnd, countdownRuntime, title, subTitle, events);
    }

    @Nonnull
    public Presentation withSubTitle(@Nonnull String subTitle) {
        if (Objects.equals(this.subTitle, subTitle)) {
            return this;
        }
        return new Presentation(id, version.next(), countdownEnd, countdownRuntime, title, subTitle, events);
    }

    @Nonnull
    public Presentation withEvent(@Nullable Event event) {
        if (event == null) {
            return this;
        }
        final Event existing = events.get(event.id());
        if (existing != null && existing.version() == event.version()) {
            return this;
        }
        final TreeMap<Base64Id, Event> newMap = new TreeMap<>(events);
        newMap.put(event.id(), event);
        return new Presentation(id, version.next(), countdownEnd, countdownRuntime, title, subTitle,
                Collections.unmodifiableNavigableMap(newMap));
    }

    @JsonProperty(value = "countdownInSeconds", required = true)
    long countdownInSeconds() {
        return countdownRuntime.toSeconds();
    }

    @JsonProperty(value = "events", required = true)
    @Nonnull
    List<Event> getEvents() {
        return new ArrayList<>(events.values());
    }
}
