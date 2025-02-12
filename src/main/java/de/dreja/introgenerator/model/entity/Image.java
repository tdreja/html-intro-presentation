package de.dreja.introgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nonnull;

public record Image(@Nonnull
                    @JsonProperty(required = true)
                    String title,
                    @Nonnull
                    @JsonProperty(required = true)
                    byte[] content,
                    @Nonnull
                    @JsonProperty(required = true)
                    String mimeType) {
}
