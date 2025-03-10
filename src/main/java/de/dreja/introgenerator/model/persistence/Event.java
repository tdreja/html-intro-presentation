package de.dreja.introgenerator.model.persistence;

import de.dreja.introgenerator.service.persistence.LocalDateTimeConverter;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "event")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private long id;

    @Column(nullable = false, name = "start_time")
    @Convert(converter = LocalDateTimeConverter.class)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private String title;

    @Column
    @Nullable
    private String description;

    @ManyToOne(targetEntity = Presentation.class, optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "presentation_id")
    private Presentation presentation;

    @OneToOne(targetEntity = Image.class, fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "event")
    private Image image;

    public long getId() {
        return id;
    }

    @Nonnull
    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(@Nonnull LocalDateTime startTime) {
        this.startTime = startTime;
    }

    @Nonnull
    public String getTitle() {
        return title;
    }

    public void setTitle(@Nonnull String title) {
        this.title = title;
    }

    @Nullable
    public String getDescription() {
        return description;
    }

    public void setDescription(@Nullable String description) {
        this.description = description;
    }

    @Nonnull
    public Presentation getPresentation() {
        return presentation;
    }

    public void setPresentation(@Nonnull Presentation presentation) {
        this.presentation = presentation;
    }

    @Nullable
    public Image getImage() {
        return image;
    }

    public void setImage(@Nullable Image image) {
        this.image = image;
    }
}
