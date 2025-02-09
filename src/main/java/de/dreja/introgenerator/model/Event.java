package de.dreja.introgenerator.model;

import jakarta.annotation.Nonnull;

public sealed interface Event permits TimedEvent, DayEvent {

    @Nonnull
    String name();

    @Nonnull
    String description();

    @Nonnull
    byte[] image();
}
