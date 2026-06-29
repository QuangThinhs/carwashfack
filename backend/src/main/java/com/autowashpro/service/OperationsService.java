package com.autowashpro.service;

import com.autowashpro.dto.AdminBookingResponse;
import com.autowashpro.dto.AdminCustomerResponse;
import com.autowashpro.dto.ServiceLineResponse;
import com.autowashpro.dto.VehicleResponse;
import com.autowashpro.dto.WashBayResponse;
import com.autowashpro.entity.BayStatus;
import com.autowashpro.entity.Booking;
import com.autowashpro.entity.BookingStatus;
import com.autowashpro.entity.Customer;
import com.autowashpro.entity.ServiceItem;
import com.autowashpro.entity.Vehicle;
import com.autowashpro.entity.WashBay;
import com.autowashpro.repository.BookingRepository;
import com.autowashpro.repository.CustomerRepository;
import com.autowashpro.repository.ServiceItemRepository;
import com.autowashpro.repository.VehicleRepository;
import com.autowashpro.repository.WashBayRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

/** Van hanh: quan ly bai rua, lich dat phia admin, va order nhanh tai quay (khach vang lai). */
@Service
public class OperationsService {

    private final WashBayRepository bayRepo;
    private final BookingRepository bookingRepo;
    private final CustomerRepository customerRepo;
    private final VehicleRepository vehicleRepo;
    private final ServiceItemRepository serviceRepo;
    private final LoyaltyService loyaltyService;
    private final PromotionService promotionService;

    public OperationsService(WashBayRepository bayRepo, BookingRepository bookingRepo,
                             CustomerRepository customerRepo, VehicleRepository vehicleRepo,
                             ServiceItemRepository serviceRepo, LoyaltyService loyaltyService,
                             PromotionService promotionService) {
        this.bayRepo = bayRepo;
        this.bookingRepo = bookingRepo;
        this.customerRepo = customerRepo;
        this.vehicleRepo = vehicleRepo;
        this.serviceRepo = serviceRepo;
        this.loyaltyService = loyaltyService;
        this.promotionService = promotionService;
    }

    @Transactional(readOnly = true)
    public List<WashBayResponse> listBays() {
        return bayRepo.findAllByOrderByIdAsc().stream().map(this::toBay).toList();
    }

    /** Lich dat dang hoat dong: cho xac nhan / da xac nhan / dang rua (gan nhat len truoc). */
    @Transactional(readOnly = true)
    public List<AdminBookingResponse> listActiveBookings() {
        return bookingRepo.findByStatusInOrderByScheduledTimeAsc(
                        List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS))
                .stream().map(AdminBookingResponse::from).toList();
    }

    /** Lich su don hang: da hoan tat / da huy (moi nhat len truoc). */
    @Transactional(readOnly = true)
    public List<AdminBookingResponse> listHistory() {
        return bookingRepo.findByStatusInOrderByScheduledTimeDesc(
                        List.of(BookingStatus.DONE, BookingStatus.CANCELLED))
                .stream().map(AdminBookingResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<AdminCustomerResponse> listCustomers() {
        return customerRepo.findAll(Sort.by("fullName")).stream().map(c -> {
            List<VehicleResponse> vs = vehicleRepo.findByCustomerIdOrderByIdDesc(c.getId()).stream()
                    .map(v -> new VehicleResponse(v.getId(), v.getLicensePlate(), v.getCategory(), v.getType(), v.getBrand()))
                    .toList();
            return new AdminCustomerResponse(c.getId(), c.getFullName(), c.getPhone(), c.getEmail(), vs);
        }).toList();
    }

    // ----- Quan ly bai rua (them / doi ten / xoa) -----

    @Transactional
    public WashBayResponse createBay(String name) {
        WashBay bay = new WashBay();
        bay.setName(name);
        bay.setStatus(BayStatus.FREE);
        bayRepo.save(bay);
        return toBay(bay);
    }

    @Transactional
    public void renameBay(Long id, String name) {
        WashBay bay = bay(id);
        bay.setName(name);
        bayRepo.save(bay);
    }

    @Transactional
    public void deleteBay(Long id) {
        WashBay bay = bay(id);
        if (bay.getStatus() == BayStatus.OCCUPIED || bay.getCurrentBooking() != null) {
            throw new IllegalArgumentException("Bãi đang có xe, không thể xoá");
        }
        bayRepo.delete(bay);
    }

    /** Xep mot lich dat online (dang cho) vao mot bai trong -> bat dau rua. */
    @Transactional
    public void assign(Long bayId, Long bookingId) {
        WashBay bay = bay(bayId);
        if (bay.getStatus() != BayStatus.FREE) {
            throw new IllegalArgumentException("Bãi này đang có xe");
        }
        Booking booking = booking(bookingId);
        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalArgumentException("Lịch này không ở trạng thái chờ");
        }
        booking.setStatus(BookingStatus.IN_PROGRESS);
        bookingRepo.save(booking);
        occupy(bay, booking);
    }

    /** Order nhanh tai bai cho khach vang lai: nhap ten/SDT/bien so + chon dich vu -> rua ngay. */
    @Transactional
    public void createOrderAtBay(Long bayId, String customerName, String customerPhone, String vehiclePlate,
                                 List<Long> serviceIds, String promoCode) {
        WashBay bay = bay(bayId);
        if (bay.getStatus() != BayStatus.FREE) {
            throw new IllegalArgumentException("Bãi này đang có xe");
        }
        List<ServiceItem> chosen = new ArrayList<>();
        for (Long sid : serviceIds) {
            chosen.add(serviceRepo.findById(sid)
                    .orElseThrow(() -> new IllegalArgumentException("Dịch vụ không hợp lệ")));
        }
        long base = chosen.stream().mapToLong(ServiceItem::getPrice).sum();

        Booking booking = new Booking();
        booking.setWalkinName(customerName != null ? customerName.trim() : null);
        booking.setWalkinPhone(customerPhone != null && !customerPhone.isBlank() ? customerPhone.trim() : null);
        booking.setWalkinPlate(vehiclePlate != null ? vehiclePlate.trim() : null);
        booking.setService(chosen.get(0));
        booking.setExtraServices(new LinkedHashSet<>(chosen.subList(1, chosen.size())));
        booking.setScheduledTime(LocalDateTime.now());
        booking.setStatus(BookingStatus.IN_PROGRESS);

        if (promoCode != null && !promoCode.isBlank()) {
            PromotionService.AppliedPromo applied = promotionService.applyForWalkIn(promoCode, base);
            booking.setOriginalPrice(base);
            booking.setPrice(applied.finalPrice());
            booking.setPromotion(applied.promotion());
        } else {
            booking.setPrice(base);
        }

        bookingRepo.save(booking);
        occupy(bay, booking);
    }

    /** Admin tao lich dat (CONFIRMED) cho mot khach da dang ky. */
    @Transactional
    public AdminBookingResponse createBookingForCustomer(Long customerId, Long vehicleId, List<Long> serviceIds,
                                                         LocalDateTime scheduledTime, String note, String promoCode) {
        Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng"));
        Vehicle vehicle = vehicleRepo.findByIdAndCustomerId(vehicleId, customerId)
                .orElseThrow(() -> new IllegalArgumentException("Xe không thuộc khách hàng này"));
        if (scheduledTime == null || scheduledTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Thời gian đặt lịch phải ở tương lai");
        }
        List<ServiceItem> chosen = new ArrayList<>();
        for (Long sid : serviceIds) {
            chosen.add(serviceRepo.findById(sid)
                    .orElseThrow(() -> new IllegalArgumentException("Dịch vụ không hợp lệ")));
        }
        long base = chosen.stream().mapToLong(ServiceItem::getPrice).sum();

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setVehicle(vehicle);
        booking.setService(chosen.get(0));
        booking.setExtraServices(new LinkedHashSet<>(chosen.subList(1, chosen.size())));
        booking.setScheduledTime(scheduledTime);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setNote(note);

        if (promoCode != null && !promoCode.isBlank()) {
            PromotionService.AppliedPromo applied = promotionService.applyForBooking(customer, promoCode, base);
            booking.setOriginalPrice(base);
            booking.setPrice(applied.finalPrice());
            booking.setPromotion(applied.promotion());
        } else {
            booking.setPrice(base);
        }

        bookingRepo.save(booking);
        return AdminBookingResponse.from(booking);
    }

    /** Hoan tat rua tai bai -> lich DONE, tich diem (neu la khach co tai khoan), giai phong bai. */
    @Transactional
    public void completeBay(Long bayId) {
        WashBay bay = bay(bayId);
        Booking booking = bay.getCurrentBooking();
        if (bay.getStatus() != BayStatus.OCCUPIED || booking == null) {
            throw new IllegalArgumentException("Bãi này đang trống");
        }
        booking.setStatus(BookingStatus.DONE);
        bookingRepo.save(booking);
        if (booking.getCustomer() != null) {
            loyaltyService.earnForWash(booking.getCustomer(), booking.getPrice(), booking.serviceLabel());
        }
        bay.setStatus(BayStatus.FREE);
        bay.setCurrentBooking(null);
        bayRepo.save(bay);
    }

    @Transactional
    public void confirmBooking(Long id) {
        Booking b = booking(id);
        if (b.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Chỉ xác nhận được lịch đang chờ");
        }
        b.setStatus(BookingStatus.CONFIRMED);
        bookingRepo.save(b);
    }

    @Transactional
    public void cancelBooking(Long id) {
        Booking b = booking(id);
        if (b.getStatus() != BookingStatus.PENDING && b.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalArgumentException("Không thể huỷ lịch ở trạng thái này");
        }
        b.setStatus(BookingStatus.CANCELLED);
        bookingRepo.save(b);
    }

    private void occupy(WashBay bay, Booking booking) {
        bay.setStatus(BayStatus.OCCUPIED);
        bay.setCurrentBooking(booking);
        bayRepo.save(bay);
    }

    private WashBay bay(Long id) {
        return bayRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bãi rửa"));
    }

    private Booking booking(Long id) {
        return bookingRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lịch đặt"));
    }

    private WashBayResponse toBay(WashBay bay) {
        Booking b = bay.getCurrentBooking();
        if (b == null) {
            return new WashBayResponse(bay.getId(), bay.getName(), bay.getStatus().name());
        }
        boolean walkIn = b.getCustomer() == null;
        String name = walkIn ? b.getWalkinName() : b.getCustomer().getFullName();
        String phone = walkIn ? b.getWalkinPhone() : b.getCustomer().getPhone();
        String plate = b.getVehicle() != null ? b.getVehicle().getLicensePlate() : b.getWalkinPlate();
        List<ServiceLineResponse> lines = b.allServices().stream()
                .map(s -> new ServiceLineResponse(s.getName(), s.getPrice()))
                .toList();
        return new WashBayResponse(bay.getId(), bay.getName(), bay.getStatus().name(), b.getId(),
                name, phone, plate, b.serviceLabel(), lines, b.getPrice(), b.getOriginalPrice(),
                b.getPromotion() != null ? b.getPromotion().getCode() : null, b.getScheduledTime());
    }
}
