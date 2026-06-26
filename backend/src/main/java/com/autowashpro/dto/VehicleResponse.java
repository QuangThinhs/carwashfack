package com.autowashpro.dto;

public class VehicleResponse {

    private Long id;
    private String licensePlate;
    private String category;
    private String type;
    private String brand;

    public VehicleResponse() {
    }

    public VehicleResponse(Long id, String licensePlate, String category, String type, String brand) {
        this.id = id;
        this.licensePlate = licensePlate;
        this.category = category;
        this.type = type;
        this.brand = brand;
    }

    public Long getId() {
        return id;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public String getCategory() {
        return category;
    }

    public String getType() {
        return type;
    }

    public String getBrand() {
        return brand;
    }
}
