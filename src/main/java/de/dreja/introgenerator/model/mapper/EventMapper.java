package de.dreja.introgenerator.model.mapper;

import de.dreja.introgenerator.model.entity.Event;
import de.dreja.introgenerator.model.form.EntityWithForm;
import de.dreja.introgenerator.model.form.EventForm;
import jakarta.annotation.Nonnull;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        uses = {
                Base64IdSerializer.class, LocalDateTimeService.class, IdService.class,
        },
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface EventMapper {

    @Mapping(target = "id", source = "id", qualifiedByName = "parseBase64OrCreateNew")
    @Mapping(target = "image", ignore = true)
    @Mapping(target = "startTime", source = ".", qualifiedByName = "parseTimeStamp")
    Event toEvent(EventForm form);

    @Mapping(target = "id", source = "id", qualifiedByName = "toBase64")
    @Mapping(target = "startDate", source = "startTime", qualifiedByName = "formatDate")
    @Mapping(target = "startTime", source = "startTime", qualifiedByName = "formatTime")
    EventForm toForm(Event event);

    @Nonnull
    default EntityWithForm<Event, EventForm> toCombination(@Nonnull Event event) {
        return new EntityWithForm<>(event, toForm(event));
    }
}
