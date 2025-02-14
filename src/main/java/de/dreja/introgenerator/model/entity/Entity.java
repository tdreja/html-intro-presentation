package de.dreja.introgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import de.dreja.introgenerator.model.mapper.Base64Deserializer;
import de.dreja.introgenerator.model.mapper.Base64Serializer;

public interface Entity {

    @JsonSerialize(using = Base64Serializer.class)
    @JsonDeserialize(using = Base64Deserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    int id();
}
