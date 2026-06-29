package com.autowashpro.dto;

import java.time.LocalDateTime;
import java.util.List;

public class WashBayResponse {

    private Long id;
    private String name;
    private String status;
    private Long bookingId;
    private String customerName;
    private String customerPhone;
    private String vehiclePlate;
    private String serviceName;
    private List<ServiceLineResponse> services;
    private long price;
    private Long originalPrice;
    private String promoCode;
    private LocalDateTime scheduledTime;

    /** Bai dang trong. */
    public WashBayResponse(Long id, String name, String status) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.price = 0;
    }

    /** Bai dang co don. */
    public WashBayResponse(Long id, String name, String status, Long bookingId, String customerName,
                           String customerPhone, String vehiclePlate, String serviceName,
                           List<ServiceLineResponse> services, long price, Long originalPrice,
                           String promoCode, LocalDateTime scheduledTime) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.bookingId = bookingId;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.vehiclePlate = vehiclePlate;
        this.serviceName = serviceName;
        this.services = services;
        this.price = price;
        this.originalPrice = originalPrice;
        this.promoCode = promoCode;
        this.scheduledTime = scheduledTime;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getStatus() {
        return status;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
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

    public long getPrice() {
        return price;
    }

    public Long getOriginalPrice() {
        return originalPrice;
    }

    public String getPromoCode() {
        return promoCode;
    }

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }
}
