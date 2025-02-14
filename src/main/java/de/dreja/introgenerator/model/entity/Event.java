package de.dreja.introgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import de.dreja.introgenerator.model.json.Base64Deserializer;
import de.dreja.introgenerator.model.json.Base64Serializer;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

import java.time.LocalDateTime;

public record Event(@JsonProperty(required = true)
                    @JsonSerialize(using = Base64Serializer.class)
                    @JsonDeserialize(using = Base64Deserializer.class)
                    @JsonFormat(shape = JsonFormat.Shape.STRING)
                    int id,
                    @Nonnull
                    @JsonProperty(required = true)
                    LocalDateTime startTime,
                    @Nonnull
                    @JsonProperty(required = true)
                    String title,
                    @Nullable
                    @JsonProperty
                    String subTitle,
                    @Nullable
                    @JsonProperty
                    Image image) implements Entity {

}
