package com.sacredlounge.service;

import com.sacredlounge.dto.EventDto;
import com.sacredlounge.dto.HomeDto;
import com.sacredlounge.entity.Event;
import com.sacredlounge.entity.Inspiration;
import com.sacredlounge.repository.EventRepository;
import com.sacredlounge.repository.InspirationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class HomeService {

    private final EventRepository eventRepository;
    private final InspirationRepository inspirationRepository;
    private final EventService eventService;

    public HomeDto.HomeResponse getHomeData() {
        // Next upcoming event
        EventDto.EventSummary nextEvent = eventService.getNextEvent();

        // Today's inspiration — try date-specific first, then random
        Inspiration inspiration = inspirationRepository.findByDisplayDate(LocalDate.now())
                .orElseGet(() -> inspirationRepository.findRandom().orElse(null));

        HomeDto.InspirationDto inspirationDto = inspiration == null ? null
                : new HomeDto.InspirationDto(inspiration.getQuote(), inspiration.getAuthor());

        return new HomeDto.HomeResponse(nextEvent, inspirationDto);
    }
}
