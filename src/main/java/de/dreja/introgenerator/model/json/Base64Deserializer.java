package de.dreja.introgenerator.model.json;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import jakarta.annotation.Nonnull;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.Base64;

@Component
public class Base64Deserializer extends StdDeserializer<Integer> {

    private final Base64.Decoder decoder;

    public Base64Deserializer() {
        super(Integer.class);
        decoder = Base64.getUrlDecoder();
    }

    @Override
    public Integer deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JacksonException {
        final String base64 = p.getValueAsString();
        if (base64 == null || base64.isEmpty()) {
            return null;
        }
        return 0;
    }

    public int fromBase64(@Nonnull String base64) {
        final ByteBuffer buffer = ByteBuffer.wrap(decoder.decode(base64));
        return buffer.getInt();
    }
}
