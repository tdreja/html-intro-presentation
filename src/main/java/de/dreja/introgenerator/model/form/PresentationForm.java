package de.dreja.introgenerator.model.form;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;
import static de.dreja.introgenerator.model.form.FormUtils.trimOrEmpty;
import static de.dreja.introgenerator.model.form.FormUtils.trimOrNull;

/**
 * User-Input received from the HTML Form
 */
public record PresentationForm(@Nullable
                               @JsonProperty("id")
                               @JsonInclude(NON_NULL)
                               String id,
                               @Nonnull
                               @JsonProperty(value = "title", required = true)
                               String title,
                               @Nullable
                               @JsonProperty("description")
                               @JsonInclude(NON_NULL)
                               String description,
                               @Nonnull
                               @JsonIgnore
                               DateTimeForm countdownEndDateTime,
                               @Nonnull
                               @JsonIgnore
                               DurationForm countdownRunTime) {

    @JsonCreator
    public PresentationForm(@Nullable
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
        this(trimOrNull(id),
                trimOrEmpty(title),
                trimOrNull(description),
                new DateTimeForm(trimOrEmpty(countdownEndDate), trimOrNull(countdownEndTime)),
                new DurationForm(trimOrEmpty(countdownRuntimeMinutes), trimOrNull(countdownRuntimeSeconds)));
    }

    @Nonnull
    @JsonProperty(value = "countdownEndDate", required = true)
    public String getCountdownEndDate() {
        return countdownEndDateTime.date();
    }

    @Nullable
    @JsonProperty("countdownEndTime")
    public String getCountdownEndTime() {
        return countdownEndDateTime.time();
    }

    @Nonnull
    @JsonProperty(value = "countdownRuntimeMinutes", required = true)
    public String getCountdownRuntimeMinutes() {
        return countdownRunTime.minutes();
    }

    @Nullable
    @JsonProperty("countdownRuntimeSeconds")
    public String getCountdownRuntimeSeconds() {
        return countdownRunTime.seconds();
    }
}
