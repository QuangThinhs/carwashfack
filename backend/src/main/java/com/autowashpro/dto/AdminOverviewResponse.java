package com.autowashpro.dto;

import java.util.List;

public class AdminOverviewResponse {

    private long totalCustomers;
    private long totalBookings;
    private long completedWashes;
    private long pendingBookings;
    private long revenue;
    private List<AdminBookingResponse> recentBookings;

    public AdminOverviewResponse(long totalCustomers, long totalBookings, long completedWashes,
                                 long pendingBookings, long revenue, List<AdminBookingResponse> recentBookings) {
        this.totalCustomers = totalCustomers;
        this.totalBookings = totalBookings;
        this.completedWashes = completedWashes;
        this.pendingBookings = pendingBookings;
        this.revenue = revenue;
        this.recentBookings = recentBookings;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public long getCompletedWashes() {
        return completedWashes;
    }

    public long getPendingBookings() {
        return pendingBookings;
    }

    public long getRevenue() {
        return revenue;
    }

    public List<AdminBookingResponse> getRecentBookings() {
        return recentBookings;
    }
}
