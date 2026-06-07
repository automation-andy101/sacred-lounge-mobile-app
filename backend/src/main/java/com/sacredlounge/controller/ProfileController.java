package com.sacredlounge.controller;

import com.sacredlounge.dto.BookingDto;
import com.sacredlounge.entity.EventBooking;
import com.sacredlounge.entity.User;
import com.sacredlounge.repository.EventBookingRepository;
import com.sacredlounge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final EventBookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/bookings/upcoming")
    public ResponseEntity<List<BookingDto.BookingResponse>> getUpcomingBookings(Authentication auth) {
        UUID userId = UUID.fromString(auth.getName());
        return ResponseEntity.ok(
            bookingRepository.findUpcomingByUserId(userId, Instant.now())
                .stream().map(this::toDto).toList()
        );
    }

    @GetMapping("/bookings/past")
    public ResponseEntity<List<BookingDto.BookingResponse>> getPastBookings(Authentication auth) {
        UUID userId = UUID.fromString(auth.getName());
        return ResponseEntity.ok(
            bookingRepository.findPastByUserId(userId, Instant.now())
                .stream().map(this::toDto).toList()
        );
    }

    @PutMapping
    public ResponseEntity<Void> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication auth) {
        UUID userId = UUID.fromString(auth.getName());
        userRepository.findById(userId).ifPresent(user -> {
            if (request.firstName() != null) user.setFirstName(request.firstName());
            if (request.lastName() != null) user.setLastName(request.lastName());
            if (request.email() != null) user.setEmail(request.email());
            userRepository.save(user);
        });
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication auth) {
        UUID userId = UUID.fromString(auth.getName());
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAccount(Authentication auth) {
        UUID userId = UUID.fromString(auth.getName());
        bookingRepository.findUpcomingByUserId(userId, Instant.now())
            .forEach(bookingRepository::delete);
        bookingRepository.findPastByUserId(userId, Instant.now())
            .forEach(bookingRepository::delete);
        userRepository.deleteById(userId);
        return ResponseEntity.noContent().build();
    }

    private BookingDto.BookingResponse toDto(EventBooking b) {
        var e = b.getEvent();
        return new BookingDto.BookingResponse(
            b.getId().toString(),
            b.getStatus().name(),
            new BookingDto.EventSummary(
                e.getId().toString(),
                e.getTitle(),
                e.getSlug(),
                e.getEventDate(),
                e.getEndDate(),
                e.getLocationName(),
                e.getLocationAddress(),
                e.getEventbriteUrl()
            )
        );
    }

    public record UpdateProfileRequest(String firstName, String lastName, String email) {}
    public record ChangePasswordRequest(String currentPassword, String newPassword) {}
}
