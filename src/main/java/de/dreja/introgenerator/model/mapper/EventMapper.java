package de.dreja.introgenerator.model.mapper;

import de.dreja.introgenerator.model.form.EventData;
import de.dreja.introgenerator.model.form.EventForm;
import de.dreja.introgenerator.model.http.DisplayImage;
import de.dreja.introgenerator.model.persistence.Event;
import de.dreja.introgenerator.model.persistence.Image;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import org.mapstruct.*;
import org.springframework.util.MimeType;

import java.util.Objects;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        uses = {
                Base64IdSerializer.class, LocalDateTimeMapper.class, Base64ContentSerializer.class,
        },
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface EventMapper {

    @Mapping(target = "id", source = "id", qualifiedByName = "toBase64")
    @Mapping(target = "startDate", source = "startTime", qualifiedByName = "timeToDateForm")
    @Mapping(target = "startTime", source = "startTime", qualifiedByName = "timeToTimeForm")
    @Nullable
    EventForm persistenceToForm(@Nullable Event event);

    @Nullable
    @Mapping(target = "base64", source = "content", qualifiedByName = "contentToBase64")
    DisplayImage persistenceToImageDisplay(@Nullable Image image);

    @Mapping(target = "startTime", source = "startDateTime", qualifiedByName = "formToTime")
    @Mapping(target = "presentation", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "image", ignore = true)
    void updatePersistence(@Nullable EventForm form, @Nullable @MappingTarget Event event);

    @Nonnull
    default EventData toData(@Nonnull Event event) {
        return new EventData(event,
                Objects.requireNonNull(persistenceToForm(event)),
                persistenceToImageDisplay(event.getImage()));
    }

    @Nonnull
    default String getMimeType(@Nonnull MimeType mimeType) {
        return mimeType.toString();
    }
}
