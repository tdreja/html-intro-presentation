package de.dreja.introgenerator.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

import java.nio.ByteBuffer;
import java.util.Base64;
import java.util.OptionalLong;

public final class Base64Id implements Comparable<Base64Id> {

    public static final Base64Id ONE = new Base64Id(1);

    private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder DECODER = Base64.getUrlDecoder();

    private final long id;
    private final String base64;

    public Base64Id(long id) {
        this.id = id;
        this.base64 = toBase64(this.id);
    }

    @JsonCreator
    Base64Id fromJson(@Nonnull String base64) {
        final var id = fromBase64(base64);
        if (id.isPresent()) {
            return new Base64Id(id.getAsLong());
        }
        throw new IllegalArgumentException("Invalid Base64 ID: " + base64);
    }

    @JsonIgnore
    public long getId() {
        return id;
    }

    @Nonnull
    public Base64Id next() {
        return new Base64Id(id + 1);
    }

    @Nonnull
    public Base64Id increment(long factor) {
        return new Base64Id(id + factor);
    }

    @JsonValue
    public String getBase64() {
        return base64;
    }

    @Override
    public String toString() {
        return base64;
    }

    @Nonnull
    private static String toBase64(long id) {
        final ByteBuffer byteBuffer = ByteBuffer.allocate(Long.BYTES);
        byteBuffer.putLong(id);
        return ENCODER.encodeToString(byteBuffer.array());
    }

    @Nonnull
    private static OptionalLong fromBase64(@Nullable String base64) {
        if (base64 == null || base64.isEmpty()) {
            return OptionalLong.empty();
        }
        try {
            final ByteBuffer byteBuffer = ByteBuffer.wrap(DECODER.decode(base64));
            return OptionalLong.of(byteBuffer.getLong());
        } catch (IllegalArgumentException ex) {
            return OptionalLong.empty();
        }
    }

    @Override
    public int compareTo(@Nonnull Base64Id o) {
        return Long.compare(id, o.id);
    }

    @Override
    public boolean equals(@Nullable Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Base64Id base64Id = (Base64Id) o;
        return id == base64Id.id;
    }

    @Override
    public int hashCode() {
        return Long.hashCode(id);
    }
}
