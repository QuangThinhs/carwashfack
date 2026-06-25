package com.autowashpro.controller;

import com.autowashpro.dto.ServiceResponse;
import com.autowashpro.repository.ServiceItemRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceItemRepository serviceItemRepository;

    public ServiceController(ServiceItemRepository serviceItemRepository) {
        this.serviceItemRepository = serviceItemRepository;
    }

    @GetMapping
    public List<ServiceResponse> list() {
        return serviceItemRepository.findByActiveTrueOrderByPriceAsc()
                .stream()
                .map(s -> new ServiceResponse(s.getId(), s.getName(), s.getCategory(), s.getPrice(), s.getDurationMin()))
                .toList();
    }
}
