package com.sacredlounge.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "library_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LibraryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(name = "duration_secs")
    private Integer durationSecs;

    @Column(name = "audio_url")
    private String audioUrl;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_featured", nullable = false)
    @Builder.Default
    private Boolean isFeatured = false;

    @Column(name = "is_free", nullable = false)
    @Builder.Default
    private Boolean isFree = true;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;

    @Column(name = "play_count", nullable = false)
    @Builder.Default
    private Integer playCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    public enum Category {
        MEDITATION, TALK, MUSIC, KIRTAN
    }

    /** Converts duration in seconds to human-readable format e.g. "15 min" */
    public String getFormattedDuration() {
        if (durationSecs == null) return null;
        int minutes = durationSecs / 60;
        int seconds = durationSecs % 60;
        return seconds == 0 ? minutes + " min" : minutes + ":" + String.format("%02d", seconds);
    }
}
