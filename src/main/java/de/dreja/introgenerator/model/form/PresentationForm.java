package de.dreja.introgenerator.model.form;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

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
                               @JsonProperty("subTitle")
                               @JsonInclude(NON_NULL)
                               String subTitle,
                               @Nonnull
                               @JsonProperty(value = "countdownEndDate", required = true)
                               String countdownEndDate,
                               @Nullable
                               @JsonProperty("countdownEndTime")
                               @JsonInclude(NON_NULL)
                               String countdownEndTime,
                               @Nullable
                               @JsonProperty("countdownRuntimeMinutes")
                               @JsonInclude(NON_NULL)
                               String countdownRuntimeMinutes,
                               @Nullable
                               @JsonProperty("countdownRuntimeSeconds")
                               @JsonInclude(NON_NULL)
                               String countdownRuntimeSeconds) implements HasTimeStamp, HasDuration {

    @JsonCreator
    public PresentationForm(@Nullable
                            @JsonProperty("id")
                            String id,
                            @Nullable
                            @JsonProperty("title")
                            String title,
                            @Nullable
                            @JsonProperty("subTitle")
                            String subTitle,
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
        this.id = trimOrNull(id);
        this.title = trimOrEmpty(title);
        this.subTitle = trimOrNull(subTitle);
        this.countdownEndDate = trimOrEmpty(countdownEndDate);
        this.countdownEndTime = trimOrNull(countdownEndTime);
        this.countdownRuntimeMinutes = trimOrNull(countdownRuntimeMinutes);
        this.countdownRuntimeSeconds = trimOrNull(countdownRuntimeSeconds);
    }

    @Nonnull
    public static PresentationForm emptyForm() {
        final LocalDate now = LocalDate.now();
        return new PresentationForm(null, null, null,
                now.format(DateTimeFormatter.ISO_DATE), null, "15", null);
    }

    @Nonnull
    @Override
    @JsonIgnore
    public String getDate() {
        return countdownEndDate;
    }

    @Nullable
    @Override
    @JsonIgnore
    public String getTime() {
        return countdownEndTime;
    }

    @Nullable
    @Override
    @JsonIgnore
    public String getMinutes() {
        return countdownRuntimeMinutes;
    }

    @Nullable
    @Override
    @JsonIgnore
    public String getSeconds() {
        return countdownRuntimeSeconds;
    }
}
