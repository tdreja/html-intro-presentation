package de.dreja.introgenerator.model.json;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.Temporal;
import java.util.List;
import java.util.Objects;

public final class LocalDateTimeParser {

    private static final LocalDateParser DATE_PARSER = new LocalDateParser();
    private static final LocalTimeParser TIME_PARSER = new LocalTimeParser();

    private LocalDateTimeParser() {
        // Ignore
    }

    @Nonnull
    public static LocalDateTime parseDateTime(@Nullable String date, @Nullable String time) {
        return LocalDateTime.of(parseDate(date), parseTime(time));
    }

    @Nonnull
    public static LocalDate parseDate(@Nullable String date) {
        return DATE_PARSER.parse(date);
    }

    @Nonnull
    public static LocalTime parseTime(@Nullable String time) {
        return TIME_PARSER.parse(time);
    }

    protected static abstract class Parser<TEMPORAL extends Temporal> {

        private final List<DateTimeFormatter> formats;

        protected Parser(@Nonnull DateTimeFormatter... formats) {
            this.formats = List.of(formats);
        }

        @Nonnull
        TEMPORAL parse(@Nullable String input) {
            if (input == null) {
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
