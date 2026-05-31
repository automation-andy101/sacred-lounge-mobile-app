package com.sacredlounge.dto;

public class HomeDto {

    public record InspirationDto(String quote, String author) {}

    public record HomeResponse(
        EventDto.EventSummary nextEvent,
        InspirationDto todaysInspiration
    ) {}
}
