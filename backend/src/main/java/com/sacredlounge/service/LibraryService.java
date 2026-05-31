package com.sacredlounge.service;

import com.sacredlounge.dto.LibraryDto;
import com.sacredlounge.entity.LibraryItem;
import com.sacredlounge.repository.LibraryItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LibraryService {

    private final LibraryItemRepository libraryItemRepository;

    public LibraryDto.LibraryResponse getLibraryData() {
        List<LibraryItem> featured = libraryItemRepository.findByIsFeaturedTrueOrderBySortOrderAsc();
        LibraryDto.LibraryItemDetail featuredItem = featured.isEmpty() ? null : toDetail(featured.get(0));

        return new LibraryDto.LibraryResponse(
                featuredItem,
                getByCategory(LibraryItem.Category.MEDITATION),
                getByCategory(LibraryItem.Category.KIRTAN),
                getByCategory(LibraryItem.Category.TALK));
    }

    public List<LibraryDto.LibraryItemSummary> getByCategory(LibraryItem.Category category) {
        return libraryItemRepository.findByCategoryOrderBySortOrderAsc(category)
                .stream().map(this::toSummary).toList();
    }

    public LibraryDto.LibraryItemDetail getItemById(UUID id) {
        return libraryItemRepository.findById(id)
                .map(this::toDetail)
                .orElseThrow(() -> new IllegalArgumentException("Library item not found"));
    }

    @Transactional
    public void recordPlay(UUID id) {
        libraryItemRepository.findById(id).ifPresent(item -> {
            item.setPlayCount(item.getPlayCount() + 1);
            libraryItemRepository.save(item);
        });
    }

    @Transactional
    public LibraryDto.LibraryItemDetail createItem(LibraryDto.CreateLibraryItemRequest req) {
        LibraryItem item = LibraryItem.builder()
                .title(req.title())
                .description(req.description())
                .category(req.category())
                .durationSecs(req.durationSecs())
                .audioUrl(req.audioUrl())
                .imageUrl(req.imageUrl())
                .isFeatured(req.isFeatured() != null ? req.isFeatured() : false)
                .isFree(req.isFree() != null ? req.isFree() : true)
                .sortOrder(req.sortOrder() != null ? req.sortOrder() : 0)
                .build();
        return toDetail(libraryItemRepository.save(item));
    }

    @Transactional
    public LibraryDto.LibraryItemDetail updateItem(UUID id, LibraryDto.UpdateLibraryItemRequest req) {
        LibraryItem item = libraryItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Library item not found"));
        if (req.title() != null)       item.setTitle(req.title());
        if (req.description() != null) item.setDescription(req.description());
        if (req.category() != null)    item.setCategory(req.category());
        if (req.durationSecs() != null) item.setDurationSecs(req.durationSecs());
        if (req.audioUrl() != null)    item.setAudioUrl(req.audioUrl());
        if (req.imageUrl() != null)    item.setImageUrl(req.imageUrl());
        if (req.isFeatured() != null)  item.setIsFeatured(req.isFeatured());
        if (req.isFree() != null)      item.setIsFree(req.isFree());
        if (req.sortOrder() != null)   item.setSortOrder(req.sortOrder());
        return toDetail(libraryItemRepository.save(item));
    }

    @Transactional
    public void deleteItem(UUID id) {
        libraryItemRepository.deleteById(id);
    }

    // ── Mappers ──────────────────────────────────────────────────────────────

    private LibraryDto.LibraryItemSummary toSummary(LibraryItem i) {
        return new LibraryDto.LibraryItemSummary(
                i.getId(), i.getTitle(), i.getDescription(), i.getCategory(),
                i.getDurationSecs(), i.getFormattedDuration(),
                i.getImageUrl(), i.getIsFeatured(), i.getIsFree(), i.getPlayCount());
    }

    private LibraryDto.LibraryItemDetail toDetail(LibraryItem i) {
        return new LibraryDto.LibraryItemDetail(
                i.getId(), i.getTitle(), i.getDescription(), i.getCategory(),
                i.getDurationSecs(), i.getFormattedDuration(),
                i.getAudioUrl(), i.getImageUrl(),
                i.getIsFeatured(), i.getIsFree(), i.getPlayCount());
    }
}
