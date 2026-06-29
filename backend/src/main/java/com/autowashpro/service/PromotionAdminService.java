package com.autowashpro.service;

import com.autowashpro.dto.AdminPromotionResponse;
import com.autowashpro.dto.PromoCustomerSummary;
import com.autowashpro.dto.PromotionRequest;
import com.autowashpro.entity.Customer;
import com.autowashpro.entity.Promotion;
import com.autowashpro.entity.PromotionTarget;
import com.autowashpro.entity.Tier;
import com.autowashpro.repository.CustomerRepository;
import com.autowashpro.repository.PromotionRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PromotionAdminService {

    private final PromotionRepository repository;
    private final CustomerRepository customerRepository;

    public PromotionAdminService(PromotionRepository repository, CustomerRepository customerRepository) {
        this.repository = repository;
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminPromotionResponse> listAll() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "id")).stream().map(this::toResponse).toList();
    }

    @Transactional
    public AdminPromotionResponse create(PromotionRequest req) {
        Promotion p = new Promotion();
        apply(p, req);
        repository.save(p);
        return toResponse(p);
    }

    @Transactional
    public AdminPromotionResponse update(Long id, PromotionRequest req) {
        Promotion p = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khuyến mãi"));
        apply(p, req);
        repository.save(p);
        return toResponse(p);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy khuyến mãi");
        }
        repository.deleteById(id);
    }

    private void apply(Promotion p, PromotionRequest req) {
        p.setCode(req.getCode());
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setDiscountPercent(req.getDiscountPercent());

        PromotionTarget target = parseTarget(req.getTargetType());
        p.setTargetType(target);
        p.setUsageLimit(req.getUsageLimit() != null && req.getUsageLimit() > 0 ? req.getUsageLimit() : null);

        // Hang ap dung chi co y nghia khi targetType = TIER
        p.setMinTier(target == PromotionTarget.TIER ? parseTier(req.getMinTier()) : null);

        // Danh sach khach hang chi co y nghia khi targetType = USER
        p.getTargetCustomers().clear();
        if (target == PromotionTarget.USER && req.getTargetCustomerIds() != null) {
            for (Long cid : req.getTargetCustomerIds()) {
                customerRepository.findById(cid).ifPresent(c -> p.getTargetCustomers().add(c));
            }
        }
        if (target == PromotionTarget.USER && p.getTargetCustomers().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng chọn ít nhất một khách hàng áp dụng");
        }

        p.setStartDate(req.getStartDate());
        p.setEndDate(req.getEndDate());
        p.setActive(req.isActive());
    }

    private PromotionTarget parseTarget(String s) {
        if (s == null || s.isBlank()) {
            return PromotionTarget.ALL;
        }
        return PromotionTarget.valueOf(s);
    }

    private Tier parseTier(String s) {
        if (s == null || s.isBlank()) {
            return null;
        }
        return Tier.valueOf(s);
    }

    private AdminPromotionResponse toResponse(Promotion p) {
        List<PromoCustomerSummary> targets = p.getTargetCustomers().stream()
                .map(c -> new PromoCustomerSummary(c.getId(), c.getFullName(), c.getPhone()))
                .toList();
        return new AdminPromotionResponse(p.getId(), p.getCode(), p.getName(), p.getDescription(),
                p.getDiscountPercent(),
                p.getTargetType() != null ? p.getTargetType().name() : PromotionTarget.ALL.name(),
                p.getMinTier() != null ? p.getMinTier().name() : null,
                p.getUsageLimit(), p.getUsageCount(), targets,
                p.getStartDate(), p.getEndDate(), p.isActive());
    }
}
