package de.dreja.introgenerator.model.form;

import jakarta.annotation.Nullable;

public interface HasDuration {

    @Nullable
    String getMinutes();

    @Nullable
    String getSeconds();
}
