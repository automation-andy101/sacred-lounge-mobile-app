package com.sacredlounge.repository;

import com.sacredlounge.entity.Inspiration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InspirationRepository extends JpaRepository<Inspiration, UUID> {

    Optional<Inspiration> findByDisplayDate(LocalDate date);

    /** Random active inspiration (fallback) */
    @Query(value = "SELECT * FROM inspirations WHERE is_active = true ORDER BY RANDOM() LIMIT 1",
           nativeQuery = true)
    Optional<Inspiration> findRandom();
}
