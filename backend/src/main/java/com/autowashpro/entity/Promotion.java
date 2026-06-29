package com.autowashpro.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

/** Khuyen mai (bang `promotions`). Ap dung theo: tat ca / hang / khach hang cu the, co the gioi han so luot. */
@Entity
@Table(name = "promotions")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String code;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(name = "discount_percent", nullable = false)
    private int discountPercent;

    /** Doi tuong ap dung. */
    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false, length = 10)
    private PromotionTarget targetType = PromotionTarget.ALL;

    /** Khi targetType = TIER: ap dung tu hang nay tro len. */
    @Enumerated(EnumType.STRING)
    @Column(name = "min_tier", length = 20)
    private Tier minTier;

    /** Khi targetType = USER: danh sach khach hang duoc ap dung. */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "promotion_customers",
            joinColumns = @JoinColumn(name = "promotion_id"),
            inverseJoinColumns = @JoinColumn(name = "customer_id"))
    private Set<Customer> targetCustomers = new LinkedHashSet<>();

    /** Gioi han tong so luot dung; null = khong gioi han. */
    @Column(name = "usage_limit")
    private Integer usageLimit;

    /** So luot da dung. */
    @Column(name = "usage_count", nullable = false)
    private int usageCount;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private boolean active;

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getDiscountPercent() {
        return discountPercent;
    }

    public void setDiscountPercent(int discountPercent) {
        this.discountPercent = discountPercent;
    }

    public PromotionTarget getTargetType() {
        return targetType;
    }

    public void setTargetType(PromotionTarget targetType) {
        this.targetType = targetType;
    }

    public Tier getMinTier() {
        return minTier;
    }

    public void setMinTier(Tier minTier) {
        this.minTier = minTier;
    }

    public Set<Customer> getTargetCustomers() {
        return targetCustomers;
    }

    public void setTargetCustomers(Set<Customer> targetCustomers) {
        this.targetCustomers = targetCustomers;
    }

    public Integer getUsageLimit() {
        return usageLimit;
    }

    public void setUsageLimit(Integer usageLimit) {
        this.usageLimit = usageLimit;
    }

    public int getUsageCount() {
        return usageCount;
    }

    public void setUsageCount(int usageCount) {
        this.usageCount = usageCount;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
