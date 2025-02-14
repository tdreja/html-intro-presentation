package de.dreja.introgenerator.model.mapper;

import de.dreja.introgenerator.model.entity.Event;
import de.dreja.introgenerator.model.form.EventForm;
import de.dreja.introgenerator.model.json.Base64Deserializer;
import de.dreja.introgenerator.model.json.Base64Serializer;
import de.dreja.introgenerator.model.json.LocalDateTimeService;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        uses = {
                Base64Deserializer.class, Base64Serializer.class, LocalDateTimeService.class
        },
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface EventMapper {

    @Mapping(target = "id", source = "id", qualifiedByName = "fromBase64")
    @Mapping(target = "image", ignore = true)
    @Mapping(target = "startTime", source = ".", qualifiedByName = "parseTimeStamp")
    Event toEvent(EventForm form);

    @Mapping(target = "id", source = "id", qualifiedByName = "toBase64")
    @Mapping(target = "startDate", source = "startTime", qualifiedByName = "formatDate")
    @Mapping(target = "startTime", source = "startTime", qualifiedByName = "formatTime")
    EventForm toForm(Event event);
}
