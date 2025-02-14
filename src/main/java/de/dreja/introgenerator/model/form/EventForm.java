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
                        @JsonProperty(value = "startDate", required = true)
                        String startDate,
                        @Nullable
                        @JsonProperty("startTime")
                        @JsonInclude(NON_NULL)
                        String startTime,
                        @Nonnull
                        @JsonProperty(value = "title", required = true)
                        String title,
                        @Nullable
                        @JsonProperty("subTitle")
                        @JsonInclude(NON_NULL)
                        String subTitle) implements HasTimeStamp {

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
                     String subTitle) {
        this.id = trimOrNull(id);
        this.startDate = trimOrEmpty(startDate);
        this.startTime = trimOrNull(startTime);
        this.title = trimOrEmpty(title);
        this.subTitle = trimOrNull(subTitle);
    }

    @Nonnull
    @Override
    @JsonIgnore
    public String getDate() {
        return startDate;
    }

    @Nullable
    @Override
    @JsonIgnore
    public String getTime() {
        return startTime;
    }
}
