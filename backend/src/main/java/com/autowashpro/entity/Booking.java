package com.autowashpro.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/** Lich dat / order rua xe (bang `bookings`). Khach co tai khoan -> customer/vehicle; khach vang lai -> walkin_*. */
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Khach co tai khoan (null neu khach vang lai). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    /** Xe da dang ky (null neu khach vang lai). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceItem service;

    @Column(name = "scheduled_time", nullable = false)
    private LocalDateTime scheduledTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookingStatus status;

    @Column(length = 255)
    private String note;

    @Column(nullable = false)
    private long price;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // ----- Thong tin khach vang lai (khi customer/vehicle null) -----
    @Column(name = "walkin_name", length = 120)
    private String walkinName;

    @Column(name = "walkin_phone", length = 20)
    private String walkinPhone;

    @Column(name = "walkin_plate", length = 20)
    private String walkinPlate;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public ServiceItem getService() {
        return service;
    }

    public void setService(ServiceItem service) {
        this.service = service;
    }

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public long getPrice() {
        return price;
    }

    public void setPrice(long price) {
        this.price = price;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getWalkinName() {
        return walkinName;
    }

    public void setWalkinName(String walkinName) {
        this.walkinName = walkinName;
    }

    public String getWalkinPhone() {
        return walkinPhone;
    }

    public void setWalkinPhone(String walkinPhone) {
        this.walkinPhone = walkinPhone;
    }

    public String getWalkinPlate() {
        return walkinPlate;
    }

    public void setWalkinPlate(String walkinPlate) {
        this.walkinPlate = walkinPlate;
    }
}
