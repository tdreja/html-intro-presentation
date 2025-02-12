package de.dreja.introgenerator.model.form;

import de.dreja.introgenerator.model.json.LocalDateTimeParser;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.stream.Stream;

/**
 * User-Input received from the HTML Form
 */
public record PresentationForm(@Nullable String title,
                               @Nullable String subTitle,
                               @Nullable String countdownEndDate,
                               @Nullable String countdownEndTime,
                               @Nullable String countdownRuntime,
                               @Nullable String countdownRuntimeUnit) {

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
        long runtime;
        try {
            runtime = countdownRuntime == null ? 15 : Long.parseLong(countdownRuntime);
        } catch (NumberFormatException ex) {
            runtime = 15;
        }
        if(countdownRuntimeUnit == null) {
            return Duration.ofMinutes(runtime);
        }
        final ChronoUnit chronoUnit = Stream.of(ChronoUnit.values())
                .filter(unit -> unit.name().equalsIgnoreCase(countdownRuntimeUnit))
                .findFirst()
                .orElse(ChronoUnit.MINUTES);
        return Duration.of(runtime, chronoUnit);
    }
}
