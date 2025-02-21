package de.dreja.introgenerator.model.form;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

public record DurationForm(@Nonnull String minutes,
                           @Nullable String seconds) {
}
