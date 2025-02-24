package de.dreja.introgenerator.model.mapper;

import jakarta.annotation.Nullable;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
public class Base64ContentSerializer {

    private final Base64.Encoder encoder;

    public Base64ContentSerializer() {
        encoder = Base64.getEncoder();
    }

    @Nullable
    @Named("contentToBase64")
    public String contentToBase64(@Nullable byte[] content) {
        if (content == null || content.length == 0) {
            return null;
        }
        return encoder.encodeToString(content);
    }
}
