package de.dreja.introgenerator.model.persistence;

import de.dreja.introgenerator.service.persistence.MimeTypeConverter;
import jakarta.annotation.Nonnull;
import jakarta.persistence.*;
import org.springframework.util.MimeType;

@Entity
@Table(name = "image")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private long id;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "mime_type", nullable = false)
    @Convert(converter = MimeTypeConverter.class)
    private MimeType mimeType;

    @Column(nullable = false)
    private byte[] content;

    @OneToOne(targetEntity = Event.class, fetch = FetchType.EAGER, cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name = "event_id")
    private Event event;

    public long getId() {
        return id;
    }

    @Nonnull
    public String getFileName() {
        return fileName;
    }

    public void setFileName(@Nonnull String fileName) {
        this.fileName = fileName;
    }

    @Nonnull
    public MimeType getMimeType() {
        return mimeType;
    }

    public void setMimeType(@Nonnull MimeType mimeType) {
        this.mimeType = mimeType;
    }

    @Nonnull
    public byte[] getContent() {
        return content;
    }

    public void setContent(@Nonnull byte[] content) {
        this.content = content;
    }

    @Nonnull
    public Event getEvent() {
        return event;
    }

    public void setEvent(@Nonnull Event event) {
        this.event = event;
    }
}
