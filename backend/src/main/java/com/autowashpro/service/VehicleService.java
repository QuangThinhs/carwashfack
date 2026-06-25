package com.autowashpro.service;

import com.autowashpro.dto.VehicleRequest;
import com.autowashpro.dto.VehicleResponse;
import com.autowashpro.entity.Customer;
import com.autowashpro.entity.Vehicle;
import com.autowashpro.repository.CustomerRepository;
import com.autowashpro.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final CustomerRepository customerRepository;

    public VehicleService(VehicleRepository vehicleRepository, CustomerRepository customerRepository) {
        this.vehicleRepository = vehicleRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public List<VehicleResponse> list(String username) {
        Customer customer = currentCustomer(username);
        return vehicleRepository.findByCustomerIdOrderByIdDesc(customer.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public VehicleResponse add(String username, VehicleRequest req) {
        Customer customer = currentCustomer(username);
        Vehicle vehicle = new Vehicle();
        vehicle.setCustomer(customer);
        apply(vehicle, req);
        vehicleRepository.save(vehicle);
        return toResponse(vehicle);
    }

    @Transactional
    public VehicleResponse update(String username, Long id, VehicleRequest req) {
        Vehicle vehicle = ownedVehicle(username, id);
        apply(vehicle, req);
        vehicleRepository.save(vehicle);
        return toResponse(vehicle);
    }

    @Transactional
    public void delete(String username, Long id) {
        vehicleRepository.delete(ownedVehicle(username, id));
    }

    private void apply(Vehicle vehicle, VehicleRequest req) {
        vehicle.setLicensePlate(req.getLicensePlate());
        vehicle.setType(req.getType());
        vehicle.setBrand(req.getBrand());
    }

    /** Lay xe va dam bao xe thuoc ve khach hang dang dang nhap. */
    private Vehicle ownedVehicle(String username, Long id) {
        Customer customer = currentCustomer(username);
        return vehicleRepository.findByIdAndCustomerId(id, customer.getId())
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay xe"));
    }

    private Customer currentCustomer(String username) {
        return customerRepository.findByUserUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay khach hang"));
    }

    private VehicleResponse toResponse(Vehicle v) {
        return new VehicleResponse(v.getId(), v.getLicensePlate(), v.getType(), v.getBrand());
    }
}
