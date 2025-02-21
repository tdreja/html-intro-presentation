package de.dreja.introgenerator.model.form;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

public record DateTimeForm(@Nonnull String date,
                           @Nullable String time) {
}
