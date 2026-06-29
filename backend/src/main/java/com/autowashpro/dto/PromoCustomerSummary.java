package com.autowashpro.dto;

/** Tom tat khach hang duoc gan vao mot khuyen mai (targetType = USER). */
public class PromoCustomerSummary {

    private Long id;
    private String fullName;
    private String phone;

    public PromoCustomerSummary(Long id, String fullName, String phone) {
        this.id = id;
        this.fullName = fullName;
        this.phone = phone;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhone() {
        return phone;
    }
}
