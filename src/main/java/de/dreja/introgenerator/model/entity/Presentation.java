package de.dreja.introgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import de.dreja.introgenerator.model.json.Base64Deserializer;
import de.dreja.introgenerator.model.json.Base64Serializer;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

public record Presentation(@JsonProperty(required = true)
                           @JsonSerialize(using = Base64Serializer.class)
                           @JsonDeserialize(using = Base64Deserializer.class)
                           @JsonFormat(shape = JsonFormat.Shape.STRING)
                           int id,
                           @JsonProperty(required = true)
                           @JsonSerialize(using = Base64Serializer.class)
                           @JsonDeserialize(using = Base64Deserializer.class)
                           @JsonFormat(shape = JsonFormat.Shape.STRING)
                           int version,
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
                           NavigableMap<Integer, Event> events) implements Entity {

    private static final Duration INTIAL_DURATION = Duration.ofMinutes(15);


    public Presentation(int id) {
        this(id, 1,
                LocalDateTime.now(), INTIAL_DURATION, "", null, Collections.emptyNavigableMap());
    }

    @Nonnull
    public Presentation withUpdatedData(@Nonnull LocalDateTime countdownEnd,
                                        @Nonnull Duration countdownRuntime,
                                        @Nonnull String title,
                                        @Nullable String subTitle) {
        if (this.countdownEnd.equals(countdownEnd)
                && this.countdownRuntime.equals(countdownRuntime)
                && this.title.equals(title)
                && Objects.equals(this.subTitle, subTitle)) {
            return this;
        }
        return new Presentation(id, version+1, countdownEnd, countdownRuntime, title, subTitle, events);
    }

    @Nonnull
    public Presentation withEvent(@Nullable Event event) {
        if (event == null) {
            return this;
        }
        final Event existing = events.get(event.id());
        if (Entity.isEqualVersion(existing, event)) {
            return this;
        }
        final TreeMap<Integer, Event> newMap = new TreeMap<>(events);
        newMap.put(event.id(), event);
        return new Presentation(id, version+1, countdownEnd, countdownRuntime, title, subTitle,
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
