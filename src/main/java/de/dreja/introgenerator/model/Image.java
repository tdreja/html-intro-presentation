package de.dreja.introgenerator.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nonnull;

public record Image(@Nonnull
                    @JsonProperty(required = true)
                    Base64Id id,
                    @Nonnull
                    @JsonProperty(required = true)
                    Base64Id version,
                    @Nonnull
                    @JsonProperty(required = true)
                    String title,
                    @Nonnull
                    @JsonProperty(required = true)
                    byte[] content,
                    @Nonnull
                    @JsonProperty(required = true)
                    String mimeType) implements Entity {

    public Image(@Nonnull Base64Id id,
                 @Nonnull String title,
                 @Nonnull byte[] content,
                 @Nonnull String mimeType) {
        this(id, Base64Id.ONE, title, content, mimeType);
    }
}
