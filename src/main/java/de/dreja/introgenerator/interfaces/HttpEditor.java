package de.dreja.introgenerator.interfaces;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.dreja.introgenerator.model.entity.Event;
import de.dreja.introgenerator.model.entity.Presentation;
import de.dreja.introgenerator.model.form.EventForm;
import de.dreja.introgenerator.model.form.PresentationForm;
import de.dreja.introgenerator.model.mapper.EventMapper;
import de.dreja.introgenerator.model.mapper.IdService;
import de.dreja.introgenerator.model.mapper.PresentationMapper;
import de.dreja.introgenerator.model.mapper.Base64IdSerializer;
import de.dreja.introgenerator.service.EntityCache;
import de.dreja.introgenerator.service.ResourceService;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
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

import java.util.List;
import java.util.Map;

@Controller
public class HttpEditor {

    private static final TypeReference<Presentation> PRESENTATION_REF = new TypeReference<>() {
    };
    private static final TypeReference<List<Event>> EVENTS_REF = new TypeReference<>() {
    };

    private static final String INPUT_JSON =
            """
            const presentationJson = '%s';
            const eventsJson = '%s';
            """;
    private static final String BACKGROUND_IMAGE =
            """
            body {
                background-image: url("data:%s;base64,%s");
            }
            """;

    private static final Logger LOG = LoggerFactory.getLogger(HttpEditor.class);

    private final EntityCache entityCache;
    private final PresentationMapper presentationMapper;
    private final EventMapper eventMapper;
    private final IdService idService;
    private final ObjectMapper objectMapper;
    private final ResourceService resourceService;

    private final Resource bootStrapCss = new ClassPathResource("static/bootstrap.css");
    private final Resource appCss = new ClassPathResource("static/app.css");
    private final Resource background = new ClassPathResource("static/wood-full-hd.jpg");
    private final Resource mainJs = new ClassPathResource("static/js/main.js");
    private final Resource timeJs = new ClassPathResource("static/js/time.js");

    @Autowired
    HttpEditor(EntityCache entityCache,
               PresentationMapper presentationMapper,
               EventMapper eventMapper,
               IdService idService,
               ObjectMapper objectMapper,
               Base64IdSerializer base64Serializer, ResourceService resourceService) {
        this.entityCache = entityCache;
        this.presentationMapper = presentationMapper;
        this.eventMapper = eventMapper;
        this.idService = idService;
        this.objectMapper = objectMapper;
        this.resourceService = resourceService;
    }

    @GetMapping({"/"})
    public ModelAndView getStartPage(Map<String, Object> model) {
        model.put("presentation", presentationMapper.toForm(Presentation.newToday()));
        model.put("presentationUrl", "/presentation");

        model.put("bootstrapCss", resourceService.loadUtf8("bootstrapCss" ,bootStrapCss));
        model.put("appCss", resourceService.loadUtf8("appCss", appCss));
        model.put("backgroundImage",
                BACKGROUND_IMAGE.formatted("image/jpeg",
                        resourceService.loadBase64("backgroundImage", background)));
        return new ModelAndView("index", model);
    }

    @GetMapping("/presentation/{presentationId}")
    public ModelAndView getPresentation(@PathVariable("presentationId")
                                        @Nonnull
                                        String presentationId,
                                        Map<String, Object> model) {
        // Main Presentation form
        final Presentation presentation = findPresentation(presentationId);
        model.put("presentation", presentationMapper.toForm(presentation));
        model.put("presentationUrl", "/presentation");

        // Events for presentation form
        final var events = entityCache.getEventsOf(presentation)
                .map(eventMapper::toCombination)
                .toList();
        model.put("events", events);
        model.put("eventsUrl", "/events-for/" + idService.toBase64(presentation.id()));
        model.put("emptyEvent", eventMapper.toCombination(Event.newToday()));

        model.put("bootstrapCss", resourceService.loadUtf8("bootstrapCss", bootStrapCss));
        model.put("appCss", resourceService.loadUtf8("appCss", appCss));
        model.put("backgroundImage",
                BACKGROUND_IMAGE.formatted("image/jpeg",
                        resourceService.loadBase64("backgroundImage", background)));
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
        final Presentation presentation = findPresentation(presentationId);
        final Event event = eventMapper.toEvent(eventForm);
        entityCache.storeEvent(event);
        entityCache.addToPresentation(presentation, event);
        return seePresentation(presentation.id());
    }

    @Nonnull
    private Presentation findPresentation(@Nullable String presentationId) throws HttpClientErrorException {
        return idService.fromBase64(presentationId)
                .map(entityCache::getPresentation)
                .orElseThrow(() -> HttpClientErrorException.create(HttpStatus.NOT_FOUND,
                        "Presentation with ID %s not found!".formatted(presentationId),
                        null, null, null));
    }

    @Nonnull
    private ResponseEntity<Void> seePresentation(int presentationId) {
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .header("Location", "/presentation/" + idService.toBase64(presentationId))
                .build();
    }

    @Nonnull
    private <T> String generateJson(@Nonnull T object, @Nonnull TypeReference<T> typeReference) {
        try {
            return objectMapper.writerFor(typeReference).writeValueAsString(object);
        } catch (JsonProcessingException ex) {
            LOG.atWarn().setCause(ex).log("Could not generate JSON from {}", object);
            return "";
        }
    }

    @GetMapping("/final-presentation/{presentationId}")
    public ModelAndView getFinalPresentation(@PathVariable("presentationId")
                                             @Nonnull
                                             String presentationId,
                                             Map<String, Object> model) {
        final Presentation presentation = findPresentation(presentationId);
        final String presentationJson = generateJson(presentation, PRESENTATION_REF);

        final List<Event> events = entityCache.getEventsOf(presentation).toList();
        final String eventsJson = generateJson(events, EVENTS_REF);
        model.put("mainJs", resourceService.loadUtf8("mainJs", mainJs));
        model.put("timeJs", resourceService.loadUtf8("timeJs", timeJs));
        model.put("presentationJson", INPUT_JSON.formatted(presentationJson, eventsJson));

        model.put("bootstrapCss", resourceService.loadUtf8("bootstrapCss", bootStrapCss));
        model.put("appCss", resourceService.loadUtf8("appCss", appCss));
        model.put("backgroundImage",
                BACKGROUND_IMAGE.formatted("image/jpeg",
                        resourceService.loadBase64("backgroundImage", background)));
        return new ModelAndView("presentation", model);
    }

}
