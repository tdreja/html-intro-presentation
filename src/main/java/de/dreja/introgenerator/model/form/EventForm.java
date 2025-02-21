package de.dreja.introgenerator.model.form;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import org.springframework.boot.context.properties.bind.ConstructorBinding;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;
import static de.dreja.introgenerator.model.form.FormUtils.trimOrEmpty;
import static de.dreja.introgenerator.model.form.FormUtils.trimOrNull;

public record EventForm(@Nullable
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
                        String description) {

    @Nonnull
    public DateTimeForm getStartDateTime() {
        return new DateTimeForm(trimOrEmpty(startDate), trimOrNull(startTime));
    }
}
