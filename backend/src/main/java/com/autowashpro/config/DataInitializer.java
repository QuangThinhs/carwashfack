package com.autowashpro.config;

import com.autowashpro.entity.BayStatus;
import com.autowashpro.entity.Promotion;
import com.autowashpro.entity.PromotionTarget;
import com.autowashpro.entity.Role;
import com.autowashpro.entity.ServiceItem;
import com.autowashpro.entity.Tier;
import com.autowashpro.entity.User;
import com.autowashpro.entity.WashBay;
import com.autowashpro.repository.PromotionRepository;
import com.autowashpro.repository.ServiceItemRepository;
import com.autowashpro.repository.UserRepository;
import com.autowashpro.repository.WashBayRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** Seed admin + bai rua + dich vu + khuyen mai mac dinh khi bang con trong. */
@Component
public class DataInitializer implements CommandLineRunner {

    private final ServiceItemRepository serviceItemRepository;
    private final PromotionRepository promotionRepository;
    private final UserRepository userRepository;
    private final WashBayRepository washBayRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(ServiceItemRepository serviceItemRepository,
                           PromotionRepository promotionRepository,
                           UserRepository userRepository,
                           WashBayRepository washBayRepository,
                           PasswordEncoder passwordEncoder) {
        this.serviceItemRepository = serviceItemRepository;
        this.promotionRepository = promotionRepository;
        this.userRepository = userRepository;
        this.washBayRepository = washBayRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Tai khoan quan tri mac dinh (username: admin / password: admin123)
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setEnabled(true);
            userRepository.save(admin);
        }

        // 10 bai rua
        if (washBayRepository.count() == 0) {
            List<WashBay> bays = new ArrayList<>();
            for (int i = 1; i <= 10; i++) {
                WashBay bay = new WashBay();
                bay.setName("Bãi " + i);
                bay.setStatus(BayStatus.FREE);
                bays.add(bay);
            }
            washBayRepository.saveAll(bays);
        }

        if (serviceItemRepository.count() == 0) {
            serviceItemRepository.saveAll(List.of(
                    service("Rửa xe cơ bản", "WASH_PACKAGE", 30000, 20),
                    service("Rửa xe cao cấp", "WASH_PACKAGE", 50000, 35),
                    service("Vệ sinh động cơ", "ADD_ON", 40000, 25),
                    service("Đánh bóng xe", "ADD_ON", 60000, 30)
            ));
        }

        if (promotionRepository.count() == 0) {
            LocalDate start = LocalDate.now().minusDays(1);
            LocalDate end = LocalDate.now().plusMonths(6);
            promotionRepository.saveAll(List.of(
                    promo("WELCOME10", "Chào mừng thành viên mới", "Giảm 10% cho lần rửa đầu tiên của bạn.", 10, null, start, end),
                    promo("WEEKEND12", "Cuối tuần rạng rỡ", "Giảm 12% cho mọi dịch vụ vào cuối tuần.", 12, null, start, end),
                    promo("SILVER15", "Ưu đãi hạng Silver+", "Giảm 15% dành riêng cho hạng Silver trở lên.", 15, Tier.SILVER, start, end),
                    promo("GOLD20", "Đặc quyền hạng Gold+", "Giảm 20% dành riêng cho hạng Gold trở lên.", 20, Tier.GOLD, start, end),
                    promo("PLATINUM25", "Tri ân hạng Platinum", "Giảm 25% cùng nhiều quà tặng cho hạng Platinum.", 25, Tier.PLATINUM, start, end)
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

    private Promotion promo(String code, String name, String description, int discountPercent,
                            Tier minTier, LocalDate start, LocalDate end) {
        Promotion p = new Promotion();
        p.setCode(code);
        p.setName(name);
        p.setDescription(description);
        p.setDiscountPercent(discountPercent);
        p.setMinTier(minTier);
        p.setTargetType(minTier != null ? PromotionTarget.TIER : PromotionTarget.ALL);
        p.setStartDate(start);
        p.setEndDate(end);
        p.setActive(true);
        return p;
    }
}
