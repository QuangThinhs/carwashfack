package com.autowashpro.service;

import com.autowashpro.dto.PromoApplyResponse;
import com.autowashpro.dto.PromotionResponse;
import com.autowashpro.entity.Customer;
import com.autowashpro.entity.Promotion;
import com.autowashpro.entity.PromotionTarget;
import com.autowashpro.entity.ServiceItem;
import com.autowashpro.entity.Tier;
import com.autowashpro.repository.CustomerRepository;
import com.autowashpro.repository.PromotionRepository;
import com.autowashpro.repository.ServiceItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final CustomerRepository customerRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final LoyaltyService loyaltyService;

    public PromotionService(PromotionRepository promotionRepository,
                            CustomerRepository customerRepository,
                            ServiceItemRepository serviceItemRepository,
                            LoyaltyService loyaltyService) {
        this.promotionRepository = promotionRepository;
        this.customerRepository = customerRepository;
        this.serviceItemRepository = serviceItemRepository;
        this.loyaltyService = loyaltyService;
    }

    /** Khuyen mai dang hieu luc va phu hop voi khach (hang/danh sach user) va con luot. */
    @Transactional(readOnly = true)
    public List<PromotionResponse> getForCustomer(String username) {
        Customer customer = customer(username);
        Tier tier = loyaltyService.tierOf(customer);
        LocalDate today = LocalDate.now();
        return promotionRepository.findByActiveTrueOrderByDiscountPercentDesc().stream()
                .filter(p -> !today.isBefore(p.getStartDate()) && !today.isAfter(p.getEndDate()))
                .filter(p -> p.getUsageLimit() == null || p.getUsageCount() < p.getUsageLimit())
                .filter(p -> eligible(p, customer, tier))
                .map(p -> new PromotionResponse(p.getId(), p.getCode(), p.getName(), p.getDescription(),
                        p.getDiscountPercent(), targetLabel(p)))
                .toList();
    }

    /** Khach xem truoc giam gia khi go ma (khong tang luot). Tra ve valid=false + ly do neu khong hop le. */
    @Transactional(readOnly = true)
    public PromoApplyResponse preview(String username, String code, List<Long> serviceIds) {
        Customer customer = customer(username);
        long base = sumServices(serviceIds);
        try {
            Tier tier = loyaltyService.tierOf(customer);
            Promotion p = resolveValid(customer, tier, code);
            long discount = base * p.getDiscountPercent() / 100;
            return PromoApplyResponse.ok(p.getCode(), p.getName(), p.getDiscountPercent(), base, discount, base - discount);
        } catch (IllegalArgumentException e) {
            return PromoApplyResponse.fail(base, e.getMessage());
        }
    }

    /** Ap dung ma khi tao booking: kiem tra hop le, tang luot, tra ve ket qua giam. Nem loi neu khong hop le. */
    @Transactional
    public AppliedPromo applyForBooking(Customer customer, String code, long basePrice) {
        Tier tier = loyaltyService.tierOf(customer);
        Promotion p = resolveValid(customer, tier, code);
        long discount = basePrice * p.getDiscountPercent() / 100;
        if (promotionRepository.incrementUsage(p.getId()) == 0) {
            throw new IllegalArgumentException("Mã khuyến mãi đã hết lượt sử dụng");
        }
        return new AppliedPromo(p, discount, basePrice - discount);
    }

    /** Admin xem truoc giam gia cho mot khach hang cu the (day du dieu kien hang/user). */
    @Transactional(readOnly = true)
    public PromoApplyResponse previewForCustomer(Long customerId, String code, List<Long> serviceIds) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng"));
        long base = sumServices(serviceIds);
        try {
            Tier tier = loyaltyService.tierOf(customer);
            Promotion p = resolveValid(customer, tier, code);
            long discount = base * p.getDiscountPercent() / 100;
            return PromoApplyResponse.ok(p.getCode(), p.getName(), p.getDiscountPercent(), base, discount, base - discount);
        } catch (IllegalArgumentException e) {
            return PromoApplyResponse.fail(base, e.getMessage());
        }
    }

    /** Admin xem truoc giam gia cho order khach vang lai (chi ma doi tuong ALL). */
    @Transactional(readOnly = true)
    public PromoApplyResponse previewForWalkIn(String code, List<Long> serviceIds) {
        long base = sumServices(serviceIds);
        try {
            Promotion p = resolveValidWalkIn(code);
            long discount = base * p.getDiscountPercent() / 100;
            return PromoApplyResponse.ok(p.getCode(), p.getName(), p.getDiscountPercent(), base, discount, base - discount);
        } catch (IllegalArgumentException e) {
            return PromoApplyResponse.fail(base, e.getMessage());
        }
    }

    /** Ap dung ma cho order khach vang lai khi tao order (tang luot). */
    @Transactional
    public AppliedPromo applyForWalkIn(String code, long basePrice) {
        Promotion p = resolveValidWalkIn(code);
        long discount = basePrice * p.getDiscountPercent() / 100;
        if (promotionRepository.incrementUsage(p.getId()) == 0) {
            throw new IllegalArgumentException("Mã khuyến mãi đã hết lượt sử dụng");
        }
        return new AppliedPromo(p, discount, basePrice - discount);
    }

    /** Cac kiem tra chung: ton tai, dang chay, trong han, con luot. */
    private Promotion resolveBase(String code) {
        Promotion p = promotionRepository.findByCodeIgnoreCase(code.trim())
                .orElseThrow(() -> new IllegalArgumentException("Mã khuyến mãi không tồn tại"));
        if (!p.isActive()) {
            throw new IllegalArgumentException("Mã khuyến mãi đã ngừng áp dụng");
        }
        LocalDate today = LocalDate.now();
        if (today.isBefore(p.getStartDate())) {
            throw new IllegalArgumentException("Mã khuyến mãi chưa bắt đầu");
        }
        if (today.isAfter(p.getEndDate())) {
            throw new IllegalArgumentException("Mã khuyến mãi đã hết hạn");
        }
        if (p.getUsageLimit() != null && p.getUsageCount() >= p.getUsageLimit()) {
            throw new IllegalArgumentException("Mã khuyến mãi đã hết lượt sử dụng");
        }
        return p;
    }

    private Promotion resolveValid(Customer customer, Tier tier, String code) {
        Promotion p = resolveBase(code);
        if (!eligible(p, customer, tier)) {
            if (target(p) == PromotionTarget.TIER && p.getMinTier() != null) {
                throw new IllegalArgumentException("Mã chỉ dành cho hạng " + p.getMinTier().getLabel() + " trở lên");
            }
            throw new IllegalArgumentException("Mã không áp dụng cho tài khoản của bạn");
        }
        return p;
    }

    /** Khach vang lai khong co tai khoan -> chi ma ALL moi ap dung duoc. */
    private Promotion resolveValidWalkIn(String code) {
        Promotion p = resolveBase(code);
        if (target(p) != PromotionTarget.ALL) {
            throw new IllegalArgumentException("Mã này chỉ áp dụng cho khách có tài khoản");
        }
        return p;
    }

    private boolean eligible(Promotion p, Customer customer, Tier tier) {
        return switch (target(p)) {
            case ALL -> true;
            case TIER -> p.getMinTier() == null || tier.ordinal() >= p.getMinTier().ordinal();
            case USER -> p.getTargetCustomers().stream().anyMatch(c -> c.getId().equals(customer.getId()));
        };
    }

    private String targetLabel(Promotion p) {
        return switch (target(p)) {
            case TIER -> p.getMinTier() != null ? p.getMinTier().getLabel() : null;
            case USER -> "Dành riêng cho bạn";
            case ALL -> null;
        };
    }

    private PromotionTarget target(Promotion p) {
        return p.getTargetType() != null ? p.getTargetType() : PromotionTarget.ALL;
    }

    private Customer customer(String username) {
        return customerRepository.findByUserUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng"));
    }

    /** Tong gia cac dich vu duoc chon. */
    private long sumServices(List<Long> serviceIds) {
        long base = 0;
        for (Long sid : serviceIds) {
            ServiceItem s = serviceItemRepository.findById(sid)
                    .orElseThrow(() -> new IllegalArgumentException("Dịch vụ không hợp lệ"));
            base += s.getPrice();
        }
        return base;
    }

    /** Ket qua ap dung ma cho mot booking. */
    public record AppliedPromo(Promotion promotion, long discountAmount, long finalPrice) {
    }
}
