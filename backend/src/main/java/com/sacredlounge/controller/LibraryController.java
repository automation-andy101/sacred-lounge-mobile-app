package com.sacredlounge.controller;

import com.sacredlounge.dto.LibraryDto;
import com.sacredlounge.entity.LibraryItem;
import com.sacredlounge.service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/library")
@RequiredArgsConstructor
public class LibraryController {

    private final LibraryService libraryService;

    @GetMapping
    public ResponseEntity<LibraryDto.LibraryResponse> getLibrary() {
        return ResponseEntity.ok(libraryService.getLibraryData());
    }

    @GetMapping("/meditations")
    public ResponseEntity<List<LibraryDto.LibraryItemSummary>> getMeditations() {
        return ResponseEntity.ok(libraryService.getByCategory(LibraryItem.Category.MEDITATION));
    }

    @GetMapping("/kirtan")
    public ResponseEntity<List<LibraryDto.LibraryItemSummary>> getKirtan() {
        return ResponseEntity.ok(libraryService.getByCategory(LibraryItem.Category.KIRTAN));
    }

    @GetMapping("/talks")
    public ResponseEntity<List<LibraryDto.LibraryItemSummary>> getTalks() {
        return ResponseEntity.ok(libraryService.getByCategory(LibraryItem.Category.TALK));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LibraryDto.LibraryItemDetail> getItem(@PathVariable UUID id) {
        return ResponseEntity.ok(libraryService.getItemById(id));
    }

    /** Record a play (increments counter, updates user progress) */
    @PostMapping("/{id}/play")
    public ResponseEntity<Void> recordPlay(@PathVariable UUID id) {
        libraryService.recordPlay(id);
        return ResponseEntity.noContent().build();
    }
}
