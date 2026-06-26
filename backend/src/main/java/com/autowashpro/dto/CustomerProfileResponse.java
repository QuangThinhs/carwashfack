package com.autowashpro.dto;

import java.time.LocalDate;

public class CustomerProfileResponse {

    private String fullName;
    private String phone;
    private String email;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;

    public CustomerProfileResponse() {
    }

    public CustomerProfileResponse(String fullName, String phone, String email,
                                   LocalDate dateOfBirth, String gender, String address) {
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.address = address;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public String getAddress() {
        return address;
    }
}
