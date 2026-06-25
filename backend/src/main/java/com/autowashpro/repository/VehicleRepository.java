package com.autowashpro.repository;

import com.autowashpro.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByCustomerIdOrderByIdDesc(Long customerId);

    Optional<Vehicle> findByIdAndCustomerId(Long id, Long customerId);
}
