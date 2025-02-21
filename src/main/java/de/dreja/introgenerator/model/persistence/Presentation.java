package de.dreja.introgenerator.model.persistence;

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
    private LocalDateTime countdownEndTime;

    @Column(nullable = false)
    private String title;

    @Column
    @Nullable
    private String description;

    @Column(nullable = false, name = "countdown_runtime_seconds")
    private long countdownRunTimeSeconds;

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

    public long getCountdownRunTimeSeconds() {
        return countdownRunTimeSeconds;
    }

    public void setCountdownRunTimeSeconds(long countdownRunTimeSeconds) {
        this.countdownRunTimeSeconds = countdownRunTimeSeconds;
    }

    @Nonnull
    public Duration getCountdownRunTime() {
        return Duration.ofSeconds(countdownRunTimeSeconds);
    }

    public void setCountdownRunTime(@Nonnull Duration countdownRunTime) {
        this.countdownRunTimeSeconds = countdownRunTime.getSeconds();
    }

    @Nonnull
    public List<Event> getEvents() {
        return events;
    }
}
