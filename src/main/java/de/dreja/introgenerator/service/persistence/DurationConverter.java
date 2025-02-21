package de.dreja.introgenerator.service.persistence;

import jakarta.annotation.Nullable;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.time.Duration;

@Converter(autoApply = true)
public class DurationConverter implements AttributeConverter<Duration, Long> {

    @Override
    @Nullable
    public Long convertToDatabaseColumn(@Nullable Duration attribute) {
        return attribute == null ? null : attribute.toSeconds();
    }

    @Override
    @Nullable
    public Duration convertToEntityAttribute(@Nullable Long dbData) {
        return dbData == null ? null : Duration.ofSeconds(dbData);
    }
}
