package de.dreja.introgenerator.service.persistence;

import de.dreja.introgenerator.model.persistence.Presentation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PresentationRepository extends JpaRepository<Presentation, Long> {
}
