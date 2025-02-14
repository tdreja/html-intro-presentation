package de.dreja.introgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import de.dreja.introgenerator.model.mapper.Base64IdDeserializer;
import de.dreja.introgenerator.model.mapper.Base64IdSerializer;

public interface Entity {

    @JsonSerialize(using = Base64IdSerializer.class)
    @JsonDeserialize(using = Base64IdDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    int id();
}
