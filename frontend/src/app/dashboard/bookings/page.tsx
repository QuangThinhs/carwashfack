"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X, CalendarClock, Clock, History, Ticket } from "lucide-react";
import { getUser, type AuthUser } from "@/lib/auth";
import { getVehicles, type Vehicle } from "@/services/vehicle";
import {
  getServices,
  getBookings,
  createBooking,
  completeBooking,
  cancelBooking,
  BOOKING_STATUS,
  ACTIVE_STATUSES,
  fmtPrice,
  fmtTime,
  type ServiceItem,
  type Booking,
} from "@/services/booking";
import { applyPromo, type PromoApplyResult } from "@/services/promotion";
import CustomerTopbar from "@/components/CustomerTopbar";
import { useToast } from "@/components/Toast";
import { useConfirm } from "@/components/ConfirmDialog";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30";

function toLocalInput(d: Date) {
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function BookingsPage() {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ vehicleId: string; serviceIds: number[]; scheduledTime: string; note: string }>(
    { vehicleId: "", serviceIds: [], scheduledTime: "", note: "" },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promo, setPromo] = useState<PromoApplyResult | null>(null);
  const [promoChecking, setPromoChecking] = useState(false);

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
    setPromoCode("");
    setPromo(null);
    setForm({
      vehicleId: String(vehicles[0].id),
      serviceIds: services[0] ? [services[0].id] : [],
      scheduledTime: "",
      note: "",
    });
    setOpen(true);
  }

  function toggleService(id: number) {
    setForm((f) => ({
      ...f,
      serviceIds: f.serviceIds.includes(id) ? f.serviceIds.filter((x) => x !== id) : [...f.serviceIds, id],
    }));
    setPromo(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.serviceIds.length === 0) {
      setError("Vui lòng chọn ít nhất một dịch vụ.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await createBooking({
        vehicleId: Number(form.vehicleId),
        serviceIds: form.serviceIds,
        scheduledTime: form.scheduledTime,
        note: form.note,
        promoCode: promo?.valid ? promoCode.trim() : undefined,
      });
      setOpen(false);
      reloadBookings();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Đặt lịch thất bại, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  async function handleApplyPromo() {
    if (!promoCode.trim() || form.serviceIds.length === 0) return;
    setPromoChecking(true);
    try {
      const r = await applyPromo(promoCode.trim(), form.serviceIds);
      setPromo(r);
    } catch {
      setPromo(null);
      setError("Không kiểm tra được mã khuyến mãi.");
    } finally {
      setPromoChecking(false);
    }
  }

  async function handleComplete(b: Booking) {
    if (!(await confirm({ message: `Xác nhận đã rửa xong "${b.serviceName}"?`, confirmText: "Đã xong" }))) return;
    try {
      await completeBooking(b.id);
      reloadBookings();
    } catch (err: any) {
      toast(err?.response?.data?.message || "Thao tác thất bại.");
    }
  }

  async function handleCancel(b: Booking) {
    if (!(await confirm({ message: "Huỷ lịch đặt này?", danger: true, confirmText: "Huỷ lịch" }))) return;
    try {
      await cancelBooking(b.id);
      reloadBookings();
    } catch (err: any) {
      toast(err?.response?.data?.message || "Huỷ thất bại.");
    }
  }

  if (!user) return null;

  const active = bookings.filter((b) => ACTIVE_STATUSES.includes(b.status));
  const now = new Date();
  const max = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const baseTotal = services.filter((s) => form.serviceIds.includes(s.id)).reduce((sum, s) => sum + s.price, 0);
  const finalTotal = promo?.valid ? promo.finalPrice : baseTotal;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <CustomerTopbar user={user} />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-cyan-400 transition mb-5"
        >
          <ArrowLeft size={16} /> Quay lại
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Đặt lịch rửa xe</h1>
            <p className="text-slate-400 mt-1">Các lịch đang chờ &amp; đang xử lý của bạn.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/history"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-cyan-400 transition"
            >
              <History size={16} /> Lịch sử
            </Link>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 text-white font-semibold px-4 py-2.5 hover:bg-cyan-400 transition"
            >
              <Plus size={18} /> Đặt lịch
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500">Đang tải...</p>
        ) : vehicles.length === 0 ? (
          <div className="bg-slate-900/50 rounded-2xl border border-dashed border-white/15 p-12 text-center">
            <p className="text-slate-400">Bạn cần thêm xe trước khi đặt lịch.</p>
            <Link
              href="/dashboard/vehicles"
              className="mt-3 inline-block text-cyan-400 font-medium hover:underline"
            >
              → Thêm xe của tôi
            </Link>
          </div>
        ) : active.length === 0 ? (
          <div className="bg-slate-900/50 rounded-2xl border border-dashed border-white/15 p-12 text-center">
            <CalendarClock size={40} strokeWidth={1.5} className="mx-auto text-slate-600" />
            <p className="mt-3 text-slate-400">Bạn chưa có lịch nào đang chờ.</p>
            <button
              onClick={openModal}
              className="mt-4 inline-flex items-center gap-2 text-cyan-400 font-medium hover:underline"
            >
              <Plus size={16} /> Đặt lịch mới
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {active.map((b) => {
              const st = BOOKING_STATUS[b.status] ?? { label: b.status, cls: "bg-slate-500/15 text-slate-400" };
              return (
                <div
                  key={b.id}
                  className="bg-slate-900 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white">{b.serviceName}</h3>
                      <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${st.cls}`}>
                        {st.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                      <Clock size={14} /> {fmtTime(b.scheduledTime)} · {b.vehiclePlate}
                    </p>
                    {b.note && <p className="text-sm text-slate-500 mt-1">Ghi chú: {b.note}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    {b.originalPrice != null && b.originalPrice > b.price && (
                      <p className="text-xs text-slate-500 line-through">{fmtPrice(b.originalPrice)}</p>
                    )}
                    <p className="font-bold text-cyan-400">{fmtPrice(b.price)}</p>
                    {b.promoCode && (
                      <p className="text-[11px] text-green-400">Mã {b.promoCode}</p>
                    )}
                    <div className="flex items-center gap-3 justify-end mt-1">
                      <button
                        onClick={() => handleComplete(b)}
                        className="text-sm text-slate-400 hover:text-green-400 transition"
                      >
                        Đã rửa xong
                      </button>
                      <button
                        onClick={() => handleCancel(b)}
                        className="text-sm text-slate-500 hover:text-red-400 transition"
                      >
                        Huỷ
                      </button>
                    </div>
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
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Đặt lịch rửa xe</h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">
                  {error}
                </div>
              )}

              <label className="block mb-4">
                <span className="block text-sm font-medium text-slate-300 mb-1.5">Chọn xe</span>
                <select
                  value={form.vehicleId}
                  onChange={(e) => {
                    setForm({ ...form, vehicleId: e.target.value });
                    setPromo(null);
                  }}
                  required
                  className={inputCls}
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id} className="bg-slate-800">
                      {v.licensePlate}
                      {v.brand ? ` · ${v.brand}` : ""}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mb-4">
                <span className="block text-sm font-medium text-slate-300 mb-1.5">Dịch vụ (chọn 1 hoặc nhiều)</span>
                <div className="space-y-1.5">
                  {services.map((s) => {
                    const checked = form.serviceIds.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 cursor-pointer transition ${
                          checked
                            ? "border-cyan-500/50 bg-cyan-500/10"
                            : "border-white/10 bg-slate-800 hover:bg-slate-700/50"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleService(s.id)}
                            className="w-4 h-4 accent-cyan-500"
                          />
                          <span className="text-sm text-white">{s.name}</span>
                        </span>
                        <span className="text-sm text-slate-400">{fmtPrice(s.price)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="mb-4">
                <span className="block text-sm font-medium text-slate-300 mb-1.5">Mã khuyến mãi (tuỳ chọn)</span>
                <div className="flex gap-2">
                  <input
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase());
                      setPromo(null);
                    }}
                    placeholder="VD: WELCOME10"
                    className={`${inputCls} font-mono`}
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoChecking || !promoCode.trim()}
                    className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-white text-sm font-medium px-4 transition disabled:opacity-40"
                  >
                    <Ticket size={15} /> {promoChecking ? "..." : "Áp dụng"}
                  </button>
                </div>
                {promo && (
                  <p className={`mt-1.5 text-sm ${promo.valid ? "text-green-400" : "text-red-300"}`}>
                    {promo.valid
                      ? `✓ ${promo.name} — giảm ${fmtPrice(promo.discountAmount)} (${promo.discountPercent}%)`
                      : promo.message}
                  </p>
                )}
              </div>

              <label className="block mb-4">
                <span className="block text-sm font-medium text-slate-300 mb-1.5">
                  Thời gian (đặt trước tối đa 7 ngày)
                </span>
                <input
                  type="datetime-local"
                  value={form.scheduledTime}
                  min={toLocalInput(now)}
                  max={toLocalInput(max)}
                  onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
                  required
                  className={`${inputCls} [color-scheme:dark]`}
                />
              </label>

              <label className="block mb-4">
                <span className="block text-sm font-medium text-slate-300 mb-1.5">Ghi chú (tuỳ chọn)</span>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
              </label>

              <div className="rounded-lg bg-slate-800/60 border border-white/10 px-4 py-3 mb-5 space-y-1">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Tạm tính</span>
                  <span className={promo?.valid ? "line-through" : ""}>{fmtPrice(baseTotal)}</span>
                </div>
                {promo?.valid && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Giảm ({promo.code})</span>
                    <span>-{fmtPrice(promo.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-white pt-1 border-t border-white/5">
                  <span>Thành tiền</span>
                  <span className="text-cyan-300">{fmtPrice(finalTotal)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg border border-white/15 text-slate-300 font-medium py-2.5 hover:bg-white/5 transition"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-cyan-500 text-white font-semibold py-2.5 hover:bg-cyan-400 transition disabled:opacity-60"
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
