package de.dreja.introgenerator.model.form;

import de.dreja.introgenerator.model.persistence.Presentation;
import jakarta.annotation.Nonnull;

public record PresentationData(@Nonnull Presentation presentation,
                               @Nonnull PresentationForm presentationForm) {
}
