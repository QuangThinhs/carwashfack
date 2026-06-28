package com.autowashpro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/** Tao order rua xe nhanh tai bai cho khach vang lai (nhap thong tin truc tiep). */
public class BayOrderRequest {

    @NotBlank(message = "Vui lòng nhập tên khách")
    private String customerName;

    private String customerPhone;

    @NotBlank(message = "Vui lòng nhập biển số xe")
    private String vehiclePlate;

    @NotNull(message = "Vui lòng chọn dịch vụ")
    private Long serviceId;

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getVehiclePlate() {
        return vehiclePlate;
    }

    public void setVehiclePlate(String vehiclePlate) {
        this.vehiclePlate = vehiclePlate;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }
}
