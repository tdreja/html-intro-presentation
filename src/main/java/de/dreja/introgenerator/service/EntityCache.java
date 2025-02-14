package de.dreja.introgenerator.service;

import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class EntityCache {

    private final int lastId;

    EntityCache() {
        lastId = new Random().nextInt(100_000);
    }
}
