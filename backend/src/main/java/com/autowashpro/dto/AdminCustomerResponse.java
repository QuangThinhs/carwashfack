package com.autowashpro.dto;

import java.util.List;

public class AdminCustomerResponse {

    private Long id;
    private String fullName;
    private String phone;
    private List<VehicleResponse> vehicles;

    public AdminCustomerResponse(Long id, String fullName, String phone, List<VehicleResponse> vehicles) {
        this.id = id;
        this.fullName = fullName;
        this.phone = phone;
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

    public List<VehicleResponse> getVehicles() {
        return vehicles;
    }
}
