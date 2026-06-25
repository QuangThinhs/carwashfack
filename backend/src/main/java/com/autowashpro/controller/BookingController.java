package com.autowashpro.controller;

import com.autowashpro.dto.BookingRequest;
import com.autowashpro.dto.BookingResponse;
import com.autowashpro.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<BookingResponse> list(Principal principal) {
        return bookingService.list(principal.getName());
    }

    @PostMapping
    public ResponseEntity<BookingResponse> create(Principal principal, @Valid @RequestBody BookingRequest req) {
        return ResponseEntity.ok(bookingService.create(principal.getName(), req));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancel(Principal principal, @PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancel(principal.getName(), id));
    }
}
