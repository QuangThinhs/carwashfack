package com.autowashpro.dto;

public class AdminServiceResponse {

    private Long id;
    private String name;
    private String category;
    private long price;
    private int durationMin;
    private boolean active;

    public AdminServiceResponse(Long id, String name, String category, long price, int durationMin, boolean active) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.durationMin = durationMin;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public long getPrice() {
        return price;
    }

    public int getDurationMin() {
        return durationMin;
    }

    public boolean isActive() {
        return active;
    }
}
