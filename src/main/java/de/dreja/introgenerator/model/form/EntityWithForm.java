package de.dreja.introgenerator.model.form;

import de.dreja.introgenerator.model.entity.Entity;
import jakarta.annotation.Nonnull;

public record EntityWithForm<ENTITY extends Entity, FORM>(
        @Nonnull ENTITY entity,
        @Nonnull FORM form
) {
}
