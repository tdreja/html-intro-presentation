package de.dreja.introgenerator.model.mapper;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.Base64;

@Component
public class Base64IdSerializer extends StdSerializer<Integer> {

    private final Base64.Encoder encoder;

    public Base64IdSerializer() {
        super(Integer.class);
        encoder = Base64.getUrlEncoder().withoutPadding();
    }

    @Override
    public void serialize(Integer value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        if (value == null) {
            gen.writeNull();
        } else {
            gen.writeString(toBase64Internal(value));
        }
    }

    @Nullable
    @Named("toBase64")
    public String toBase64(@Nullable Integer value) {
        return (value == null || value == 0) ? null : toBase64Internal(value);
    }

    @Nonnull
    private String toBase64Internal(int value) {
        final ByteBuffer buffer = ByteBuffer.allocate(Integer.BYTES);
        buffer.putInt(value);
        return encoder.encodeToString(buffer.array());
    }
}
