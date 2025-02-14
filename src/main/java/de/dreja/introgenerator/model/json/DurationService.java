package de.dreja.introgenerator.model.json;

import de.dreja.introgenerator.model.form.HasDuration;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import org.mapstruct.Named;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class DurationService {

    @Nullable
    @Named("getMinutes")
    public String getMinutes(@Nullable Duration duration) {
        if (duration == null) {
            return null;
        }
        final long minutes = duration.toMinutes();
        if (minutes <= 0) {
            return null;
        }
        return Long.toString(minutes);
    }

    @Nullable
    @Named("getSeconds")
    public String getSeconds(@Nullable Duration duration) {
        if (duration == null) {
            return null;
        }
        final long seconds = duration.minusMinutes(duration.toMinutes()).getSeconds();
        if (seconds <= 0) {
            return null;
        }
        return Long.toString(seconds);
    }

    @Nonnull
    @Named("getDuration")
    public Duration getDuration(@Nullable HasDuration hasDuration) {
        if (hasDuration == null) {
            return Duration.ZERO;
        }
        final long minutes = parseLong(hasDuration.getMinutes());
        final long seconds = parseLong(hasDuration.getSeconds());
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
