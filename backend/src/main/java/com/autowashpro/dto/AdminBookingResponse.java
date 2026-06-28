package com.autowashpro.dto;

import com.autowashpro.entity.Booking;

import java.time.LocalDateTime;
import java.util.stream.Stream;

public class AdminBookingResponse {

    private Long id;
    private String customerName;
    private String customerPhone;
    private String vehiclePlate;
    private String vehicleInfo;
    private String serviceName;
    private LocalDateTime scheduledTime;
    private String status;
    private long price;
    private String note;
    private boolean walkIn;

    public AdminBookingResponse(Long id, String customerName, String customerPhone, String vehiclePlate,
                                String vehicleInfo, String serviceName, LocalDateTime scheduledTime,
                                String status, long price, String note, boolean walkIn) {
        this.id = id;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.vehiclePlate = vehiclePlate;
        this.vehicleInfo = vehicleInfo;
        this.serviceName = serviceName;
        this.scheduledTime = scheduledTime;
        this.status = status;
        this.price = price;
        this.note = note;
        this.walkIn = walkIn;
    }

    /** Map tu Booking, an toan voi khach vang lai (customer/vehicle null). Goi trong transaction. */
    public static AdminBookingResponse from(Booking b) {
        boolean walkIn = b.getCustomer() == null;
        String name = walkIn ? b.getWalkinName() : b.getCustomer().getFullName();
        String phone = walkIn ? b.getWalkinPhone() : b.getCustomer().getPhone();
        String plate = b.getVehicle() != null ? b.getVehicle().getLicensePlate() : b.getWalkinPlate();
        String vehicleInfo;
        if (b.getVehicle() != null) {
            vehicleInfo = Stream.of(b.getVehicle().getCategory(), b.getVehicle().getBrand(), b.getVehicle().getType())
                    .filter(x -> x != null && !x.isBlank())
                    .reduce((a, c) -> a + " · " + c)
                    .orElse("");
        } else {
            vehicleInfo = "Khách vãng lai";
        }
        return new AdminBookingResponse(b.getId(), name, phone, plate, vehicleInfo, b.getService().getName(),
                b.getScheduledTime(), b.getStatus().name(), b.getPrice(), b.getNote(), walkIn);
    }

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public String getVehiclePlate() {
        return vehiclePlate;
    }

    public String getVehicleInfo() {
        return vehicleInfo;
    }

    public String getServiceName() {
        return serviceName;
    }

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public String getStatus() {
        return status;
    }

    public long getPrice() {
        return price;
    }

    public String getNote() {
        return note;
    }

    public boolean isWalkIn() {
        return walkIn;
    }
}
