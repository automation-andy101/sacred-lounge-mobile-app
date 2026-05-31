package com.sacredlounge.dto;

import com.sacredlounge.entity.Event;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class EventDto {

    public record EventSummary(
        UUID id,
        String title,
        String slug,
        String shortDescription,
        String imageUrl,
        Instant eventDate,
        Instant endDate,
        String locationName,
        String locationAddress,
        String eventbriteUrl,
        Boolean isFree,
        BigDecimal price,
        Event.EventStatus status
    ) {}

    public record EventDetail(
        UUID id,
        String title,
        String slug,
        String shortDescription,
        String description,
        String imageUrl,
        Instant eventDate,
        Instant endDate,
        String locationName,
        String locationAddress,
        BigDecimal locationLat,
        BigDecimal locationLng,
        String eventbriteUrl,
        Integer capacity,
        Boolean isFree,
        BigDecimal price,
        Event.EventStatus status,
        String[] whatToExpect,
        int confirmedBookings
    ) {}

    public record CreateEventRequest(
        @NotBlank String title,
        String shortDescription,
        String description,
        String imageUrl,
        @NotNull Instant eventDate,
        Instant endDate,
        String locationName,
        String locationAddress,
        BigDecimal locationLat,
        BigDecimal locationLng,
        String eventbriteUrl,
        String eventbriteId,
        Integer capacity,
        Boolean isFree,
        BigDecimal price,
        String[] whatToExpect,
        Event.EventStatus status
    ) {}

    public record UpdateEventRequest(
        String title,
        String shortDescription,
        String description,
        String imageUrl,
        Instant eventDate,
        Instant endDate,
        String locationName,
        String locationAddress,
        BigDecimal locationLat,
        BigDecimal locationLng,
        String eventbriteUrl,
        String eventbriteId,
        Integer capacity,
        Boolean isFree,
        BigDecimal price,
        String[] whatToExpect,
        Event.EventStatus status
    ) {}
}
