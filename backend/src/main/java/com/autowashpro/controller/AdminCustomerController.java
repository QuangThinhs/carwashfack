package com.autowashpro.controller;

import com.autowashpro.dto.AdminCustomerResponse;
import com.autowashpro.service.OperationsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/customers")
public class AdminCustomerController {

    private final OperationsService operationsService;

    public AdminCustomerController(OperationsService operationsService) {
        this.operationsService = operationsService;
    }

    @GetMapping
    public List<AdminCustomerResponse> list() {
        return operationsService.listCustomers();
    }
}
