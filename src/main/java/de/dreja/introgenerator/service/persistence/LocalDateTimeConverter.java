package de.dreja.introgenerator.service.persistence;

import jakarta.annotation.Nullable;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Converter(autoApply = true)
public class LocalDateTimeConverter implements AttributeConverter<LocalDateTime, String> {

    @Override
    @Nullable
    public String convertToDatabaseColumn(@Nullable LocalDateTime attribute) {
        return attribute == null ? null : attribute.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    @Override
    @Nullable
    public LocalDateTime convertToEntityAttribute(String dbData) {
        if(dbData == null) {
            return null;
        }
        return LocalDateTime.parse(dbData, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }
}
