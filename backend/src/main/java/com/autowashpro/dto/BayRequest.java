package com.autowashpro.dto;

import jakarta.validation.constraints.NotBlank;

/** Tao moi / doi ten bai rua. */
public class BayRequest {

    @NotBlank(message = "Vui lòng nhập tên bãi")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
