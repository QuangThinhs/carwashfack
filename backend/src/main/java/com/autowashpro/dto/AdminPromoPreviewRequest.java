package com.autowashpro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/** Admin xem truoc giam gia cua mot ma cho mot khach hang cu the. */
public class AdminPromoPreviewRequest {

    @NotNull(message = "Vui lòng chọn khách hàng")
    private Long customerId;

    @NotBlank(message = "Vui lòng nhập mã khuyến mãi")
    private String code;

    @NotEmpty(message = "Vui lòng chọn ít nhất một dịch vụ")
    private List<Long> serviceIds;

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

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
