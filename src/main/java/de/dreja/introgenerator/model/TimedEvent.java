package de.dreja.introgenerator.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

import java.time.LocalDateTime;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

public record TimedEvent(@Nonnull
                         @JsonProperty(required = true)
                         String name,
                         @Nonnull
                         @JsonProperty(required = true)
                         String description,
                         @Nonnull
                         @JsonProperty(required = true)
                         byte[] image,
                         @Nonnull
                         @JsonProperty(required = true)
                         @JsonSerialize(using = LocalDateTimeSerializer.class)
                         @JsonDeserialize(using = LocalDateTimeDeserializer.class)
                         LocalDateTime start,
                         @Nullable
                         @JsonProperty
                         @JsonInclude(NON_NULL)
                         @JsonSerialize(using = LocalDateTimeSerializer.class)
                         @JsonDeserialize(using = LocalDateTimeDeserializer.class)
                         LocalDateTime end) implements Event {
}
