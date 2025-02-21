package de.dreja.introgenerator.model.http;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

public record DisplayPresentation(@Nonnull String id,
                                  @Nonnull String title,
                                  @Nullable String description,
                                  @Nonnull String countdownEndDate,
                                  @Nonnull String countdownEndTime) {
}
