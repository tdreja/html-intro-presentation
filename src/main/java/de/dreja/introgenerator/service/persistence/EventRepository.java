package de.dreja.introgenerator.service.persistence;

import de.dreja.introgenerator.model.persistence.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
}
