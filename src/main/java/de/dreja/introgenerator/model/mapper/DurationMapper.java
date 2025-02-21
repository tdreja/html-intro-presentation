package de.dreja.introgenerator.model.mapper;

import de.dreja.introgenerator.model.form.DurationForm;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import org.mapstruct.Named;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class DurationMapper {

    @Nonnull
    @Named("durationToForm")
    public DurationForm durationToForm(@Nullable Duration duration) {
        if (duration == null) {
            return new DurationForm("", null);
        }
        final long minutes = duration.toMinutes();
        final long seconds = duration.minusMinutes(minutes).getSeconds();
        if (seconds == 0) {
            return new DurationForm(String.valueOf(minutes), null);
        }
        return new DurationForm(String.valueOf(minutes), String.valueOf(seconds));
    }

    @Nonnull
    @Named("durationToMinuteForm")
    public String durationToMinuteForm(@Nullable Duration duration) {
        return durationToForm(duration).minutes();
    }

    @Nullable
    @Named("durationToSecondsForm")
    public String durationToSecondsForm(@Nullable Duration duration) {
        return durationToForm(duration).seconds();
    }

    @Nonnull
    @Named("formToDuration")
    public Duration formToDuration(@Nullable DurationForm durationForm) {
        if (durationForm == null) {
            return Duration.ZERO;
        }
        final long minutes = parseLong(durationForm.minutes());
        final long seconds = parseLong(durationForm.seconds());
        return Duration.ofMinutes(minutes).plusSeconds(seconds);
    }

    private long parseLong(@Nullable String value) {
        if (value == null || value.isBlank()) {
            return 0;
        }
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException ex) {
            return 0;
        }
    }
}
