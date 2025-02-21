package de.dreja.introgenerator.model.persistence;

import de.dreja.introgenerator.service.persistence.DurationConverter;
import de.dreja.introgenerator.service.persistence.LocalDateTimeConverter;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "presentation")
public class Presentation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private long id;

    @Column(nullable = false, name = "countdown_end_time")
    @Convert(converter = LocalDateTimeConverter.class)
    @Nonnull
    private LocalDateTime countdownEndTime;

    @Column(nullable = false)
    @Nonnull
    private String title;

    @Column
    @Nullable
    private String description;

    @Column(nullable = false, name = "countdown_runtime_seconds")
    @Convert(converter = DurationConverter.class)
    @Nonnull
    private Duration countdownRuntime;

    @OneToMany(targetEntity = Event.class, mappedBy = "presentation")
    private List<Event> events = new ArrayList<>();

    public long getId() {
        return id;
    }

    @Nonnull
    public LocalDateTime getCountdownEndTime() {
        return countdownEndTime;
    }

    public void setCountdownEndTime(@Nonnull LocalDateTime countdownEndTime) {
        this.countdownEndTime = countdownEndTime;
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
    public Duration getCountdownRunTime() {
        return countdownRuntime;
    }

    public void setCountdownRunTime(@Nonnull Duration countdownRunTime) {
        this.countdownRuntime = countdownRunTime;
    }

    @Nonnull
    public List<Event> getEvents() {
        return events;
    }
}
