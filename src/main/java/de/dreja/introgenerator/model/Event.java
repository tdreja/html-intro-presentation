package de.dreja.introgenerator.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

import java.time.LocalDateTime;
import java.util.Objects;

public record Event(@Nonnull
                    @JsonProperty(required = true)
                    Base64Id id,
                    @Nonnull
                    @JsonProperty(required = true)
                    Base64Id version,
                    @Nonnull
                    @JsonProperty(required = true)
                    LocalDateTime startTime,
                    @Nonnull
                    @JsonProperty(required = true)
                    String title,
                    @Nullable
                    @JsonProperty
                    String subTitle,
                    @Nonnull
                    @JsonProperty(required = true)
                    Image image) implements Entity {

    public Event(@Nonnull Base64Id id,
                 @Nonnull LocalDateTime startTime,
                 @Nonnull String title,
                 @Nullable String subTitle,
                 @Nonnull Image image) {
        this(id, Base64Id.ONE, startTime, title, subTitle, image);
    }

    @Nonnull
    public Event withStartTime(@Nonnull LocalDateTime startTime) {
        if (this.startTime.equals(startTime)) {
            return this;
        }
        return new Event(id, version.next(), startTime, title, subTitle, image);
    }

    @Nonnull
    public Event withTitle(@Nonnull String title) {
        if (this.title.equals(title)) {
            return this;
        }
        return new Event(id, version.next(), startTime, title, subTitle, image);
    }

    @Nonnull
    public Event withSubTitle(@Nonnull String subTitle) {
        if (Objects.equals(this.subTitle, subTitle)) {
            return this;
        }
        return new Event(id, version.next(), startTime, title, subTitle, image);
    }

    @Nonnull
    public Event withImage(@Nonnull Image image) {
        if (this.image.id().equals(image.id()) && this.image.version().equals(image.version())) {
            return this;
        }
        return new Event(id, version.next(), startTime, title, subTitle, image);
    }
}
