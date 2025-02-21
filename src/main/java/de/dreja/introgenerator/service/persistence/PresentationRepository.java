package de.dreja.introgenerator.service.persistence;

import de.dreja.introgenerator.model.persistence.Presentation;
import jakarta.annotation.Nonnull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PresentationRepository extends JpaRepository<Presentation, Long> {

    @Nonnull
    List<Presentation> findAllByCountdownEndTimeAfter(@Nonnull LocalDateTime endTime);
}
