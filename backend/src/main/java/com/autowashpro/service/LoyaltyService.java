package com.autowashpro.service;

import com.autowashpro.dto.LoyaltySummaryResponse;
import com.autowashpro.dto.PointHistoryResponse;
import com.autowashpro.entity.Customer;
import com.autowashpro.entity.LoyaltyAccount;
import com.autowashpro.entity.PointEntryType;
import com.autowashpro.entity.PointTransaction;
import com.autowashpro.entity.Tier;
import com.autowashpro.repository.CustomerRepository;
import com.autowashpro.repository.LoyaltyAccountRepository;
import com.autowashpro.repository.PointTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LoyaltyService {

    private final LoyaltyAccountRepository loyaltyRepo;
    private final PointTransactionRepository pointRepo;
    private final CustomerRepository customerRepo;

    public LoyaltyService(LoyaltyAccountRepository loyaltyRepo,
                          PointTransactionRepository pointRepo,
                          CustomerRepository customerRepo) {
        this.loyaltyRepo = loyaltyRepo;
        this.pointRepo = pointRepo;
        this.customerRepo = customerRepo;
    }

    /** Tich diem khi mot lan rua hoan tat; cap nhat chi tieu, luot, va nang hang neu du dieu kien. */
    @Transactional
    public void earnForWash(Customer customer, long price, String serviceName) {
        LoyaltyAccount acc = getOrCreate(customer);
        int earned = (int) Math.round(price * acc.getTier().getPointRate() / 1000.0);
        acc.setPointsBalance(acc.getPointsBalance() + earned);
        acc.setLifetimeSpend(acc.getLifetimeSpend() + price);
        acc.setVisitCount(acc.getVisitCount() + 1);

        Tier newTier = Tier.fromSpend(acc.getLifetimeSpend());
        if (newTier.ordinal() > acc.getTier().ordinal()) {
            acc.setTier(newTier);
        }
        loyaltyRepo.save(acc);

        PointTransaction pt = new PointTransaction();
        pt.setLoyaltyAccount(acc);
        pt.setType(PointEntryType.EARN);
        pt.setPoints(earned);
        pt.setDescription("Tích điểm từ: " + serviceName);
        pointRepo.save(pt);
    }

    @Transactional
    public LoyaltySummaryResponse getSummary(String username) {
        LoyaltyAccount acc = getOrCreate(customer(username));
        Tier tier = acc.getTier();
        Tier next = tier.next();
        long spend = acc.getLifetimeSpend();

        String nextLabel = next != null ? next.getLabel() : null;
        long spendToNext = next != null ? Math.max(0, next.getSpendThreshold() - spend) : 0;

        int progress;
        if (next == null) {
            progress = 100;
        } else {
            long range = next.getSpendThreshold() - tier.getSpendThreshold();
            long done = spend - tier.getSpendThreshold();
            progress = range <= 0 ? 100 : (int) Math.min(100, Math.max(0, done * 100 / range));
        }

        return new LoyaltySummaryResponse(tier.name(), tier.getLabel(), acc.getPointsBalance(),
                acc.getLifetimeSpend(), acc.getVisitCount(), tier.getDiscountPercent(),
                tier.getBookingWindowDays(), nextLabel, spendToNext, progress);
    }

    @Transactional
    public List<PointHistoryResponse> getLedger(String username) {
        LoyaltyAccount acc = getOrCreate(customer(username));
        return pointRepo.findByLoyaltyAccountIdOrderByCreatedAtDesc(acc.getId()).stream()
                .map(p -> new PointHistoryResponse(p.getId(), p.getType().name(), p.getPoints(),
                        p.getDescription(), p.getCreatedAt()))
                .toList();
    }

    @Transactional
    public Tier getTier(String username) {
        return getOrCreate(customer(username)).getTier();
    }

    /** Hang hien tai cua khach (khong tao moi tai khoan diem) — dung de kiem tra dieu kien khuyen mai. */
    @Transactional(readOnly = true)
    public Tier tierOf(Customer customer) {
        return loyaltyRepo.findByCustomerId(customer.getId())
                .map(LoyaltyAccount::getTier)
                .orElse(Tier.MEMBER);
    }

    private LoyaltyAccount getOrCreate(Customer customer) {
        return loyaltyRepo.findByCustomerId(customer.getId()).orElseGet(() -> {
            LoyaltyAccount a = new LoyaltyAccount();
            a.setCustomer(customer);
            a.setTier(Tier.MEMBER);
            a.setPointsBalance(0);
            a.setLifetimeSpend(0);
            a.setVisitCount(0);
            return loyaltyRepo.save(a);
        });
    }

    private Customer customer(String username) {
        return customerRepo.findByUserUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng"));
    }
}
