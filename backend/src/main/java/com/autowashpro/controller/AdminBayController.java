package com.autowashpro.controller;

import com.autowashpro.dto.BayOrderRequest;
import com.autowashpro.dto.BayRequest;
import com.autowashpro.dto.WashBayResponse;
import com.autowashpro.service.OperationsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bays")
public class AdminBayController {

    private final OperationsService operationsService;

    public AdminBayController(OperationsService operationsService) {
        this.operationsService = operationsService;
    }

    @GetMapping
    public List<WashBayResponse> list() {
        return operationsService.listBays();
    }

    /** Them bai rua moi. */
    @PostMapping
    public ResponseEntity<WashBayResponse> create(@Valid @RequestBody BayRequest req) {
        return ResponseEntity.ok(operationsService.createBay(req.getName()));
    }

    /** Doi ten bai rua. */
    @PatchMapping("/{id}")
    public ResponseEntity<Void> rename(@PathVariable Long id, @Valid @RequestBody BayRequest req) {
        operationsService.renameBay(id, req.getName());
        return ResponseEntity.noContent().build();
    }

    /** Xoa bai rua (chi khi dang trong). */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        operationsService.deleteBay(id);
        return ResponseEntity.noContent().build();
    }

    /** Xep mot lich dat online (dang cho) vao bai. */
    @PostMapping("/{id}/assign")
    public ResponseEntity<Void> assign(@PathVariable Long id, @RequestParam Long bookingId) {
        operationsService.assign(id, bookingId);
        return ResponseEntity.noContent().build();
    }

    /** Tao order truc tiep tai bai (khach toi quay). */
    @PostMapping("/{id}/order")
    public ResponseEntity<Void> order(@PathVariable Long id, @Valid @RequestBody BayOrderRequest req) {
        operationsService.createOrderAtBay(id, req.getCustomerName(), req.getCustomerPhone(),
                req.getVehiclePlate(), req.getServiceId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Void> complete(@PathVariable Long id) {
        operationsService.completeBay(id);
        return ResponseEntity.noContent().build();
    }
}
