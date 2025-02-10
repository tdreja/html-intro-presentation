package de.dreja.introgenerator.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

public record Presentation(@Nonnull
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
                           @JsonProperty(required = true)
                           List<Event> events) {

    @JsonCreator
    Presentation(@Nonnull
                 @JsonProperty(required = true)
                 LocalDateTime countdownEnd,
                 @JsonProperty(required = true)
                 long countdownInSeconds,
                 @Nonnull
                 @JsonProperty(required = true)
                 String title,
                 @JsonProperty
                 String subTitle,
                 @Nonnull
                 @JsonProperty(required = true)
                 List<Event> events) {
        this(countdownEnd, Duration.ofSeconds(countdownInSeconds), title, subTitle, events);
    }

    @JsonProperty(required = true)
    public long countdownInSeconds() {
        return countdownRuntime.toSeconds();
    }
}
