package com.sacredlounge.service;

import com.sacredlounge.dto.EventDto;
import com.sacredlounge.entity.Event;
import com.sacredlounge.entity.EventBooking;
import com.sacredlounge.repository.EventBookingRepository;
import com.sacredlounge.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EventBookingRepository bookingRepository;

    public List<EventDto.EventSummary> getUpcomingEvents() {
        return eventRepository.findUpcomingEvents(Instant.now())
                .stream().map(this::toSummary).toList();
    }

    public Page<EventDto.EventSummary> getPastEvents(Pageable pageable) {
        return eventRepository.findPastEvents(Instant.now(), pageable).map(this::toSummary);
    }

    public EventDto.EventSummary getNextEvent() {
        return eventRepository.findNextEvent(Instant.now())
                .map(this::toSummary)
                .orElse(null);
    }

    public EventDto.EventDetail getEventBySlug(String slug) {
        Event e = eventRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + slug));
        return toDetail(e);
    }

    public Page<EventDto.EventSummary> getAllEventsForAdmin(Pageable pageable) {
        return eventRepository.findAllByOrderByEventDateDesc(pageable).map(this::toSummary);
    }

    @Transactional
    public EventDto.EventDetail createEvent(EventDto.CreateEventRequest req) {
        Event event = Event.builder()
                .title(req.title())
                .slug(slugify(req.title()))
                .shortDescription(req.shortDescription())
                .description(req.description())
                .imageUrl(req.imageUrl())
                .eventDate(req.eventDate())
                .endDate(req.endDate())
                .locationName(req.locationName())
                .locationAddress(req.locationAddress())
                .locationLat(req.locationLat())
                .locationLng(req.locationLng())
                .eventbriteUrl(req.eventbriteUrl())
                .eventbriteId(req.eventbriteId())
                .capacity(req.capacity())
                .isFree(req.isFree() != null ? req.isFree() : true)
                .price(req.price())
                .whatToExpect(req.whatToExpect())
                .status(req.status() != null ? req.status() : Event.EventStatus.DRAFT)
                .build();
        return toDetail(eventRepository.save(event));
    }

    @Transactional
    public EventDto.EventDetail updateEvent(UUID id, EventDto.UpdateEventRequest req) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));
        if (req.title() != null)           event.setTitle(req.title());
        if (req.shortDescription() != null) event.setShortDescription(req.shortDescription());
        if (req.description() != null)     event.setDescription(req.description());
        if (req.imageUrl() != null)        event.setImageUrl(req.imageUrl());
        if (req.eventDate() != null)       event.setEventDate(req.eventDate());
        if (req.endDate() != null)         event.setEndDate(req.endDate());
        if (req.locationName() != null)    event.setLocationName(req.locationName());
        if (req.locationAddress() != null) event.setLocationAddress(req.locationAddress());
        if (req.locationLat() != null)     event.setLocationLat(req.locationLat());
        if (req.locationLng() != null)     event.setLocationLng(req.locationLng());
        if (req.eventbriteUrl() != null)   event.setEventbriteUrl(req.eventbriteUrl());
        if (req.eventbriteId() != null)    event.setEventbriteId(req.eventbriteId());
        if (req.capacity() != null)        event.setCapacity(req.capacity());
        if (req.isFree() != null)          event.setIsFree(req.isFree());
        if (req.price() != null)           event.setPrice(req.price());
        if (req.whatToExpect() != null)    event.setWhatToExpect(req.whatToExpect());
        if (req.status() != null)          event.setStatus(req.status());
        return toDetail(eventRepository.save(event));
    }

    @Transactional
    public void deleteEvent(UUID id) {
        eventRepository.deleteById(id);
    }

    // ── Mappers ──────────────────────────────────────────────────────────────

    private EventDto.EventSummary toSummary(Event e) {
        return new EventDto.EventSummary(
                e.getId(), e.getTitle(), e.getSlug(), e.getShortDescription(),
                e.getImageUrl(), e.getEventDate(), e.getEndDate(),
                e.getLocationName(), e.getLocationAddress(),
                e.getEventbriteUrl(), e.getIsFree(), e.getPrice(), e.getStatus());
    }

    private EventDto.EventDetail toDetail(Event e) {
        int confirmed = bookingRepository.countByEventIdAndStatus(e.getId(), EventBooking.BookingStatus.CONFIRMED);
        return new EventDto.EventDetail(
                e.getId(), e.getTitle(), e.getSlug(), e.getShortDescription(),
                e.getDescription(), e.getImageUrl(), e.getEventDate(), e.getEndDate(),
                e.getLocationName(), e.getLocationAddress(),
                e.getLocationLat(), e.getLocationLng(),
                e.getEventbriteUrl(), e.getCapacity(),
                e.getIsFree(), e.getPrice(), e.getStatus(),
                e.getWhatToExpect(), confirmed);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private static final Pattern NON_LATIN  = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    private String slugify(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        return NON_LATIN.matcher(WHITESPACE.matcher(normalized.toLowerCase(Locale.ENGLISH))
                .replaceAll("-")).replaceAll("") + "-" + System.currentTimeMillis();
    }
}
