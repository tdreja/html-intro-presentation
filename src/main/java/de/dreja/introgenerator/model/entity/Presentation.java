package de.dreja.introgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import de.dreja.introgenerator.model.form.PresentationForm;
import de.dreja.introgenerator.model.json.Base64Deserializer;
import de.dreja.introgenerator.model.json.Base64Serializer;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Internal data model of the presentation
 */
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


    public Presentation(int id, @Nonnull PresentationForm form) {
        this(id, 1,
                form.getCountdownEnd(), form.getCountdownRuntime(), form.getTitle(), form.getSubTitle(),
                Collections.emptyNavigableMap());
    }

    @Nonnull
    public Presentation withUpdatedData(@Nonnull PresentationForm form) {
        final String newTitle = form.getTitle();
        final String newSubTitle = form.getSubTitle();
        final LocalDateTime newCountdownEnd = form.getCountdownEnd();
        final Duration newCountdownRuntime = form.getCountdownRuntime();
        if (newTitle.equals(title)
                && Objects.equals(newSubTitle, subTitle)
                && newCountdownEnd.equals(countdownEnd)
                && newCountdownRuntime.equals(countdownRuntime)) {
            return this;
        }
        return new Presentation(id, version + 1,
                newCountdownEnd, newCountdownRuntime, newTitle, newSubTitle, events);
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
        return new Presentation(id, version + 1, countdownEnd, countdownRuntime, title, subTitle,
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
