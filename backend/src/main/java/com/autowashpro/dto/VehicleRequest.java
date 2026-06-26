package com.autowashpro.dto;

import jakarta.validation.constraints.NotBlank;

public class VehicleRequest {

    @NotBlank(message = "Vui lòng nhập biển số xe")
    private String licensePlate;

    private String category;

    private String type;

    private String brand;

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }
}
