package com.autowashpro.dto;

import java.util.List;

public class AdminCustomerResponse {

    private Long id;
    private String fullName;
    private String phone;
    private String email;
    private List<VehicleResponse> vehicles;

    public AdminCustomerResponse(Long id, String fullName, String phone, String email, List<VehicleResponse> vehicles) {
        this.id = id;
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.vehicles = vehicles;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public List<VehicleResponse> getVehicles() {
        return vehicles;
    }
}
