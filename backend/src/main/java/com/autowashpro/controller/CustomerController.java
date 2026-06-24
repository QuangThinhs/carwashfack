package com.autowashpro.controller;

import com.autowashpro.dto.CustomerProfileResponse;
import com.autowashpro.dto.UpdateProfileRequest;
import com.autowashpro.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    /** Lay ho so cua khach hang dang dang nhap (theo JWT). */
    @GetMapping("/me")
    public ResponseEntity<CustomerProfileResponse> getMyProfile(Principal principal) {
        return ResponseEntity.ok(customerService.getProfile(principal.getName()));
    }

    /** Cap nhat ho so cua khach hang dang dang nhap. */
    @PutMapping("/me")
    public ResponseEntity<CustomerProfileResponse> updateMyProfile(
            Principal principal, @Valid @RequestBody UpdateProfileRequest req) {
        return ResponseEntity.ok(customerService.updateProfile(principal.getName(), req));
    }
}
