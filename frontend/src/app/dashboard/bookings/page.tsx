"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X, CalendarClock, Clock } from "lucide-react";
import { getUser, type AuthUser } from "@/lib/auth";
import { getVehicles, type Vehicle } from "@/services/vehicle";
import {
  getServices,
  getBookings,
  createBooking,
  cancelBooking,
  type ServiceItem,
  type Booking,
} from "@/services/booking";
import CustomerTopbar from "@/components/CustomerTopbar";

const STATUS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Chờ xác nhận", cls: "bg-amber-50 text-amber-600" },
  CONFIRMED: { label: "Đã xác nhận", cls: "bg-blue-50 text-blue-600" },
  IN_PROGRESS: { label: "Đang rửa", cls: "bg-cyan-50 text-cyan-600" },
  DONE: { label: "Hoàn tất", cls: "bg-green-50 text-green-600" },
  CANCELLED: { label: "Đã huỷ", cls: "bg-slate-100 text-slate-500" },
};

const fmtPrice = (n: number) => n.toLocaleString("vi-VN") + "đ";

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function toLocalInput(d: Date) {
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function BookingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ vehicleId: "", serviceId: "", scheduledTime: "", note: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
    Promise.all([getBookings(), getVehicles(), getServices()])
      .then(([b, v, s]) => {
        setBookings(b);
        setVehicles(v);
        setServices(s);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  function reloadBookings() {
    getBookings().then(setBookings).catch(() => {});
  }

  function openModal() {
    if (vehicles.length === 0) {
      router.push("/dashboard/vehicles");
      return;
    }
    setError("");
    setForm({
      vehicleId: String(vehicles[0].id),
      serviceId: services[0] ? String(services[0].id) : "",
      scheduledTime: "",
      note: "",
    });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createBooking({
        vehicleId: Number(form.vehicleId),
        serviceId: Number(form.serviceId),
        scheduledTime: form.scheduledTime,
        note: form.note,
      });
      setOpen(false);
      reloadBookings();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Đặt lịch thất bại, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel(b: Booking) {
    if (!confirm("Huỷ lịch đặt này?")) return;
    try {
      await cancelBooking(b.id);
      reloadBookings();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Huỷ thất bại.");
    }
  }

  if (!user) return null;

  const now = new Date();
  const max = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerTopbar user={user} />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-cyan-600 transition mb-5"
        >
          <ArrowLeft size={16} /> Quay lại
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Đặt lịch rửa xe</h1>
            <p className="text-slate-500 mt-1">Đặt lịch và theo dõi các lần rửa của bạn.</p>
          </div>
          <button
            onClick={openModal}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-semibold px-4 py-2.5 hover:opacity-95 transition"
          >
            <Plus size={18} /> Đặt lịch
          </button>
        </div>

        {loading ? (
          <p className="text-slate-400">Đang tải...</p>
        ) : vehicles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <p className="text-slate-500">Bạn cần thêm xe trước khi đặt lịch.</p>
            <Link
              href="/dashboard/vehicles"
              className="mt-3 inline-block text-cyan-600 font-medium hover:underline"
            >
              → Thêm xe của tôi
            </Link>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <CalendarClock size={40} strokeWidth={1.5} className="mx-auto text-slate-300" />
            <p className="mt-3 text-slate-500">Bạn chưa có lịch đặt nào.</p>
            <button
              onClick={openModal}
              className="mt-4 inline-flex items-center gap-2 text-cyan-600 font-medium hover:underline"
            >
              <Plus size={16} /> Đặt lịch đầu tiên
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => {
              const st = STATUS[b.status] ?? { label: b.status, cls: "bg-slate-100 text-slate-500" };
              const cancellable = b.status === "PENDING" || b.status === "CONFIRMED";
              return (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-800">{b.serviceName}</h3>
                      <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${st.cls}`}>
                        {st.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                      <Clock size={14} /> {fmtTime(b.scheduledTime)} · {b.vehiclePlate}
                    </p>
                    {b.note && <p className="text-sm text-slate-400 mt-1">Ghi chú: {b.note}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-cyan-600">{fmtPrice(b.price)}</p>
                    {cancellable && (
                      <button
                        onClick={() => handleCancel(b)}
                        className="text-sm text-slate-400 hover:text-red-500 transition mt-1"
                      >
                        Huỷ lịch
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal dat lich */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Đặt lịch rửa xe</h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
                  {error}
                </div>
              )}

              <label className="block mb-4">
                <span className="block text-sm font-medium text-slate-700 mb-1.5">Chọn xe</span>
                <select
                  value={form.vehicleId}
                  onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.licensePlate}
                      {v.brand ? ` · ${v.brand}` : ""}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block mb-4">
                <span className="block text-sm font-medium text-slate-700 mb-1.5">Dịch vụ</span>
                <select
                  value={form.serviceId}
                  onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {fmtPrice(s.price)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block mb-4">
                <span className="block text-sm font-medium text-slate-700 mb-1.5">
                  Thời gian (đặt trước tối đa 7 ngày)
                </span>
                <input
                  type="datetime-local"
                  value={form.scheduledTime}
                  min={toLocalInput(now)}
                  max={toLocalInput(max)}
                  onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                />
              </label>

              <label className="block mb-4">
                <span className="block text-sm font-medium text-slate-700 mb-1.5">Ghi chú (tuỳ chọn)</span>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 resize-none"
                />
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg border border-slate-300 text-slate-600 font-medium py-2.5 hover:bg-slate-50 transition"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-semibold py-2.5 hover:opacity-95 transition disabled:opacity-60"
                >
                  {saving ? "Đang đặt..." : "Xác nhận đặt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
