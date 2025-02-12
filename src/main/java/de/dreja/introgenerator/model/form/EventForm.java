package de.dreja.introgenerator.model.form;

import de.dreja.introgenerator.model.json.LocalDateTimeParser;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

import java.time.LocalDateTime;

public record EventForm(@Nullable String startDate,
                        @Nullable String startTime,
                        @Nullable String title,
                        @Nullable String subTitle) {

    @Nonnull
    public String getTitle() {
        if(title == null) {
            return "";
        }
        return title.trim();
    }

    @Nullable
    public String getSubTitle() {
        if(subTitle == null || subTitle.isBlank()) {
            return null;
        }
        return subTitle.trim();
    }

    @Nonnull
    public LocalDateTime getStartTime() {
        return LocalDateTimeParser.parseDateTime(startDate, startTime);
    }
}
