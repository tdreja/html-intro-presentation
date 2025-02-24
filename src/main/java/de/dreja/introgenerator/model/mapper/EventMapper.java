package de.dreja.introgenerator.model.mapper;

import de.dreja.introgenerator.model.form.EventData;
import de.dreja.introgenerator.model.form.EventForm;
import de.dreja.introgenerator.model.persistence.Event;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import org.mapstruct.*;

import java.util.Objects;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        uses = {
                Base64IdSerializer.class, LocalDateTimeMapper.class,
        },
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface EventMapper {

    @Mapping(target = "id", source = "id", qualifiedByName = "toBase64")
    @Mapping(target = "startDate", source = "startTime", qualifiedByName = "timeToDateForm")
    @Mapping(target = "startTime", source = "startTime", qualifiedByName = "timeToTimeForm")
    @Nullable
    EventForm persistenceToForm(@Nullable Event event);

    @Mapping(target = "startTime", source = "startDateTime", qualifiedByName = "formToTime")
    @Mapping(target = "presentation", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "image", ignore = true)
    void updatePersistence(@Nullable EventForm form, @Nullable @MappingTarget Event event);

    @Nonnull
    default EventData toData(@Nonnull Event event) {
        return new EventData(event, Objects.requireNonNull(persistenceToForm(event)));
    }
}
