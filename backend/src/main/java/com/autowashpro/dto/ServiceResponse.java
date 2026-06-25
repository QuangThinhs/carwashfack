package com.autowashpro.dto;

public class ServiceResponse {

    private Long id;
    private String name;
    private String category;
    private long price;
    private int durationMin;

    public ServiceResponse() {
    }

    public ServiceResponse(Long id, String name, String category, long price, int durationMin) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.durationMin = durationMin;
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
}
