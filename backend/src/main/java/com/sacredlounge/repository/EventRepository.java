package com.sacredlounge.repository;

import com.sacredlounge.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

    Optional<Event> findBySlug(String slug);

    /** Upcoming published events ordered soonest first */
    @Query("SELECT e FROM Event e WHERE e.status = 'PUBLISHED' AND e.eventDate >= :now ORDER BY e.eventDate ASC")
    List<Event> findUpcomingEvents(Instant now);

    /** Next single upcoming event */
    @Query("SELECT e FROM Event e WHERE e.status = 'PUBLISHED' AND e.eventDate >= :now ORDER BY e.eventDate ASC LIMIT 1")
    Optional<Event> findNextEvent(Instant now);

    /** Past published events ordered most recent first */
    @Query("SELECT e FROM Event e WHERE e.status = 'PUBLISHED' AND e.eventDate < :now ORDER BY e.eventDate DESC")
    Page<Event> findPastEvents(Instant now, Pageable pageable);

    /** All events for admin */
    Page<Event> findAllByOrderByEventDateDesc(Pageable pageable);
}
