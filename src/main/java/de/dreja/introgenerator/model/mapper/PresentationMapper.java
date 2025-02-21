package de.dreja.introgenerator.model.mapper;

import de.dreja.introgenerator.model.form.PresentationData;
import de.dreja.introgenerator.model.form.PresentationForm;
import de.dreja.introgenerator.model.persistence.Presentation;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import org.mapstruct.*;

import java.util.Objects;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        uses = {
                Base64IdSerializer.class,
                LocalDateTimeMapper.class, DurationMapper.class,
                EventMapper.class
        },
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface PresentationMapper {

    @Mapping(target = "id", source = "id", qualifiedByName = "toBase64")
    @Mapping(target = "countdownEndDate", source = "countdownEndTime", qualifiedByName = "timeToDateForm")
    @Mapping(target = "countdownEndTime", source = "countdownEndTime", qualifiedByName = "timeToTimeForm")
    @Mapping(target = "countdownRuntimeMinutes", source = "countdownRunTime", qualifiedByName = "durationToMinuteForm")
    @Mapping(target = "countdownRuntimeSeconds", source = "countdownRunTime", qualifiedByName = "durationToSecondsForm")
    @Nullable
    PresentationForm persistenceToForm(@Nullable Presentation event);

    @Mapping(target = "countdownEndTime", source = "countdownEnd", qualifiedByName = "formToTime")
    @Mapping(target = "countdownRunTime", source = "countdownRuntime", qualifiedByName = "formToDuration")
    @Mapping(target = "events", ignore = true)
    void updatePersistence(@Nullable PresentationForm form, @Nullable @MappingTarget Presentation event);

    @Nonnull
    default PresentationData toData(@Nonnull Presentation presentation) {
        return new PresentationData(presentation, Objects.requireNonNull(persistenceToForm(presentation)));
    }
}
