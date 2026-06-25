package com.autowashpro.config;

import com.autowashpro.entity.ServiceItem;
import com.autowashpro.repository.ServiceItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/** Seed danh muc dich vu mac dinh khi bang `services` con trong. */
@Component
public class DataInitializer implements CommandLineRunner {

    private final ServiceItemRepository serviceItemRepository;

    public DataInitializer(ServiceItemRepository serviceItemRepository) {
        this.serviceItemRepository = serviceItemRepository;
    }

    @Override
    public void run(String... args) {
        if (serviceItemRepository.count() == 0) {
            serviceItemRepository.saveAll(List.of(
                    service("Rửa xe cơ bản", "WASH_PACKAGE", 30000, 20),
                    service("Rửa xe cao cấp", "WASH_PACKAGE", 50000, 35),
                    service("Vệ sinh động cơ", "ADD_ON", 40000, 25),
                    service("Đánh bóng xe", "ADD_ON", 60000, 30)
            ));
        }
    }

    private ServiceItem service(String name, String category, long price, int durationMin) {
        ServiceItem s = new ServiceItem();
        s.setName(name);
        s.setCategory(category);
        s.setPrice(price);
        s.setDurationMin(durationMin);
        s.setActive(true);
        return s;
    }
}
