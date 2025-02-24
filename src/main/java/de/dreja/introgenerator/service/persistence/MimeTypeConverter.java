package de.dreja.introgenerator.service.persistence;

import jakarta.annotation.Nullable;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.util.MimeType;


@Converter(autoApply = true)
public class MimeTypeConverter implements AttributeConverter<MimeType, String> {

    @Override
    @Nullable
    public String convertToDatabaseColumn(@Nullable MimeType attribute) {
        return attribute == null ? null : attribute.toString();
    }

    @Override
    @Nullable
    public MimeType convertToEntityAttribute(@Nullable String dbData) {
        return dbData == null ? null : MimeType.valueOf(dbData);
    }
}
