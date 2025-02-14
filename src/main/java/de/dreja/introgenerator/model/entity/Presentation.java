package de.dreja.introgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import de.dreja.introgenerator.model.mapper.Base64IdDeserializer;
import de.dreja.introgenerator.model.mapper.Base64IdSerializer;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Internal data model of the presentation
 */
public record Presentation(@JsonProperty(required = true)
                           @JsonSerialize(using = Base64IdSerializer.class)
                           @JsonDeserialize(using = Base64IdDeserializer.class)
                           @JsonFormat(shape = JsonFormat.Shape.STRING)
                           int id,
                           @Nonnull
                           @JsonIgnore
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

    @Nonnull
    @JsonProperty(value = "countdownEnd", required = true)
    String getCountdownEnd() {
        return countdownEnd.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    @Nonnull
    public static Presentation newToday() {
        return new Presentation(0, LocalDate.now().atStartOfDay(), Duration.ofMinutes(15), "", null);
    }
}
