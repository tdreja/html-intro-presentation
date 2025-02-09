package de.dreja.introgenerator.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import jakarta.annotation.Nonnull;

import java.time.LocalDate;

public record DayEvent(@Nonnull
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
                       @JsonSerialize(using = LocalDateSerializer.class)
                       @JsonDeserialize(using = LocalDateDeserializer.class)
                       LocalDate day) implements Event {
}
