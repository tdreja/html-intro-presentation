package de.dreja.introgenerator.service;

import jakarta.annotation.Nonnull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class ResourceService {

    private static final Logger LOG = LoggerFactory.getLogger(ResourceService.class);
    private final Base64.Encoder encoder = Base64.getEncoder();

    private final Map<String, String> cache = new HashMap<>();

    @Nonnull
    public String loadUtf8(@Nonnull String variable, @Nonnull Resource resource) {
        if(cache.containsKey(variable)) {
            return cache.get(variable);
        }

        synchronized (cache) {
            try {
                final String result = resource.getContentAsString(StandardCharsets.UTF_8);
                cache.put(variable, result);
                return result;
            } catch (IOException e) {
                LOG.atWarn().setCause(e).log("Could not load resource as UTF-8 text: {}", resource.getFilename());
                return "";
            }
        }
    }

    @Nonnull
    public String loadBase64(@Nonnull String variable, @Nonnull Resource resource) {
        if(cache.containsKey(variable)) {
            return cache.get(variable);
        }

        synchronized (cache) {
            try {
                final String result = encoder.encodeToString(resource.getContentAsByteArray());
                cache.put(variable, result);
                return result;
            } catch (IOException e) {
                LOG.atWarn().setCause(e).log("Could not load resource as Base64 text: {}", resource.getFilename());
                return "";
            }
        }
    }
}
