package com.autowashpro.controller;

import com.autowashpro.dto.AdminPromotionResponse;
import com.autowashpro.dto.PromoApplyRequest;
import com.autowashpro.dto.PromoApplyResponse;
import com.autowashpro.dto.PromotionRequest;
import com.autowashpro.service.PromotionAdminService;
import com.autowashpro.service.PromotionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/promotions")
public class AdminPromotionController {

    private final PromotionAdminService promotionAdminService;
    private final PromotionService promotionService;

    public AdminPromotionController(PromotionAdminService promotionAdminService, PromotionService promotionService) {
        this.promotionAdminService = promotionAdminService;
        this.promotionService = promotionService;
    }

    @GetMapping
    public List<AdminPromotionResponse> list() {
        return promotionAdminService.listAll();
    }

    @PostMapping
    public AdminPromotionResponse create(@Valid @RequestBody PromotionRequest req) {
        return promotionAdminService.create(req);
    }

    @PutMapping("/{id}")
    public AdminPromotionResponse update(@PathVariable Long id, @Valid @RequestBody PromotionRequest req) {
        return promotionAdminService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        promotionAdminService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /** Xem truoc giam gia cho order khach vang lai tai quay (chi ma doi tuong ALL). */
    @PostMapping("/apply")
    public PromoApplyResponse apply(@Valid @RequestBody PromoApplyRequest req) {
        return promotionService.previewForWalkIn(req.getCode(), req.getServiceIds());
    }
}
