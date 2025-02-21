package de.dreja.introgenerator.model.persistence;

import de.dreja.introgenerator.service.persistence.EventRepository;
import de.dreja.introgenerator.service.persistence.PresentationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class PresentationPersistenceTest {

    private static final LocalDateTime TARGET_TIME
            = LocalDateTime.of(2024, 10, 15, 13, 37, 15);

    private final PresentationRepository presentationRepository;
    private final EventRepository eventRepository;

    private Long presentationId;
    private Long eventId;

    @Autowired
    PresentationPersistenceTest(PresentationRepository presentationRepository,
                                EventRepository eventRepository) {
        this.presentationRepository = presentationRepository;
        this.eventRepository = eventRepository;
    }

    @BeforeEach
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void setupData() {
        final Presentation presentation = new Presentation();
        presentation.setStartTime(TARGET_TIME);
        presentation.setTitle("Presentation Title");
        presentation.setDescription("Presentation Description");
        presentation.setCountdownRunTimeSeconds(10);
        presentationRepository.save(presentation);

        final Event event = new Event();
        event.setStartTime(TARGET_TIME);
        event.setTitle("Event Title");
        event.setDescription("Event Description");
        event.setPresentation(presentation);
        eventRepository.save(event);
        presentation.getEvents().add(event);
        presentationRepository.save(presentation);

        presentationId = presentation.getId();
        eventId = event.getId();
    }

    @Test
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void testPersistence() {
        assertThat(presentationId).isNotNull();
        assertThat(eventId).isNotNull();

        final Presentation presentation = presentationRepository.findById(presentationId).orElse(null);
        assertThat(presentation).isNotNull()
                .hasNoNullFieldsOrProperties()
                .hasFieldOrPropertyWithValue("startTime", TARGET_TIME)
                .hasFieldOrPropertyWithValue("title", "Presentation Title")
                .hasFieldOrPropertyWithValue("description", "Presentation Description")
                .hasFieldOrPropertyWithValue("countdownRunTimeSeconds", 10L);
        assertThat(presentation.getEvents()).isNotNull()
                .isNotEmpty().hasSize(1);
        final Event event = presentation.getEvents().getFirst();
        assertThat(event).isNotNull()
                .hasNoNullFieldsOrProperties()
                .hasFieldOrPropertyWithValue("id", eventId)
                .hasFieldOrPropertyWithValue("startTime", TARGET_TIME)
                .hasFieldOrPropertyWithValue("title", "Event Title")
                .hasFieldOrPropertyWithValue("description", "Event Description");
    }
}
