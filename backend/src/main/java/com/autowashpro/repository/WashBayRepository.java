package com.autowashpro.repository;

import com.autowashpro.entity.WashBay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WashBayRepository extends JpaRepository<WashBay, Long> {

    List<WashBay> findAllByOrderByIdAsc();
}
