package de.dreja.introgenerator.model.form;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

public interface HasTimeStamp {

    @Nonnull
    String getDate();

    @Nullable
    String getTime();
}
