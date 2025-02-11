package de.dreja.introgenerator.model;

import jakarta.annotation.Nonnull;

public interface Entity {

    @Nonnull
    Base64Id id();

    @Nonnull
    Base64Id version();
}
