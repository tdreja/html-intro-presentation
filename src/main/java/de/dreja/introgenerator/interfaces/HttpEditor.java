package de.dreja.introgenerator.interfaces;

import de.dreja.introgenerator.model.entity.Event;
import de.dreja.introgenerator.model.entity.Presentation;
import de.dreja.introgenerator.model.form.EventForm;
import de.dreja.introgenerator.model.form.PresentationForm;
import de.dreja.introgenerator.model.mapper.EventMapper;
import de.dreja.introgenerator.model.mapper.IdService;
import de.dreja.introgenerator.model.mapper.PresentationMapper;
import de.dreja.introgenerator.service.EntityCache;
import jakarta.annotation.Nonnull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Controller
public class HttpEditor {

    private static final Logger LOG = LoggerFactory.getLogger(HttpEditor.class);

    private final EntityCache entityCache;
    private final PresentationMapper presentationMapper;
    private final EventMapper eventMapper;
    private final IdService idService;
    private final Resource bootStrapResource = new ClassPathResource("static/bootstrap.css");

    @Autowired
    HttpEditor(EntityCache entityCache,
               PresentationMapper presentationMapper,
               EventMapper eventMapper,
               IdService idService) {
        this.entityCache = entityCache;
        this.presentationMapper = presentationMapper;
        this.eventMapper = eventMapper;
        this.idService = idService;
    }

    @GetMapping({"/"})
    public ModelAndView getStartPage(Map<String, Object> model) {
        model.put("presentation", presentationMapper.toForm(Presentation.newToday()));
        model.put("presentationUrl", "/presentation");
        addBootstrap(model);
        return new ModelAndView("index", model);
    }

    @GetMapping("/presentation/{presentationId}")
    public ModelAndView getPresentation(@PathVariable("presentationId")
                                        @Nonnull
                                        String presentationId,
                                        Map<String, Object> model) {
        final var found = idService.fromBase64(presentationId)
                .map(entityCache::getPresentation);
        if (found.isEmpty()) {
            throw HttpClientErrorException.create(HttpStatus.NOT_FOUND,
                    "Presentation with ID %s not found!".formatted(presentationId),
                    null, null, null);
        }

        // Main Presentation form
        final Presentation presentation = found.get();
        model.put("presentation", presentationMapper.toForm(presentation));
        model.put("presentationUrl", "/presentation");

        // Events for presentation form
        final List<EventForm> events = entityCache.getEventsOf(presentation)
                .map(eventMapper::toForm)
                .toList();
        model.put("events", events);
        model.put("eventsUrl", "/events-for/" + idService.toBase64(presentation.id()));
        model.put("emptyEvent", eventMapper.toForm(Event.newToday()));

        addBootstrap(model);
        return new ModelAndView("index", model);
    }

    @PostMapping("/presentation")
    public ResponseEntity<Void> createOrUpdatePresentation(@ModelAttribute
                                                           @Nonnull
                                                           PresentationForm presentationForm) {
        final Presentation presentation = presentationMapper.toPresentation(presentationForm);
        entityCache.storePresentation(presentation);
        return seePresentation(presentation.id());
    }

    @PostMapping("/events-for/{presentationId}")
    public ResponseEntity<Void> createOrUpdateEvent(@PathVariable("presentationId")
                                                    @Nonnull
                                                    String presentationId,
                                                    @ModelAttribute
                                                    @Nonnull
                                                    EventForm eventForm) {
        final var foundPresentation = idService.fromBase64(presentationId)
                .map(entityCache::getPresentation);
        if(foundPresentation.isEmpty()) {
            throw HttpClientErrorException.create(HttpStatus.NOT_FOUND,
                    "Presentation with ID %s not found!".formatted(presentationId),
                    null, null, null);
        }
        final Presentation presentation = foundPresentation.get();
        final Event event = eventMapper.toEvent(eventForm);
        entityCache.storeEvent(event);
        entityCache.addToPresentation(presentation, event);
        return seePresentation(presentation.id());
    }

    private void addBootstrap(@Nonnull Map<String, Object> model) {
        try {
            model.put("bootstrapCss", bootStrapResource.getContentAsString(StandardCharsets.UTF_8));
        } catch (IOException e) {
            model.put("bootstrapCss", "");
        }
    }

    @Nonnull
    private ResponseEntity<Void> seePresentation(int presentationId) {
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .header("Location", "/presentation/" + idService.toBase64(presentationId))
                .build();
    }

}
