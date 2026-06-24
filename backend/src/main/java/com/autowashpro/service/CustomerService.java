package com.autowashpro.service;

import com.autowashpro.dto.CustomerProfileResponse;
import com.autowashpro.dto.UpdateProfileRequest;
import com.autowashpro.entity.Customer;
import com.autowashpro.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public CustomerProfileResponse getProfile(String username) {
        return toResponse(findByUsername(username));
    }

    @Transactional
    public CustomerProfileResponse updateProfile(String username, UpdateProfileRequest req) {
        Customer customer = findByUsername(username);
        customer.setFullName(req.getFullName());
        customer.setEmail(req.getEmail());
        customerRepository.save(customer);
        return toResponse(customer);
    }

    private Customer findByUsername(String username) {
        return customerRepository.findByUserUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay ho so khach hang"));
    }

    private CustomerProfileResponse toResponse(Customer c) {
        return new CustomerProfileResponse(c.getFullName(), c.getPhone(), c.getEmail());
    }
}
