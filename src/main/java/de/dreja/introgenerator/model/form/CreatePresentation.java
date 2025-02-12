package de.dreja.introgenerator.model.form;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

public record CreatePresentation(@Nonnull String startTime,
                                 @Nonnull String countdownDuration,
                                 @Nonnull String title,
                                 @Nullable String subTitle) {
}
