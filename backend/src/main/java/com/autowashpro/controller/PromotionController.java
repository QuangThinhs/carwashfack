package com.autowashpro.controller;

import com.autowashpro.dto.PromoApplyRequest;
import com.autowashpro.dto.PromoApplyResponse;
import com.autowashpro.dto.PromotionResponse;
import com.autowashpro.service.PromotionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    private final PromotionService promotionService;

    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    @GetMapping
    public List<PromotionResponse> list(Principal principal) {
        return promotionService.getForCustomer(principal.getName());
    }

    /** Xem truoc giam gia khi khach go ma khuyen mai. */
    @PostMapping("/apply")
    public PromoApplyResponse apply(Principal principal, @Valid @RequestBody PromoApplyRequest req) {
        return promotionService.preview(principal.getName(), req.getCode(), req.getServiceIds());
    }
}
