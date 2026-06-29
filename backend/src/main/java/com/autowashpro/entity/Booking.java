package com.autowashpro.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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

    /** Dich vu chinh (dich vu dau tien khach chon). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceItem service;

    /** Cac dich vu chon them (ngoai dich vu chinh). */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "booking_extra_services",
            joinColumns = @JoinColumn(name = "booking_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id"))
    private Set<ServiceItem> extraServices = new LinkedHashSet<>();

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

    /** Khuyen mai da ap dung (null neu khong dung ma). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    /** Gia goc truoc khi giam (null neu khong dung ma). */
    @Column(name = "original_price")
    private Long originalPrice;

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

    public Set<ServiceItem> getExtraServices() {
        return extraServices;
    }

    public void setExtraServices(Set<ServiceItem> extraServices) {
        this.extraServices = extraServices;
    }

    /** Tat ca dich vu cua don: chinh + cac dich vu them. */
    public List<ServiceItem> allServices() {
        List<ServiceItem> all = new ArrayList<>();
        if (service != null) {
            all.add(service);
        }
        all.addAll(extraServices);
        return all;
    }

    /** Ten gop cac dich vu, vd "Rửa cơ bản + Đánh bóng". */
    public String serviceLabel() {
        return allServices().stream().map(ServiceItem::getName).collect(Collectors.joining(" + "));
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

    public Promotion getPromotion() {
        return promotion;
    }

    public void setPromotion(Promotion promotion) {
        this.promotion = promotion;
    }

    public Long getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(Long originalPrice) {
        this.originalPrice = originalPrice;
    }
}
