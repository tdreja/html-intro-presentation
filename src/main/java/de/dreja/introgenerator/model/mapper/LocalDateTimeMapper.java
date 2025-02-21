package de.dreja.introgenerator.model.mapper;

import de.dreja.introgenerator.model.form.DateTimeForm;
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
public class LocalDateTimeMapper {

    private final LocalDateParser dateParser = new LocalDateParser();
    private final LocalTimeParser timeParser = new LocalTimeParser();

    private LocalDateTimeMapper() {
        // Ignore
    }

    @Nonnull
    @Named("timeToForm")
    public DateTimeForm timeToForm(@Nullable LocalDateTime localDateTime) {
        if(localDateTime == null) {
            return new DateTimeForm("", null);
        }
        final String time;
        if(localDateTime.toLocalTime().equals(LocalTime.MIDNIGHT)) {
            time = null;
        } else {
            time = localDateTime.toLocalTime().format(DateTimeFormatter.ISO_LOCAL_TIME);
        }
        return new DateTimeForm(localDateTime.toLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE), time);
    }

    @Nonnull
    @Named("timeToDateForm")
    public String timeToDateForm(@Nullable LocalDateTime localDateTime) {
        return timeToForm(localDateTime).date();
    }

    @Nullable
    @Named("timeToTimeForm")
    public String timeToTimeForm(@Nullable LocalDateTime localDateTime) {
        return timeToForm(localDateTime).time();
    }

    @Nonnull
    @Named("formToTime")
    public LocalDateTime formToTime(@Nullable DateTimeForm dateTimeForm) {
        if(dateTimeForm == null) {
            return LocalDate.now().atStartOfDay();
        }
        final LocalDate date = parseDate(dateTimeForm.date());
        final LocalTime time = parseTime(dateTimeForm.time());
        return LocalDateTime.of(date, time);
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
