package de.dreja.introgenerator.model.persistence;

import de.dreja.introgenerator.service.persistence.EventRepository;
import de.dreja.introgenerator.service.persistence.ImageRepository;
import de.dreja.introgenerator.service.persistence.PresentationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MimeTypeUtils;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class PresentationPersistenceTest {

    private static final LocalDateTime TARGET_TIME
            = LocalDateTime.of(2024, 10, 15, 13, 37, 15);

    private final PresentationRepository presentationRepository;
    private final EventRepository eventRepository;
    private final ImageRepository imageRepository;

    private Long presentationId;
    private Long eventId;
    private Long imageId;

    @Autowired
    PresentationPersistenceTest(PresentationRepository presentationRepository,
                                EventRepository eventRepository, ImageRepository imageRepository) {
        this.presentationRepository = presentationRepository;
        this.eventRepository = eventRepository;
        this.imageRepository = imageRepository;
    }

    @BeforeEach
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void setupData() {
        final Presentation presentation = new Presentation();
        presentation.setCountdownEndTime(TARGET_TIME);
        presentation.setTitle("Presentation Title");
        presentation.setDescription("Presentation Description");
        presentation.setCountdownRunTime(Duration.ofSeconds(10));
        presentationRepository.saveAndFlush(presentation);

        final Event event = new Event();
        event.setStartTime(TARGET_TIME);
        event.setTitle("Event Title");
        event.setDescription("Event Description");
        event.setPresentation(presentation);
        eventRepository.saveAndFlush(event);
        presentation.getEvents().add(event);
        presentationRepository.saveAndFlush(presentation);

        final Image image = new Image();
        image.setFileName("image");
        image.setMimeType(MimeTypeUtils.IMAGE_JPEG);
        image.setContent("test".getBytes(StandardCharsets.UTF_8));
        image.setEvent(event);
        imageRepository.saveAndFlush(image);
        event.setImage(image);
        eventRepository.saveAndFlush(event);

        presentationId = presentation.getId();
        eventId = event.getId();
        imageId = image.getId();
    }

    @Test
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void testPersistence() {
        assertThat(presentationId).isNotNull();
        assertThat(eventId).isNotNull();
        assertThat(imageId).isNotNull();

        final Presentation presentation = presentationRepository.findById(presentationId).orElse(null);
        assertThat(presentation).isNotNull()
                .hasNoNullFieldsOrProperties()
                .hasFieldOrPropertyWithValue("countdownEndTime", TARGET_TIME)
                .hasFieldOrPropertyWithValue("title", "Presentation Title")
                .hasFieldOrPropertyWithValue("description", "Presentation Description")
                .hasFieldOrPropertyWithValue("countdownRunTime", Duration.ofSeconds(10));
        assertThat(presentation.getEvents()).isNotNull()
                .isNotEmpty().hasSize(1);
        final Event event = presentation.getEvents().getFirst();
        assertThat(event).isNotNull()
                .hasNoNullFieldsOrProperties()
                .hasFieldOrPropertyWithValue("id", eventId)
                .hasFieldOrPropertyWithValue("startTime", TARGET_TIME)
                .hasFieldOrPropertyWithValue("title", "Event Title")
                .hasFieldOrPropertyWithValue("description", "Event Description");

        final Image image = event.getImage();
        assertThat(image).isNotNull()
                .hasNoNullFieldsOrProperties()
                .hasFieldOrPropertyWithValue("id", imageId)
                .hasFieldOrPropertyWithValue("fileName", "image")
                .hasFieldOrPropertyWithValue("mimeType", MimeTypeUtils.IMAGE_JPEG)
                .hasFieldOrPropertyWithValue("content", "test".getBytes(StandardCharsets.UTF_8));
    }
}
