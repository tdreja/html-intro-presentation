package de.dreja.introgenerator.model.mapper;

import de.dreja.introgenerator.model.entity.Presentation;
import de.dreja.introgenerator.model.form.PresentationForm;
import de.dreja.introgenerator.model.json.Base64Deserializer;
import de.dreja.introgenerator.model.json.Base64Serializer;
import de.dreja.introgenerator.model.json.DurationService;
import de.dreja.introgenerator.model.json.LocalDateTimeService;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        uses = {
                Base64Deserializer.class, Base64Serializer.class,
                LocalDateTimeService.class, DurationService.class,
                EventMapper.class
        },
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface PresentationMapper {

    @Mapping(target = "id", source = "id", qualifiedByName = "fromBase64")
    @Mapping(target = "countdownEnd", source = ".", qualifiedByName = "parseTimeStamp")
    @Mapping(target = "countdownRuntime", source = ".", qualifiedByName = "getDuration")
    Presentation toPresentation(PresentationForm form);


    @Mapping(target = "id", source = "id", qualifiedByName = "toBase64")
    @Mapping(target = "countdownEndDate", source = "countdownEnd", qualifiedByName = "formatDate")
    @Mapping(target = "countdownEndTime", source = "countdownEnd", qualifiedByName = "formatTime")
    @Mapping(target = "countdownRuntimeMinutes", source = "countdownRuntime", qualifiedByName = "getMinutes")
    @Mapping(target = "countdownRuntimeSeconds", source = "countdownRuntime", qualifiedByName = "getSeconds")
    PresentationForm toForm(Presentation presentation);
}
