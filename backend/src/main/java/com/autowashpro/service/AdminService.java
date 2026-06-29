package com.autowashpro.service;

import com.autowashpro.dto.AdminBookingResponse;
import com.autowashpro.dto.AdminOverviewResponse;
import com.autowashpro.entity.BookingStatus;
import com.autowashpro.repository.BookingRepository;
import com.autowashpro.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final CustomerRepository customerRepository;
    private final BookingRepository bookingRepository;

    public AdminService(CustomerRepository customerRepository, BookingRepository bookingRepository) {
        this.customerRepository = customerRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public AdminOverviewResponse getOverview() {
        long totalCustomers = customerRepository.count();
        long totalBookings = bookingRepository.count();
        long completed = bookingRepository.countByStatus(BookingStatus.DONE);
        long pending = bookingRepository.countByStatus(BookingStatus.PENDING);
        long revenue = bookingRepository.sumPriceByStatus(BookingStatus.DONE);

        List<AdminBookingResponse> recent = bookingRepository.findTop8ByOrderByIdDesc().stream()
                .map(AdminBookingResponse::from)
                .toList();

        return new AdminOverviewResponse(totalCustomers, totalBookings, completed, pending, revenue, recent);
    }
}
