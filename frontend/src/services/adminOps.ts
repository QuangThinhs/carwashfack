import { api } from "./api";
import type { AdminBooking } from "./admin";

export type { AdminBooking };

export interface WashBay {
  id: number;
  name: string;
  status: string; // FREE | OCCUPIED
  bookingId: number | null;
  customerName: string | null;
  vehiclePlate: string | null;
  serviceName: string | null;
  price: number;
}

export interface AdminVehicle {
  id: number;
  licensePlate: string;
  category: string | null;
  type: string | null;
  brand: string | null;
}

export interface AdminCustomer {
  id: number;
  fullName: string;
  phone: string;
  vehicles: AdminVehicle[];
}

export async function getBays(): Promise<WashBay[]> {
  const res = await api.get<WashBay[]>("/api/admin/bays");
  return res.data;
}

export async function assignBay(bayId: number, bookingId: number): Promise<void> {
  await api.post(`/api/admin/bays/${bayId}/assign?bookingId=${bookingId}`);
}

export async function createBayOrder(
  bayId: number,
  data: { customerName: string; customerPhone?: string; vehiclePlate: string; serviceId: number },
): Promise<void> {
  await api.post(`/api/admin/bays/${bayId}/order`, data);
}

export async function completeBay(bayId: number): Promise<void> {
  await api.post(`/api/admin/bays/${bayId}/complete`);
}

export async function getAdminBookings(): Promise<AdminBooking[]> {
  const res = await api.get<AdminBooking[]>("/api/admin/bookings");
  return res.data;
}

export async function getBookingHistory(): Promise<AdminBooking[]> {
  const res = await api.get<AdminBooking[]>("/api/admin/bookings/history");
  return res.data;
}

export async function createBay(name: string): Promise<void> {
  await api.post("/api/admin/bays", { name });
}

export async function renameBay(id: number, name: string): Promise<void> {
  await api.patch(`/api/admin/bays/${id}`, { name });
}

export async function deleteBay(id: number): Promise<void> {
  await api.delete(`/api/admin/bays/${id}`);
}

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  const res = await api.get<AdminCustomer[]>("/api/admin/customers");
  return res.data;
}

export async function confirmBooking(id: number): Promise<void> {
  await api.post(`/api/admin/bookings/${id}/confirm`);
}

export async function cancelBookingAdmin(id: number): Promise<void> {
  await api.post(`/api/admin/bookings/${id}/cancel`);
}
