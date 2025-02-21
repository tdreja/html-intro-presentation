package de.dreja.introgenerator.model.mapper;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import jakarta.annotation.Nullable;
import org.mapstruct.Named;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.Base64;
import java.util.OptionalLong;

@Component
public class Base64IdDeserializer extends StdDeserializer<Long> {

    private static final Logger LOG = LoggerFactory.getLogger(Base64IdDeserializer.class);
    private final Base64.Decoder decoder;

    public Base64IdDeserializer() {
        super(Long.class);
        decoder = Base64.getUrlDecoder();
    }

    @Override
    @Nullable
    public Long deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        final String base64 = p.getValueAsString();
        final var id = fromBase64(base64);
        if(id.isPresent()) {
            return id.getAsLong();
        }
        return null;
    }

    @Named("fromBase64")
    public OptionalLong fromBase64(@Nullable String base64) {
        if (base64 == null || base64.isBlank()) {
            return OptionalLong.empty();
        }
        try {
            final byte[] raw = decoder.decode(base64);
            final ByteBuffer buffer = ByteBuffer.wrap(raw);
            if(raw.length == Integer.BYTES) {
                return OptionalLong.of(buffer.getInt());
            } else if(raw.length == Long.BYTES) {
                return OptionalLong.of(buffer.getLong());
            }
            return OptionalLong.empty();
        } catch (RuntimeException ex) {
            LOG.atWarn().setCause(ex).log("Could not parse Base64 ID {}", base64);
            return OptionalLong.empty();
        }
    }
}
