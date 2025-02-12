package de.dreja.introgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import de.dreja.introgenerator.model.json.Base64Deserializer;
import de.dreja.introgenerator.model.json.Base64Serializer;
import jakarta.annotation.Nullable;

public interface Entity {

    @JsonSerialize(using = Base64Serializer.class)
    @JsonDeserialize(using = Base64Deserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    int id();

    @JsonSerialize(using = Base64Serializer.class)
    @JsonDeserialize(using = Base64Deserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    int version();

    static <E extends Entity> boolean isEqualVersion(@Nullable E entity1, @Nullable E entity2) {
        if (entity1 == null) {
            return entity2 == null;
        }
        if (entity2 == null) {
            return false;
        }
        return entity1.id() == entity2.id() && entity1.version() == entity2.version();
    }
}
