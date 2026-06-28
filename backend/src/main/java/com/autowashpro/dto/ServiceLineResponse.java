package com.autowashpro.dto;

/** Mot dong dich vu trong don (ten + gia). */
public class ServiceLineResponse {

    private String name;
    private long price;

    public ServiceLineResponse(String name, long price) {
        this.name = name;
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public long getPrice() {
        return price;
    }
}
