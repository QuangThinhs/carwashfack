package com.autowashpro.dto;

public class VehicleResponse {

    private Long id;
    private String licensePlate;
    private String type;
    private String brand;

    public VehicleResponse() {
    }

    public VehicleResponse(Long id, String licensePlate, String type, String brand) {
        this.id = id;
        this.licensePlate = licensePlate;
        this.type = type;
        this.brand = brand;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
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
