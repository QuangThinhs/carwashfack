package com.autowashpro.controller;

import com.autowashpro.dto.AdminBookingRequest;
import com.autowashpro.dto.AdminBookingResponse;
import com.autowashpro.dto.AdminPromoPreviewRequest;
import com.autowashpro.dto.PromoApplyResponse;
import com.autowashpro.service.OperationsService;
import com.autowashpro.service.PromotionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
public class AdminBookingController {

    private final OperationsService operationsService;
    private final PromotionService promotionService;

    public AdminBookingController(OperationsService operationsService, PromotionService promotionService) {
        this.operationsService = operationsService;
        this.promotionService = promotionService;
    }

    /** Lich dat dang hoat dong (cho / da xac nhan / dang rua). */
    @GetMapping
    public List<AdminBookingResponse> list() {
        return operationsService.listActiveBookings();
    }

    /** Lich su don hang (da hoan tat / da huy). */
    @GetMapping("/history")
    public List<AdminBookingResponse> history() {
        return operationsService.listHistory();
    }

    /** Admin tao lich dat cho mot khach hang da dang ky. */
    @PostMapping
    public AdminBookingResponse create(@Valid @RequestBody AdminBookingRequest req) {
        return operationsService.createBookingForCustomer(req.getCustomerId(), req.getVehicleId(),
                req.getServiceIds(), req.getScheduledTime(), req.getNote(), req.getPromoCode());
    }

    /** Xem truoc giam gia cho lich dat cua mot khach cu the. */
    @PostMapping("/preview-promo")
    public PromoApplyResponse previewPromo(@Valid @RequestBody AdminPromoPreviewRequest req) {
        return promotionService.previewForCustomer(req.getCustomerId(), req.getCode(), req.getServiceIds());
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<Void> confirm(@PathVariable Long id) {
        operationsService.confirmBooking(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        operationsService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }
}
