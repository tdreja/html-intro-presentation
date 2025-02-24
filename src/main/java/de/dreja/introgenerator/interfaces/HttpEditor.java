package de.dreja.introgenerator.interfaces;

import de.dreja.introgenerator.model.form.EventData;
import de.dreja.introgenerator.model.form.EventForm;
import de.dreja.introgenerator.model.form.PresentationForm;
import de.dreja.introgenerator.model.mapper.Base64IdDeserializer;
import de.dreja.introgenerator.model.mapper.Base64IdSerializer;
import de.dreja.introgenerator.model.mapper.EventMapper;
import de.dreja.introgenerator.model.mapper.PresentationMapper;
import de.dreja.introgenerator.model.persistence.Event;
import de.dreja.introgenerator.model.persistence.Image;
import de.dreja.introgenerator.model.persistence.Presentation;
import de.dreja.introgenerator.service.ResourceService;
import de.dreja.introgenerator.service.persistence.EventRepository;
import de.dreja.introgenerator.service.persistence.ImageRepository;
import de.dreja.introgenerator.service.persistence.PresentationRepository;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MimeType;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Controller
public class HttpEditor {

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

    private final PresentationRepository presentationRepository;
    private final EventRepository eventRepository;

    private final Base64IdDeserializer idDeserializer;
    private final Base64IdSerializer idSerializer;
    private final PresentationMapper presentationMapper;
    private final EventMapper eventMapper;
    private final ResourceService resourceService;

    private final Resource bootStrapCss = new ClassPathResource("static/bootstrap.css");
    private final Resource appCss = new ClassPathResource("static/app.css");
    private final Resource background = new ClassPathResource("static/wood-full-hd.jpg");
    private final ImageRepository imageRepository;

    @Autowired
    HttpEditor(PresentationRepository presentationRepository,
               EventRepository eventRepository,
               Base64IdDeserializer idDeserializer,
               Base64IdSerializer idSerializer,
               PresentationMapper presentationMapper,
               EventMapper eventMapper,
               ResourceService resourceService, ImageRepository imageRepository) {
        this.presentationRepository = presentationRepository;
        this.eventRepository = eventRepository;
        this.idDeserializer = idDeserializer;
        this.idSerializer = idSerializer;
        this.presentationMapper = presentationMapper;
        this.eventMapper = eventMapper;
        this.resourceService = resourceService;
        this.imageRepository = imageRepository;
    }

    @GetMapping({"/"})
    @Transactional(readOnly = true)
    public ModelAndView getStartPage(Map<String, Object> model) {
        final Presentation nextSunday = new Presentation();
        nextSunday.setCountdownEndTime(
                LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.SUNDAY)).atTime(10, 30));
        nextSunday.setCountdownRunTime(Duration.ofMinutes(15));
        model.put("presentation", presentationMapper.toData(nextSunday));
        model.put("presentationUrl", "/presentation");

        final var activePresentations = presentationRepository.findAllByCountdownEndTimeAfter(LocalDateTime.now()).stream()
                .map(presentation -> presentationMapper.toDisplay(presentation, Locale.GERMAN))
                .toList();
        model.put("activePresentations", activePresentations);

        model.put("bootstrapCss", resourceService.loadUtf8("bootstrapCss", bootStrapCss));
        model.put("appCss", resourceService.loadUtf8("appCss", appCss));
        model.put("backgroundImage",
                BACKGROUND_IMAGE.formatted("image/jpeg",
                        resourceService.loadBase64("backgroundImage", background)));
        return new ModelAndView("index", model);
    }

    @GetMapping("/presentation/{presentationId}")
    @Transactional
    public ModelAndView getPresentation(@PathVariable("presentationId")
                                        @Nonnull
                                        String presentationId,
                                        Map<String, Object> model) {
        // Main Presentation form
        final Presentation presentation = requirePresentation(presentationId);
        model.put("presentation", presentationMapper.toData(presentation));
        model.put("presentationUrl", "/presentation");

        // Events for presentation form
        final List<EventData> events = presentation.getEvents().stream()
                .map(eventMapper::toData)
                .toList();
        model.put("events", events);
        model.put("eventsUrl", "/events-for/" + presentationId);
        model.put("emptyEvent", eventMapper.toData(new Event()));

        model.put("bootstrapCss", resourceService.loadUtf8("bootstrapCss", bootStrapCss));
        model.put("appCss", resourceService.loadUtf8("appCss", appCss));
        model.put("backgroundImage",
                BACKGROUND_IMAGE.formatted("image/jpeg",
                        resourceService.loadBase64("backgroundImage", background)));
        return new ModelAndView("presentation", model);
    }

    @PostMapping("/presentation")
    @Transactional
    public ResponseEntity<Void> createOrUpdatePresentation(@ModelAttribute
                                                           @Nonnull
                                                           PresentationForm presentationForm) {
        final Optional<Presentation> result = findPresentation(presentationForm.id());
        if (result.isPresent()) {
            final Presentation presentation = result.get();
            presentationMapper.updatePersistence(presentationForm, presentation);
            presentationRepository.saveAndFlush(presentation);
            return seePresentation(presentation.getId());
        }

        final Presentation presentation = new Presentation();
        presentationMapper.updatePersistence(presentationForm, presentation);
        presentationRepository.saveAndFlush(presentation);
        return seePresentation(presentation.getId());
    }

    @PostMapping("/events-for/{presentationId}")
    @Transactional
    public ResponseEntity<Void> createOrUpdateEvent(@PathVariable("presentationId")
                                                    @Nonnull
                                                    String presentationId,
                                                    @ModelAttribute
                                                    @Nonnull
                                                    EventForm eventForm) {
        final Presentation presentation = requirePresentation(presentationId);
        final var foundEvent = idDeserializer.fromBase64(eventForm.id()).stream().boxed()
                .flatMap(id -> presentation.getEvents().stream().filter(event -> id.equals(event.getId())))
                .findAny();

        if (foundEvent.isPresent()) {
            final Event event = foundEvent.get();
            eventMapper.updatePersistence(eventForm, event);
            eventRepository.saveAndFlush(event);
            return seePresentation(presentation.getId());
        }

        final Event newEvent = new Event();
        newEvent.setPresentation(presentation);
        presentation.getEvents().add(newEvent);
        eventMapper.updatePersistence(eventForm, newEvent);
        presentationRepository.saveAndFlush(presentation);
        eventRepository.saveAndFlush(newEvent);
        return seePresentation(presentation.getId());
    }

    @PostMapping("/images-for/{eventId}")
    @Transactional
    public ResponseEntity<Void> createOrUpdateImage(@PathVariable("eventId")
                                                    @Nonnull
                                                    String eventId,
                                                    @RequestParam("imageFile") MultipartFile file) {
        final Event event = idDeserializer.fromBase64(eventId).stream().boxed()
                .flatMap(id -> eventRepository.findById(id).stream())
                .findAny()
                .orElseThrow(NoSuchElementException::new);
        Image image = event.getImage();
        if (image == null) {
            image = new Image();
        }
        try {
            image.setEvent(event);
            image.setMimeType(file.getContentType() == null
                    ? MimeTypeUtils.APPLICATION_OCTET_STREAM
                    : MimeType.valueOf(file.getContentType()));
            image.setContent(file.getBytes());
            image.setFileName(file.getOriginalFilename() == null
                    ? "file"
                    : file.getOriginalFilename());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        eventRepository.saveAndFlush(event);
        imageRepository.saveAndFlush(image);
        return seePresentation(event.getPresentation().getId());
    }

    @Nonnull
    private ResponseEntity<Void> seePresentation(long presentationId) {
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .header("Location", "/presentation/" + idSerializer.toBase64(presentationId))
                .build();
    }

    @Nonnull
    @Transactional
    protected Presentation requirePresentation(@Nullable String base64Id) {
        return findPresentation(base64Id)
                .orElseThrow(NoSuchElementException::new);
    }

    @Nonnull
    @Transactional
    protected Optional<Presentation> findPresentation(@Nullable String base64Id) {
        return idDeserializer.fromBase64(base64Id).stream().boxed()
                .flatMap(id -> presentationRepository.findById(id).stream())
                .findAny();
    }
}
