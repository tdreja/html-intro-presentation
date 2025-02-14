package de.dreja.introgenerator.model.form;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

public final class FormUtils {

    private FormUtils() {
        // Ignore
    }

    @Nullable
    public static String trimOrNull(@Nullable String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    @Nonnull
    public static String trimOrEmpty(@Nullable String value) {
        if (value == null || value.isBlank()) {
            return "";
        }
        return value.trim();
    }
}
