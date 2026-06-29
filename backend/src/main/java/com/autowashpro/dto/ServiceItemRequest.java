package com.autowashpro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class ServiceItemRequest {

    @NotBlank(message = "Vui lòng nhập tên dịch vụ")
    private String name;

    @NotBlank(message = "Vui lòng chọn loại dịch vụ")
    private String category;

    @Positive(message = "Giá phải lớn hơn 0")
    private long price;

    @Positive(message = "Thời lượng phải lớn hơn 0")
    private int durationMin;

    private boolean active;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public long getPrice() {
        return price;
    }

    public void setPrice(long price) {
        this.price = price;
    }

    public int getDurationMin() {
        return durationMin;
    }

    public void setDurationMin(int durationMin) {
        this.durationMin = durationMin;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
