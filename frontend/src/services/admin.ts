import { api } from "./api";

export interface AdminBooking {
  id: number;
  customerName: string;
  vehiclePlate: string;
  serviceName: string;
  scheduledTime: string;
  status: string;
  price: number;
}

export interface AdminOverview {
  totalCustomers: number;
  totalBookings: number;
  completedWashes: number;
  pendingBookings: number;
  revenue: number;
  recentBookings: AdminBooking[];
}

export async function getOverview(): Promise<AdminOverview> {
  const res = await api.get<AdminOverview>("/api/admin/overview");
  return res.data;
}
