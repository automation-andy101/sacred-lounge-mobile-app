package com.sacredlounge.repository;

import com.sacredlounge.entity.EventBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventBookingRepository extends JpaRepository<EventBooking, UUID> {

    Optional<EventBooking> findByEventIdAndUserId(UUID eventId, UUID userId);

    boolean existsByEventIdAndUserId(UUID eventId, UUID userId);

    /** User's upcoming bookings */
    @Query("""
        SELECT b FROM EventBooking b
        JOIN FETCH b.event e
        WHERE b.user.id = :userId
          AND b.status = 'CONFIRMED'
          AND e.eventDate >= :now
        ORDER BY e.eventDate ASC
        """)
    List<EventBooking> findUpcomingByUserId(UUID userId, Instant now);

    /** User's past bookings */
    @Query("""
        SELECT b FROM EventBooking b
        JOIN FETCH b.event e
        WHERE b.user.id = :userId
          AND e.eventDate < :now
        ORDER BY e.eventDate DESC
        """)
    List<EventBooking> findPastByUserId(UUID userId, Instant now);

    int countByEventIdAndStatus(UUID eventId, EventBooking.BookingStatus status);
}
