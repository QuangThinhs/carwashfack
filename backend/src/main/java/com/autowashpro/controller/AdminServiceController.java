package com.autowashpro.controller;

import com.autowashpro.dto.AdminServiceResponse;
import com.autowashpro.dto.ServiceItemRequest;
import com.autowashpro.service.ServiceCatalogService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/services")
public class AdminServiceController {

    private final ServiceCatalogService serviceCatalogService;

    public AdminServiceController(ServiceCatalogService serviceCatalogService) {
        this.serviceCatalogService = serviceCatalogService;
    }

    @GetMapping
    public List<AdminServiceResponse> list() {
        return serviceCatalogService.listAll();
    }

    @PostMapping
    public AdminServiceResponse create(@Valid @RequestBody ServiceItemRequest req) {
        return serviceCatalogService.create(req);
    }

    @PutMapping("/{id}")
    public AdminServiceResponse update(@PathVariable Long id, @Valid @RequestBody ServiceItemRequest req) {
        return serviceCatalogService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serviceCatalogService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
