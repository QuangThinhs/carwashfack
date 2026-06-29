package com.autowashpro.controller;

import com.autowashpro.dto.AdminBookingResponse;
import com.autowashpro.service.OperationsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
public class AdminBookingController {

    private final OperationsService operationsService;

    public AdminBookingController(OperationsService operationsService) {
        this.operationsService = operationsService;
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
