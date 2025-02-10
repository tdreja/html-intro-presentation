package de.dreja.introgenerator.interfaces;

import de.dreja.introgenerator.model.Presentation;
import jakarta.annotation.Nonnull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@RestController
public class RestTemp {

    @Nonnull
    @GetMapping("/presentation")
    public Presentation getPresentation() {
        return new Presentation(LocalDateTime.now(), Duration.ZERO, "", "", List.of());
    }
}
