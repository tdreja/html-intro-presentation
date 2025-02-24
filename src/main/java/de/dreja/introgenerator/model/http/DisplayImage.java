package de.dreja.introgenerator.model.http;

import jakarta.annotation.Nonnull;

public record DisplayImage(@Nonnull String base64, @Nonnull String mimeType, @Nonnull String fileName) {
}
