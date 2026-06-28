package com.autowashpro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

/** Tao order rua xe nhanh tai bai cho khach vang lai (nhap thong tin truc tiep). */
public class BayOrderRequest {

    @NotBlank(message = "Vui lòng nhập tên khách")
    private String customerName;

    private String customerPhone;

    @NotBlank(message = "Vui lòng nhập biển số xe")
    private String vehiclePlate;

    @NotEmpty(message = "Vui lòng chọn ít nhất một dịch vụ")
    private List<Long> serviceIds;

    /** Ma khuyen mai (tuy chon). */
    private String promoCode;

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

    public List<Long> getServiceIds() {
        return serviceIds;
    }

    public void setServiceIds(List<Long> serviceIds) {
        this.serviceIds = serviceIds;
    }

    public String getPromoCode() {
        return promoCode;
    }

    public void setPromoCode(String promoCode) {
        this.promoCode = promoCode;
    }
}
