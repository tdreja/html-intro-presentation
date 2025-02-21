package de.dreja.introgenerator.model.form;

import de.dreja.introgenerator.model.persistence.Event;
import jakarta.annotation.Nonnull;

public record EventData(@Nonnull Event event,
                        @Nonnull EventForm eventForm) {
}
