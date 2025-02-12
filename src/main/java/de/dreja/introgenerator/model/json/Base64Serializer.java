package de.dreja.introgenerator.model.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import jakarta.annotation.Nonnull;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.Base64;

@Component
public class Base64Serializer extends StdSerializer<Integer> {

    private final Base64.Encoder encoder;

    public Base64Serializer() {
        super(Integer.class);
        encoder = Base64.getUrlEncoder().withoutPadding();
    }

    @Override
    public void serialize(Integer value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        if (value == null) {
            gen.writeNull();
        } else {
            gen.writeString(toBase64(value));
        }
    }

    @Nonnull
    public String toBase64(int value) {
        final ByteBuffer buffer = ByteBuffer.allocate(Integer.BYTES);
        buffer.putInt(value);
        return encoder.encodeToString(buffer.array());
    }
}
