package com.sacredlounge.controller;

import com.sacredlounge.dto.EventDto;
import com.sacredlounge.dto.LibraryDto;
import com.sacredlounge.service.EventService;
import com.sacredlounge.service.LibraryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Admin-only endpoints.
 * All routes require ROLE_ADMIN (enforced by SecurityConfig + @PreAuthorize).
 */
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final EventService eventService;
    private final LibraryService libraryService;

    // ─── EVENTS ────────────────────────────────────────────────────────────────

    @GetMapping("/events")
    public ResponseEntity<Page<EventDto.EventSummary>> listAllEvents(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(eventService.getAllEventsForAdmin(pageable));
    }

    @PostMapping("/events")
    public ResponseEntity<EventDto.EventDetail> createEvent(
            @Valid @RequestBody EventDto.CreateEventRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(eventService.createEvent(request));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<EventDto.EventDetail> updateEvent(
            @PathVariable UUID id,
            @RequestBody EventDto.UpdateEventRequest request) {
        return ResponseEntity.ok(eventService.updateEvent(id, request));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    // ─── LIBRARY ───────────────────────────────────────────────────────────────

    @PostMapping("/library")
    public ResponseEntity<LibraryDto.LibraryItemDetail> createLibraryItem(
            @Valid @RequestBody LibraryDto.CreateLibraryItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(libraryService.createItem(request));
    }

    @PutMapping("/library/{id}")
    public ResponseEntity<LibraryDto.LibraryItemDetail> updateLibraryItem(
            @PathVariable UUID id,
            @RequestBody LibraryDto.UpdateLibraryItemRequest request) {
        return ResponseEntity.ok(libraryService.updateItem(id, request));
    }

    @DeleteMapping("/library/{id}")
    public ResponseEntity<Void> deleteLibraryItem(@PathVariable UUID id) {
        libraryService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
