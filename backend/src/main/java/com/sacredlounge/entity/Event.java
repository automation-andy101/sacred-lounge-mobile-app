package com.sacredlounge.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    private String description;

    @Column(name = "short_description")
    private String shortDescription;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "event_date", nullable = false)
    private Instant eventDate;

    @Column(name = "end_date")
    private Instant endDate;

    @Column(name = "location_name")
    private String locationName;

    @Column(name = "location_address")
    private String locationAddress;

    @Column(name = "location_lat")
    private BigDecimal locationLat;

    @Column(name = "location_lng")
    private BigDecimal locationLng;

    @Column(name = "eventbrite_url")
    private String eventbriteUrl;

    @Column(name = "eventbrite_id")
    private String eventbriteId;

    private Integer capacity;

    @Column(name = "is_free", nullable = false)
    @Builder.Default
    private Boolean isFree = true;

    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EventStatus status = EventStatus.PUBLISHED;

    @Column(name = "what_to_expect", columnDefinition = "text[]")
    private String[] whatToExpect;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    public enum EventStatus {
        DRAFT, PUBLISHED, CANCELLED
    }

    public boolean isUpcoming() {
        return eventDate.isAfter(Instant.now());
    }
}
