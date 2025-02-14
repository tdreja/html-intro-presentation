package de.dreja.introgenerator.model.mapper;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.OptionalInt;
import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class IdService {

    private final Base64Deserializer base64Deserializer;
    private final Base64Serializer base64Serializer;
    private final AtomicInteger nextId;

    @Autowired
    IdService(Base64Deserializer base64Deserializer, Base64Serializer base64Serializer) {
        this.base64Deserializer = base64Deserializer;
        this.base64Serializer = base64Serializer;
        nextId = new AtomicInteger(new Random().nextInt(100_000));
    }

    @Named("nextId")
    public int getNextId() {
        return nextId.getAndIncrement();
    }

    @Named("parseBase64OrCreateNew")
    public int parseBase64OrCreateNew(@Nullable String base64) {
        final int id = base64Deserializer.fromBase64(base64);
        if (id <= 0) {
            return nextId.getAndIncrement();
        }
        return id;
    }

    @Nonnull
    public Optional<Integer> fromBase64(@Nullable String base64) {
        final int id = base64Deserializer.fromBase64(base64);
        if(id <= 0) {
            return Optional.empty();
        }
        return Optional.of(id);
    }

    @Nonnull
    public String toBase64(int id) {
        final String base64 = base64Serializer.toBase64(id);
        if(base64 == null) {
            return "";
        }
        return base64;
    }
}
