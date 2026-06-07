package com.sacredlounge.controller;

import com.sacredlounge.entity.Event;
import com.sacredlounge.entity.EventBooking;
import com.sacredlounge.entity.User;
import com.sacredlounge.repository.EventBookingRepository;
import com.sacredlounge.repository.EventRepository;
import com.sacredlounge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final EventBookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @PostMapping("/{eventId}")
    public ResponseEntity<BookingResponse> bookEvent(
            @PathVariable UUID eventId,
            Authentication auth) {

        UUID userId = UUID.fromString(auth.getName());

        // Check if already booked
        if (bookingRepository.existsByEventIdAndUserId(eventId, userId)) {
            return ResponseEntity.ok(new BookingResponse(true, "Already booked"));
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        EventBooking booking = EventBooking.builder()
                .event(event)
                .user(user)
                .status(EventBooking.BookingStatus.CONFIRMED)
                .build();

        bookingRepository.save(booking);

        return ResponseEntity.ok(new BookingResponse(true, "Booking confirmed"));
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable UUID eventId,
            Authentication auth) {

        UUID userId = UUID.fromString(auth.getName());

        bookingRepository.findByEventIdAndUserId(eventId, userId)
                .ifPresent(booking -> {
                    booking.setStatus(EventBooking.BookingStatus.CANCELLED);
                    bookingRepository.save(booking);
                });

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{eventId}/status")
    public ResponseEntity<BookingResponse> getBookingStatus(
            @PathVariable UUID eventId,
            Authentication auth) {

        UUID userId = UUID.fromString(auth.getName());
        boolean booked = bookingRepository.existsByEventIdAndUserId(eventId, userId);
        return ResponseEntity.ok(new BookingResponse(booked, booked ? "Booked" : "Not booked"));
    }

    public record BookingResponse(boolean success, String message) {}
}
