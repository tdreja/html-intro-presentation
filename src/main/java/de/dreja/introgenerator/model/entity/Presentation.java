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

/**
 * Internal data model of the presentation
 */
public record Presentation(@JsonProperty(required = true)
                           @JsonSerialize(using = Base64Serializer.class)
                           @JsonDeserialize(using = Base64Deserializer.class)
                           @JsonFormat(shape = JsonFormat.Shape.STRING)
                           int id,
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
                           String subTitle) implements Entity {


    @JsonProperty(value = "countdownInSeconds", required = true)
    long countdownInSeconds() {
        return countdownRuntime.toSeconds();
    }
}
