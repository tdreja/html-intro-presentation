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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public record Event(@JsonProperty(required = true)
                    @JsonSerialize(using = Base64IdSerializer.class)
                    @JsonDeserialize(using = Base64IdDeserializer.class)
                    @JsonFormat(shape = JsonFormat.Shape.STRING)
                    int id,
                    @Nonnull
                    @JsonIgnore
                    LocalDateTime startTime,
                    @Nonnull
                    @JsonProperty(required = true)
                    String title,
                    @Nullable
                    @JsonProperty
                    String subTitle,
                    @Nullable
                    @JsonProperty
                    Image image) implements Entity {

    @Nonnull
    public static Event newToday() {
        return new Event(0, LocalDate.now().atStartOfDay(), "", null, null);
    }

    @Nonnull
    @JsonProperty(value = "startTime", required = true)
    String getStartTime() {
        return startTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

}
