package com.autowashpro.entity;

import jakarta.persistence.*;

/** Bai rua xe (bang `wash_bays`). */
@Entity
@Table(name = "wash_bays")
public class WashBay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BayStatus status;

    /** Lich dat dang duoc rua tai bai nay (null neu bai trong). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_booking_id")
    private Booking currentBooking;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BayStatus getStatus() {
        return status;
    }

    public void setStatus(BayStatus status) {
        this.status = status;
    }

    public Booking getCurrentBooking() {
        return currentBooking;
    }

    public void setCurrentBooking(Booking currentBooking) {
        this.currentBooking = currentBooking;
    }
}
