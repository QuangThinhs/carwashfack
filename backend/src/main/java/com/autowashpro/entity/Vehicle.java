package com.autowashpro.entity;

import jakarta.persistence.*;

/** Xe cua khach hang (bang `vehicles`). */
@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "license_plate", nullable = false, length = 20)
    private String licensePlate;

    /** Loai xe: "Xe may" hoac "O to". */
    @Column(length = 20)
    private String category;

    /** Dong/loai xe (vd: Wave, Vision, Vios...). */
    @Column(length = 50)
    private String type;

    /** Hang xe (vd: Honda, Yamaha, Toyota...). */
    @Column(length = 50)
    private String brand;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }
}
