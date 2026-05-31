package com.sacredlounge.repository;

import com.sacredlounge.entity.LibraryItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LibraryItemRepository extends JpaRepository<LibraryItem, UUID> {

    List<LibraryItem> findByIsFeaturedTrueOrderBySortOrderAsc();

    List<LibraryItem> findByCategoryOrderBySortOrderAsc(LibraryItem.Category category);

    Page<LibraryItem> findByCategoryOrderBySortOrderAsc(LibraryItem.Category category, Pageable pageable);
}
