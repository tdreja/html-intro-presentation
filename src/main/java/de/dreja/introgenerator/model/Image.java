package de.dreja.introgenerator.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nonnull;
import org.springframework.util.MimeType;

public record Image(@Nonnull
                    @JsonProperty(required = true)
                    String title,
                    @Nonnull
                    @JsonProperty(required = true)
                    byte[] content,
                    @Nonnull
                    @JsonProperty(required = true)
                    String mimeType) {

    public Image(@Nonnull String title,
                 @Nonnull byte[] content,
                 @Nonnull MimeType mimeType) {
        this(title, content, mimeType.toString());
    }
}
