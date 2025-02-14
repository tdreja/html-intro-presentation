package de.dreja.introgenerator.model.json;

import de.dreja.introgenerator.model.form.HasTimeStamp;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import org.mapstruct.Named;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.Temporal;
import java.util.List;
import java.util.Objects;

@Service
public class LocalDateTimeService {

    private final LocalDateParser dateParser = new LocalDateParser();
    private final LocalTimeParser timeParser = new LocalTimeParser();

    private LocalDateTimeService() {
        // Ignore
    }

    @Nonnull
    @Named("parseTimeStamp")
    public LocalDateTime parseTimeStamp(@Nullable HasTimeStamp timeStamp) {
        if (timeStamp == null) {
            return LocalDate.now().atStartOfDay();
        }
        return parseDateTime(timeStamp.getDate(), timeStamp.getTime());
    }

    @Nonnull
    @Named("parseDateTime")
    public LocalDateTime parseDateTime(@Nullable String date, @Nullable String time) {
        return LocalDateTime.of(parseDate(date), parseTime(time));
    }

    @Nonnull
    @Named("parseDate")
    public LocalDate parseDate(@Nullable String date) {
        return dateParser.parse(date);
    }

    @Nonnull
    @Named("parseTime")
    public LocalTime parseTime(@Nullable String time) {
        return timeParser.parse(time);
    }

    @Nonnull
    @Named("formatDate")
    public String formatDate(@Nullable LocalDateTime dateTime) {
        return dateTime == null ? "" : dateTime.format(DateTimeFormatter.ISO_LOCAL_DATE);
    }

    @Nullable
    @Named("formatTime")
    public String formatTime(@Nullable LocalDateTime dateTime) {
        if(dateTime == null) {
            return null;
        }
        // Skip 00:00!
        if(dateTime.toLocalDate().atStartOfDay().isEqual(dateTime)) {
            return null;
        }
        return dateTime.format(DateTimeFormatter.ISO_LOCAL_TIME);
    }

    protected static abstract class Parser<TEMPORAL extends Temporal> {

        private final List<DateTimeFormatter> formats;

        protected Parser(@Nonnull DateTimeFormatter... formats) {
            this.formats = List.of(formats);
        }

        @Nonnull
        TEMPORAL parse(@Nullable String input) {
            if (input == null || input.isBlank()) {
                return fallback();
            }
            return formats.stream()
                    .map(format -> parse(input, format))
                    .filter(Objects::nonNull)
                    .findFirst()
                    .orElseGet(this::fallback);
        }

        @Nullable
        protected abstract TEMPORAL parse(@Nonnull String input, @Nonnull DateTimeFormatter format);

        @Nonnull
        protected abstract TEMPORAL fallback();
    }

    static class LocalDateParser extends Parser<LocalDate> {

        LocalDateParser() {
            super(DateTimeFormatter.ISO_LOCAL_DATE, DateTimeFormatter.ofPattern("dd.MM.yyyy"));
        }

        @Nullable
        @Override
        protected LocalDate parse(@Nonnull String input, @Nonnull DateTimeFormatter format) {
            return LocalDate.parse(input, format);
        }

        @Nonnull
        @Override
        protected LocalDate fallback() {
            return LocalDate.now();
        }
    }

    static class LocalTimeParser extends Parser<LocalTime> {

        LocalTimeParser() {
            super(DateTimeFormatter.ISO_LOCAL_TIME);
        }

        @Nullable
        @Override
        protected LocalTime parse(@Nonnull String input, @Nonnull DateTimeFormatter format) {
            return LocalTime.parse(input, format);
        }

        @Nonnull
        @Override
        protected LocalTime fallback() {
            return LocalTime.of(0, 0);
        }
    }
}
