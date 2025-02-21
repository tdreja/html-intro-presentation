package de.dreja.introgenerator.model.form;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

import static de.dreja.introgenerator.model.form.FormUtils.trimOrEmpty;
import static de.dreja.introgenerator.model.form.FormUtils.trimOrNull;

/**
 * User-Input received from the HTML Form
 */
public record PresentationForm(@Nullable
                               @JsonProperty("id")
                               String id,
                               @Nullable
                               @JsonProperty("title")
                               String title,
                               @Nullable
                               @JsonProperty("description")
                               String description,
                               @Nullable
                               @JsonProperty("countdownEndDate")
                               String countdownEndDate,
                               @Nullable
                               @JsonProperty("countdownEndTime")
                               String countdownEndTime,
                               @Nullable
                               @JsonProperty("countdownRuntimeMinutes")
                               String countdownRuntimeMinutes,
                               @Nullable
                               @JsonProperty("countdownRuntimeSeconds")
                               String countdownRuntimeSeconds) {

    @Nonnull
    public DateTimeForm getCountdownEnd() {
        return new DateTimeForm(trimOrEmpty(countdownEndDate), trimOrNull(countdownEndTime));
    }

    @Nonnull
    public DurationForm getCountdownRuntime() {
        return new DurationForm(trimOrEmpty(countdownRuntimeMinutes), trimOrNull(countdownRuntimeSeconds));
    }
}
