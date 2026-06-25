import { api } from "./api";

export interface ServiceItem {
  id: number;
  name: string;
  category: string;
  price: number;
  durationMin: number;
}

export interface Booking {
  id: number;
  vehiclePlate: string;
  serviceName: string;
  scheduledTime: string;
  status: string;
  price: number;
  note: string | null;
}

export interface BookingPayload {
  vehicleId: number;
  serviceId: number;
  scheduledTime: string; // "YYYY-MM-DDTHH:mm"
  note?: string;
}

export async function getServices(): Promise<ServiceItem[]> {
  const res = await api.get<ServiceItem[]>("/api/services");
  return res.data;
}

export async function getBookings(): Promise<Booking[]> {
  const res = await api.get<Booking[]>("/api/bookings");
  return res.data;
}

export async function createBooking(data: BookingPayload): Promise<Booking> {
  const res = await api.post<Booking>("/api/bookings", data);
  return res.data;
}

export async function cancelBooking(id: number): Promise<Booking> {
  const res = await api.put<Booking>(`/api/bookings/${id}/cancel`, {});
  return res.data;
}
