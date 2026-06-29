package com.autowashpro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

/** Khach/admin xem truoc giam gia cua mot ma cho cac dich vu da chon. */
public class PromoApplyRequest {

    @NotBlank(message = "Vui lòng nhập mã khuyến mãi")
    private String code;

    @NotEmpty(message = "Vui lòng chọn ít nhất một dịch vụ")
    private List<Long> serviceIds;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public List<Long> getServiceIds() {
        return serviceIds;
    }

    public void setServiceIds(List<Long> serviceIds) {
        this.serviceIds = serviceIds;
    }
}
