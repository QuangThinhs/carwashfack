package com.autowashpro.controller;

import com.autowashpro.dto.VehicleRequest;
import com.autowashpro.dto.VehicleResponse;
import com.autowashpro.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    public ResponseEntity<List<VehicleResponse>> list(Principal principal) {
        return ResponseEntity.ok(vehicleService.list(principal.getName()));
    }

    @PostMapping
    public ResponseEntity<VehicleResponse> add(Principal principal, @Valid @RequestBody VehicleRequest req) {
        return ResponseEntity.ok(vehicleService.add(principal.getName(), req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponse> update(
            Principal principal, @PathVariable Long id, @Valid @RequestBody VehicleRequest req) {
        return ResponseEntity.ok(vehicleService.update(principal.getName(), id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Principal principal, @PathVariable Long id) {
        vehicleService.delete(principal.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
