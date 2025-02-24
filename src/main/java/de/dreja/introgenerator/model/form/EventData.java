package de.dreja.introgenerator.model.form;

import de.dreja.introgenerator.model.http.DisplayImage;
import de.dreja.introgenerator.model.persistence.Event;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

public record EventData(@Nonnull Event event,
                        @Nonnull EventForm eventForm,
                        @Nullable DisplayImage image) {
}
