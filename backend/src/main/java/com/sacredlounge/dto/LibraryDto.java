package com.sacredlounge.dto;

import com.sacredlounge.entity.LibraryItem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public class LibraryDto {

    public record LibraryItemSummary(
        UUID id,
        String title,
        String description,
        LibraryItem.Category category,
        Integer durationSecs,
        String formattedDuration,
        String imageUrl,
        Boolean isFeatured,
        Boolean isFree,
        int playCount
    ) {}

    public record LibraryItemDetail(
        UUID id,
        String title,
        String description,
        LibraryItem.Category category,
        Integer durationSecs,
        String formattedDuration,
        String audioUrl,
        String imageUrl,
        Boolean isFeatured,
        Boolean isFree,
        int playCount
    ) {}

    public record LibraryResponse(
        LibraryItemDetail featuredItem,
        List<LibraryItemSummary> meditations,
        List<LibraryItemSummary> kirtan,
        List<LibraryItemSummary> talks
    ) {}

    public record CreateLibraryItemRequest(
        @NotBlank String title,
        String description,
        @NotNull LibraryItem.Category category,
        Integer durationSecs,
        String audioUrl,
        String imageUrl,
        Boolean isFeatured,
        Boolean isFree,
        Integer sortOrder
    ) {}

    public record UpdateLibraryItemRequest(
        String title,
        String description,
        LibraryItem.Category category,
        Integer durationSecs,
        String audioUrl,
        String imageUrl,
        Boolean isFeatured,
        Boolean isFree,
        Integer sortOrder
    ) {}
}
