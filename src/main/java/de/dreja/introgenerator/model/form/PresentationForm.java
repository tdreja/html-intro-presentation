package de.dreja.introgenerator.model.form;

import de.dreja.introgenerator.model.json.LocalDateTimeParser;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.stream.Stream;

/**
 * User-Input received from the HTML Form
 */
public record PresentationForm(@Nullable String title,
                               @Nullable String subTitle,
                               @Nullable String countdownEndDate,
                               @Nullable String countdownEndTime,
                               @Nullable String countdownRuntimeMinutes,
                               @Nullable String countdownRuntimeSeconds) {

    @Nonnull
    public static PresentationForm emptyForm() {
        final LocalDate now = LocalDate.now();
        return new PresentationForm(null, null,
                now.format(DateTimeFormatter.ISO_DATE), null, "15", null);
    }

    @Nonnull
    public String getTitle() {
        return title == null ? "" : title.trim();
    }

    @Nullable
    public String getSubTitle() {
        if (subTitle == null || subTitle.isBlank()) {
            return null;
        }
        return subTitle.trim();
    }

    @Nonnull
    public LocalDateTime getCountdownEnd() {
        return LocalDateTimeParser.parseDateTime(countdownEndDate, countdownEndTime);
    }

    @Nonnull
    public Duration getCountdownRuntime() {
        long minutes = 0;
        if(countdownRuntimeMinutes != null && !countdownRuntimeMinutes.isBlank()) {
            minutes = Long.parseLong(countdownRuntimeMinutes);
        }
        long seconds = 0;
        if(countdownRuntimeSeconds != null && !countdownRuntimeSeconds.isBlank()) {
            seconds = Long.parseLong(countdownRuntimeSeconds);
        }
        return Duration.ofMinutes(minutes).plusSeconds(seconds);
    }
}
