package com.autowashpro.dto;

import java.time.LocalDate;
import java.util.List;

public class AdminPromotionResponse {

    private Long id;
    private String code;
    private String name;
    private String description;
    private int discountPercent;
    private String targetType;
    private String minTier;
    private Integer usageLimit;
    private int usageCount;
    private List<PromoCustomerSummary> targetCustomers;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean active;

    public AdminPromotionResponse(Long id, String code, String name, String description, int discountPercent,
                                  String targetType, String minTier, Integer usageLimit, int usageCount,
                                  List<PromoCustomerSummary> targetCustomers,
                                  LocalDate startDate, LocalDate endDate, boolean active) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.discountPercent = discountPercent;
        this.targetType = targetType;
        this.minTier = minTier;
        this.usageLimit = usageLimit;
        this.usageCount = usageCount;
        this.targetCustomers = targetCustomers;
        this.startDate = startDate;
        this.endDate = endDate;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public int getDiscountPercent() {
        return discountPercent;
    }

    public String getTargetType() {
        return targetType;
    }

    public String getMinTier() {
        return minTier;
    }

    public Integer getUsageLimit() {
        return usageLimit;
    }

    public int getUsageCount() {
        return usageCount;
    }

    public List<PromoCustomerSummary> getTargetCustomers() {
        return targetCustomers;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public boolean isActive() {
        return active;
    }
}
