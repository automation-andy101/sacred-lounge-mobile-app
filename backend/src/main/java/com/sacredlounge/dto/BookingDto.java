package com.sacredlounge.dto;

import java.time.Instant;

public class BookingDto {

    public record BookingResponse(
        String id,
        String status,
        EventSummary event
    ) {}

    public record EventSummary(
        String id,
        String title,
        String slug,
        Instant eventDate,
        Instant endDate,
        String locationName,
        String locationAddress,
        String eventbriteUrl
    ) {}
}