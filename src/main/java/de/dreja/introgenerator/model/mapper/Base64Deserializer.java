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

@Component
public class Base64Deserializer extends StdDeserializer<Integer> {

    private static final Logger LOG = LoggerFactory.getLogger(Base64Deserializer.class);
    private final Base64.Decoder decoder;

    public Base64Deserializer() {
        super(Integer.class);
        decoder = Base64.getUrlDecoder();
    }

    @Override
    public Integer deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        final String base64 = p.getValueAsString();
        return fromBase64(base64);
    }

    @Named("fromBase64")
    public int fromBase64(@Nullable String base64) {
        if (base64 == null || base64.isBlank()) {
            return 0;
        }
        try {
            final ByteBuffer buffer = ByteBuffer.wrap(decoder.decode(base64));
            return buffer.getInt();
        } catch (RuntimeException ex) {
            LOG.atWarn().setCause(ex).log("Could not parse Base64 ID {}", base64);
            return 0;
        }
    }
}
