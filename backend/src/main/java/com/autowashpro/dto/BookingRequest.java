package com.autowashpro.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class BookingRequest {

    @NotNull(message = "Vui lòng chọn xe")
    private Long vehicleId;

    @NotEmpty(message = "Vui lòng chọn ít nhất một dịch vụ")
    private List<Long> serviceIds;

    @NotNull(message = "Vui lòng chọn thời gian")
    private LocalDateTime scheduledTime;

    private String note;

    /** Ma khuyen mai (tuy chon). */
    private String promoCode;

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public List<Long> getServiceIds() {
        return serviceIds;
    }

    public void setServiceIds(List<Long> serviceIds) {
        this.serviceIds = serviceIds;
    }

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getPromoCode() {
        return promoCode;
    }

    public void setPromoCode(String promoCode) {
        this.promoCode = promoCode;
    }
}
