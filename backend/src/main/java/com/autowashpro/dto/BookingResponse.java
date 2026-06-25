package com.autowashpro.dto;

import java.time.LocalDateTime;

public class BookingResponse {

    private Long id;
    private String vehiclePlate;
    private String serviceName;
    private LocalDateTime scheduledTime;
    private String status;
    private long price;
    private String note;

    public BookingResponse() {
    }

    public BookingResponse(Long id, String vehiclePlate, String serviceName,
                           LocalDateTime scheduledTime, String status, long price, String note) {
        this.id = id;
        this.vehiclePlate = vehiclePlate;
        this.serviceName = serviceName;
        this.scheduledTime = scheduledTime;
        this.status = status;
        this.price = price;
        this.note = note;
    }

    public Long getId() {
        return id;
    }

    public String getVehiclePlate() {
        return vehiclePlate;
    }

    public String getServiceName() {
        return serviceName;
    }

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public String getStatus() {
        return status;
    }

    public long getPrice() {
        return price;
    }

    public String getNote() {
        return note;
    }
}
