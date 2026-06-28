package com.autowashpro.repository;

import com.autowashpro.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    List<Promotion> findByActiveTrueOrderByDiscountPercentDesc();

    Optional<Promotion> findByCodeIgnoreCase(String code);

    /**
     * Tang luot dung mot cach NGUYEN TU: chi tang khi chua het luot.
     * Tra ve so dong bi thay doi (1 = tang thanh cong, 0 = da het luot).
     * Tranh race condition khi nhieu request ap cung ma cung luc.
     */
    @Modifying
    @Query("update Promotion p set p.usageCount = p.usageCount + 1 "
            + "where p.id = :id and (p.usageLimit is null or p.usageCount < p.usageLimit)")
    int incrementUsage(@Param("id") Long id);
}
