package com.autowashpro.service;

import com.autowashpro.dto.BookingRequest;
import com.autowashpro.dto.BookingResponse;
import com.autowashpro.entity.Booking;
import com.autowashpro.entity.BookingStatus;
import com.autowashpro.entity.Customer;
import com.autowashpro.entity.ServiceItem;
import com.autowashpro.entity.Vehicle;
import com.autowashpro.repository.BookingRepository;
import com.autowashpro.repository.CustomerRepository;
import com.autowashpro.repository.ServiceItemRepository;
import com.autowashpro.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    /** Cua so dat lich cua hang Member (ngay). Cac hang khac se mo rong sau. */
    private static final int MEMBER_WINDOW_DAYS = 7;

    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final CustomerRepository customerRepository;

    public BookingService(BookingRepository bookingRepository,
                          VehicleRepository vehicleRepository,
                          ServiceItemRepository serviceItemRepository,
                          CustomerRepository customerRepository) {
        this.bookingRepository = bookingRepository;
        this.vehicleRepository = vehicleRepository;
        this.serviceItemRepository = serviceItemRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    public BookingResponse create(String username, BookingRequest req) {
        Customer customer = currentCustomer(username);

        Vehicle vehicle = vehicleRepository.findByIdAndCustomerId(req.getVehicleId(), customer.getId())
                .orElseThrow(() -> new IllegalArgumentException("Xe khong hop le"));
        ServiceItem service = serviceItemRepository.findById(req.getServiceId())
                .orElseThrow(() -> new IllegalArgumentException("Dich vu khong hop le"));

        LocalDateTime time = req.getScheduledTime();
        LocalDateTime now = LocalDateTime.now();
        if (time.isBefore(now)) {
            throw new IllegalArgumentException("Thoi gian dat lich phai o tuong lai");
        }
        if (time.isAfter(now.plusDays(MEMBER_WINDOW_DAYS))) {
            throw new IllegalArgumentException("Chi duoc dat truoc toi da " + MEMBER_WINDOW_DAYS + " ngay (hang Member)");
        }

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setVehicle(vehicle);
        booking.setService(service);
        booking.setScheduledTime(time);
        booking.setStatus(BookingStatus.PENDING);
        booking.setNote(req.getNote());
        booking.setPrice(service.getPrice());
        bookingRepository.save(booking);
        return toResponse(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> list(String username) {
        Customer customer = currentCustomer(username);
        return bookingRepository.findByCustomerIdOrderByScheduledTimeDesc(customer.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public BookingResponse cancel(String username, Long id) {
        Customer customer = currentCustomer(username);
        Booking booking = bookingRepository.findByIdAndCustomerId(id, customer.getId())
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay lich dat"));
        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalArgumentException("Khong the huy lich o trang thai nay");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        return toResponse(booking);
    }

    private Customer currentCustomer(String username) {
        return customerRepository.findByUserUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay khach hang"));
    }

    private BookingResponse toResponse(Booking b) {
        return new BookingResponse(
                b.getId(),
                b.getVehicle().getLicensePlate(),
                b.getService().getName(),
                b.getScheduledTime(),
                b.getStatus().name(),
                b.getPrice(),
                b.getNote()
        );
    }
}
