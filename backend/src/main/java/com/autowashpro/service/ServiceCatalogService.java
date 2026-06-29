package com.autowashpro.service;

import com.autowashpro.dto.AdminServiceResponse;
import com.autowashpro.dto.ServiceItemRequest;
import com.autowashpro.entity.ServiceItem;
import com.autowashpro.repository.ServiceItemRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ServiceCatalogService {

    private final ServiceItemRepository repository;

    public ServiceCatalogService(ServiceItemRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<AdminServiceResponse> listAll() {
        return repository.findAll(Sort.by("id")).stream().map(this::toResponse).toList();
    }

    @Transactional
    public AdminServiceResponse create(ServiceItemRequest req) {
        ServiceItem item = new ServiceItem();
        apply(item, req);
        repository.save(item);
        return toResponse(item);
    }

    @Transactional
    public AdminServiceResponse update(Long id, ServiceItemRequest req) {
        ServiceItem item = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy dịch vụ"));
        apply(item, req);
        repository.save(item);
        return toResponse(item);
    }

    @Transactional
    public void delete(Long id) {
        ServiceItem item = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy dịch vụ"));
        try {
            repository.delete(item);
            repository.flush();
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException(
                    "Không thể xoá dịch vụ đang được dùng trong lịch đặt. Hãy ẩn dịch vụ thay vì xoá.");
        }
    }

    private void apply(ServiceItem item, ServiceItemRequest req) {
        item.setName(req.getName());
        item.setCategory(req.getCategory());
        item.setPrice(req.getPrice());
        item.setDurationMin(req.getDurationMin());
        item.setActive(req.isActive());
    }

    private AdminServiceResponse toResponse(ServiceItem s) {
        return new AdminServiceResponse(s.getId(), s.getName(), s.getCategory(),
                s.getPrice(), s.getDurationMin(), s.isActive());
    }
}
