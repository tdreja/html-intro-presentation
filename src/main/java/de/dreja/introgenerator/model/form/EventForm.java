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

public record EventForm(@Nullable
                        @JsonProperty("id")
                        @JsonInclude(NON_NULL)
                        String id,
                        @Nonnull
                        @JsonIgnore
                        DateTimeForm startDateTime,
                        @Nonnull
                        @JsonProperty(value = "title", required = true)
                        String title,
                        @Nullable
                        @JsonProperty("description")
                        @JsonInclude(NON_NULL)
                        String description) {

    @JsonCreator
    public EventForm(@Nullable
                     @JsonProperty("id")
                     String id,
                     @Nullable
                     @JsonProperty("startDate")
                     String startDate,
                     @Nullable
                     @JsonProperty("startTime")
                     String startTime,
                     @Nullable
                     @JsonProperty("title")
                     String title,
                     @Nullable
                     @JsonProperty("subTitle")
                     String description) {
        this(trimOrNull(id),
                new DateTimeForm(trimOrEmpty(startDate), trimOrNull(startTime)),
                trimOrEmpty(title),
                trimOrNull(description));
    }

    @JsonProperty(value = "startDate", required = true)
    @Nonnull
    public String getStartDate() {
        return startDateTime.date();
    }

    @Nullable
    @JsonProperty("startTime")
    public String getStartTime() {
        return startDateTime.time();
    }
}
