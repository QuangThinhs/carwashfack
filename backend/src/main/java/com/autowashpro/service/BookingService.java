package com.autowashpro.service;

import com.autowashpro.dto.BookingRequest;
import com.autowashpro.dto.BookingResponse;
import com.autowashpro.dto.ServiceLineResponse;
import com.autowashpro.entity.Booking;
import com.autowashpro.entity.BookingStatus;
import com.autowashpro.entity.Customer;
import com.autowashpro.entity.ServiceItem;
import com.autowashpro.entity.Vehicle;
import com.autowashpro.repository.BookingRepository;
import com.autowashpro.repository.CustomerRepository;
import com.autowashpro.repository.ServiceItemRepository;
import com.autowashpro.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

@Service
public class BookingService {

    /** Cua so dat lich cua hang Member (ngay). Cac hang khac se mo rong sau. */
    private static final int MEMBER_WINDOW_DAYS = 7;

    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final CustomerRepository customerRepository;
    private final LoyaltyService loyaltyService;
    private final PromotionService promotionService;

    public BookingService(BookingRepository bookingRepository,
                          VehicleRepository vehicleRepository,
                          ServiceItemRepository serviceItemRepository,
                          CustomerRepository customerRepository,
                          LoyaltyService loyaltyService,
                          PromotionService promotionService) {
        this.bookingRepository = bookingRepository;
        this.vehicleRepository = vehicleRepository;
        this.serviceItemRepository = serviceItemRepository;
        this.customerRepository = customerRepository;
        this.loyaltyService = loyaltyService;
        this.promotionService = promotionService;
    }

    @Transactional
    public BookingResponse create(String username, BookingRequest req) {
        Customer customer = currentCustomer(username);

        Vehicle vehicle = vehicleRepository.findByIdAndCustomerId(req.getVehicleId(), customer.getId())
                .orElseThrow(() -> new IllegalArgumentException("Xe không hợp lệ"));

        List<ServiceItem> chosen = resolveServices(req.getServiceIds());
        long base = chosen.stream().mapToLong(ServiceItem::getPrice).sum();

        LocalDateTime time = req.getScheduledTime();
        LocalDateTime now = LocalDateTime.now();
        if (time.isBefore(now)) {
            throw new IllegalArgumentException("Thời gian đặt lịch phải ở tương lai");
        }
        if (time.isAfter(now.plusDays(MEMBER_WINDOW_DAYS))) {
            throw new IllegalArgumentException("Chỉ được đặt trước tối đa " + MEMBER_WINDOW_DAYS + " ngày (hạng Member)");
        }

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setVehicle(vehicle);
        booking.setService(chosen.get(0));
        booking.setExtraServices(new LinkedHashSet<>(chosen.subList(1, chosen.size())));
        booking.setScheduledTime(time);
        booking.setStatus(BookingStatus.PENDING);
        booking.setNote(req.getNote());

        String code = req.getPromoCode();
        if (code != null && !code.isBlank()) {
            PromotionService.AppliedPromo applied = promotionService.applyForBooking(customer, code, base);
            booking.setOriginalPrice(base);
            booking.setPrice(applied.finalPrice());
            booking.setPromotion(applied.promotion());
        } else {
            booking.setPrice(base);
        }

        bookingRepository.save(booking);
        return toResponse(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> list(String username) {
        Customer customer = currentCustomer(username);
        return bookingRepository.findByCustomerIdOrderByScheduledTimeDesc(customer.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public BookingResponse complete(String username, Long id) {
        Customer customer = currentCustomer(username);
        Booking booking = bookingRepository.findByIdAndCustomerId(id, customer.getId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lịch đặt"));
        if (booking.getStatus() == BookingStatus.DONE || booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalArgumentException("Lịch này đã kết thúc");
        }
        booking.setStatus(BookingStatus.DONE);
        bookingRepository.save(booking);
        // Tich diem cho lan rua vua hoan tat
        loyaltyService.earnForWash(booking.getCustomer(), booking.getPrice(), booking.serviceLabel());
        return toResponse(booking);
    }

    @Transactional
    public BookingResponse cancel(String username, Long id) {
        Customer customer = currentCustomer(username);
        Booking booking = bookingRepository.findByIdAndCustomerId(id, customer.getId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lịch đặt"));
        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalArgumentException("Không thể huỷ lịch ở trạng thái này");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        return toResponse(booking);
    }

    private List<ServiceItem> resolveServices(List<Long> serviceIds) {
        List<ServiceItem> chosen = new ArrayList<>();
        for (Long sid : serviceIds) {
            chosen.add(serviceItemRepository.findById(sid)
                    .orElseThrow(() -> new IllegalArgumentException("Dịch vụ không hợp lệ")));
        }
        return chosen;
    }

    private Customer currentCustomer(String username) {
        return customerRepository.findByUserUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng"));
    }

    private BookingResponse toResponse(Booking b) {
        List<ServiceLineResponse> lines = b.allServices().stream()
                .map(s -> new ServiceLineResponse(s.getName(), s.getPrice()))
                .toList();
        return new BookingResponse(
                b.getId(),
                b.getVehicle().getLicensePlate(),
                b.serviceLabel(),
                lines,
                b.getScheduledTime(),
                b.getStatus().name(),
                b.getPrice(),
                b.getNote(),
                b.getOriginalPrice(),
                b.getPromotion() != null ? b.getPromotion().getCode() : null
        );
    }
}
