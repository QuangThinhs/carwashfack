package com.autowashpro.dto;

import java.time.LocalDateTime;
import java.util.List;

public class BookingResponse {

    private Long id;
    private String vehiclePlate;
    private String serviceName;
    private List<ServiceLineResponse> services;
    private LocalDateTime scheduledTime;
    private String status;
    private long price;
    private String note;
    private Long originalPrice;
    private String promoCode;

    public BookingResponse() {
    }

    public BookingResponse(Long id, String vehiclePlate, String serviceName, List<ServiceLineResponse> services,
                           LocalDateTime scheduledTime, String status, long price, String note,
                           Long originalPrice, String promoCode) {
        this.id = id;
        this.vehiclePlate = vehiclePlate;
        this.serviceName = serviceName;
        this.services = services;
        this.scheduledTime = scheduledTime;
        this.status = status;
        this.price = price;
        this.note = note;
        this.originalPrice = originalPrice;
        this.promoCode = promoCode;
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

    public List<ServiceLineResponse> getServices() {
        return services;
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

    public Long getOriginalPrice() {
        return originalPrice;
    }

    public String getPromoCode() {
        return promoCode;
    }
}
