package com.sacredlounge.controller;

import com.sacredlounge.dto.EventDto;
import com.sacredlounge.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    /** List upcoming published events */
    @GetMapping("/upcoming")
    public ResponseEntity<List<EventDto.EventSummary>> getUpcoming() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }

    /** List past published events (paginated) */
    @GetMapping("/past")
    public ResponseEntity<Page<EventDto.EventSummary>> getPast(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(eventService.getPastEvents(pageable));
    }

    /** Get event detail by slug */
    @GetMapping("/{slug}")
    public ResponseEntity<EventDto.EventDetail> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(eventService.getEventBySlug(slug));
    }

    /** Get the single next upcoming event (for home screen) */
    @GetMapping("/next")
    public ResponseEntity<EventDto.EventSummary> getNextEvent() {
        return ResponseEntity.ok(eventService.getNextEvent());
    }
}
