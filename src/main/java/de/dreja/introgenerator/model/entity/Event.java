package de.dreja.introgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import de.dreja.introgenerator.model.json.Base64Deserializer;
import de.dreja.introgenerator.model.json.Base64Serializer;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

import java.time.LocalDateTime;
import java.util.Objects;

public record Event(@JsonProperty(required = true)
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

    public Event(int id) {
        this(id, 1, LocalDateTime.now(), "", null, null);
    }

    @Nonnull
    public Event withUpdatedData(@Nonnull LocalDateTime startTime,
                                 @Nonnull String title,
                                 @Nullable String subTitle) {
        if (this.startTime.equals(startTime)
                && this.title.equals(title)
                && Objects.equals(this.subTitle, subTitle)) {
            return this;
        }
        return new Event(id, version+1, startTime, title, subTitle, image);
    }

    @Nonnull
    public Event withImage(@Nullable Image image) {
        if (Objects.equals(this.image, image)) {
            return this;
        }
        return new Event(id, version+1, startTime, title, subTitle, image);
    }
}
