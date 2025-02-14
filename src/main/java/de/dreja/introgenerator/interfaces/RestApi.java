package de.dreja.introgenerator.interfaces;

import de.dreja.introgenerator.model.entity.Event;
import de.dreja.introgenerator.model.entity.Presentation;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("api")
@Profile("open-api")
public class RestApi {

    @GetMapping("/presentation")
    public Presentation getPresentation() {
        return Presentation.newToday();
    }

    @GetMapping("/event")
    public Event getEvent() {
        return Event.newToday();
    }
}
