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

/** Trạng thái booking đang hoạt động (hiển thị ở trang đặt lịch). */
export const ACTIVE_STATUSES = ["PENDING", "CONFIRMED", "IN_PROGRESS"];

export const BOOKING_STATUS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Chờ xác nhận", cls: "bg-amber-500/15 text-amber-300" },
  CONFIRMED: { label: "Đã xác nhận", cls: "bg-blue-500/15 text-blue-300" },
  IN_PROGRESS: { label: "Đang rửa", cls: "bg-cyan-500/15 text-cyan-300" },
  DONE: { label: "Hoàn tất", cls: "bg-green-500/15 text-green-300" },
  CANCELLED: { label: "Đã huỷ", cls: "bg-slate-500/15 text-slate-400" },
};

export const fmtPrice = (n: number) => n.toLocaleString("vi-VN") + "đ";

export const fmtTime = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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

export async function completeBooking(id: number): Promise<Booking> {
  const res = await api.put<Booking>(`/api/bookings/${id}/complete`, {});
  return res.data;
}

export async function cancelBooking(id: number): Promise<Booking> {
  const res = await api.put<Booking>(`/api/bookings/${id}/cancel`, {});
  return res.data;
}
