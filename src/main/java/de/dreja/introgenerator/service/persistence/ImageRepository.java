package de.dreja.introgenerator.service.persistence;

import de.dreja.introgenerator.model.persistence.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
}
