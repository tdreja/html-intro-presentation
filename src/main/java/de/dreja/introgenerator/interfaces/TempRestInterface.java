package de.dreja.introgenerator.interfaces;

import de.dreja.introgenerator.model.TimedEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

@RestController
public class TempRestInterface {

    @GetMapping("/timed-event")
    public TimedEvent getTimedEvent() {
        return new TimedEvent("", "", "".getBytes(StandardCharsets.UTF_8), LocalDateTime.now(), null);
    }
}
