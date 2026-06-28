import { api } from "./api";

import type { ServiceLine } from "./booking";

export interface AdminBooking {
  id: number;
  customerName: string;
  customerPhone: string | null;
  vehiclePlate: string | null;
  vehicleInfo: string | null;
  serviceName: string;
  services: ServiceLine[];
  scheduledTime: string;
  status: string;
  price: number;
  originalPrice: number | null;
  promoCode: string | null;
  note: string | null;
  walkIn: boolean;
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
