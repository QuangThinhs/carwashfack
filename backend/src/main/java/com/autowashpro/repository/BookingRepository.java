package com.autowashpro.repository;

import com.autowashpro.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerIdOrderByScheduledTimeDesc(Long customerId);

    Optional<Booking> findByIdAndCustomerId(Long id, Long customerId);
}
