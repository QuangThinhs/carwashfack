"use client";

import { useEffect, useState } from "react";
import { Eye, X, Plus, Search, Ticket } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import {
  getAdminBookings,
  confirmBooking,
  cancelBookingAdmin,
  getAdminCustomers,
  createAdminBooking,
  previewAdminBookingPromo,
  type AdminBooking,
  type AdminCustomer,
} from "@/services/adminOps";
import { getServices, BOOKING_STATUS, fmtPrice, fmtTime, type ServiceItem } from "@/services/booking";
import { type PromoApplyResult } from "@/services/promotion";
import { useToast } from "@/components/Toast";
import { useConfirm } from "@/components/ConfirmDialog";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30";

const filters = [
  { key: "ALL", label: "Tất cả" },
  { key: "PENDING", label: "Chờ xác nhận" },
  { key: "CONFIRMED", label: "Đã xác nhận" },
  { key: "IN_PROGRESS", label: "Đang rửa" },
];

const EMPTY_CREATE = {
  customerId: 0,
  vehicleId: 0,
  serviceIds: [] as number[],
  scheduledTime: "",
  note: "",
  promoCode: "",
};

function toLocalInput(d: Date) {
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function StatusBadge({ status }: { status: string }) {
  const st = BOOKING_STATUS[status] ?? { label: status, cls: "bg-slate-500/15 text-slate-400" };
  return <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${st.cls}`}>{st.label}</span>;
}

export default function AdminBookingsPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [detail, setDetail] = useState<AdminBooking | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_CREATE);
  const [custQuery, setCustQuery] = useState("");
  const [promo, setPromo] = useState<PromoApplyResult | null>(null);
  const [promoChecking, setPromoChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    reload();
    getAdminCustomers().then(setCustomers).catch(() => setCustomers([]));
    getServices().then(setServices).catch(() => setServices([]));
  }, []);

  function reload() {
    setLoading(true);
    getAdminBookings()
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }

  async function doConfirm(b: AdminBooking) {
    try {
      await confirmBooking(b.id);
      reload();
    } catch (e: any) {
      toast(e?.response?.data?.message || "Thao tác thất bại.");
    }
  }

  async function doCancel(b: AdminBooking) {
    if (!(await confirm({ message: "Huỷ lịch đặt này?", danger: true, confirmText: "Huỷ lịch" }))) return;
    try {
      await cancelBookingAdmin(b.id);
      reload();
    } catch (e: any) {
      toast(e?.response?.data?.message || "Huỷ thất bại.");
    }
  }

  function openCreate() {
    setErr("");
    setCustQuery("");
    setPromo(null);
    setForm({ ...EMPTY_CREATE, serviceIds: services[0] ? [services[0].id] : [] });
    setCreateOpen(true);
  }

  function pickCustomer(c: AdminCustomer) {
    setForm((f) => ({ ...f, customerId: c.id, vehicleId: c.vehicles[0]?.id ?? 0 }));
    setCustQuery("");
    setPromo(null);
  }

  function toggleService(id: number) {
    setForm((f) => ({
      ...f,
      serviceIds: f.serviceIds.includes(id) ? f.serviceIds.filter((x) => x !== id) : [...f.serviceIds, id],
    }));
    setPromo(null);
  }

  async function handleApplyPromo() {
    if (!form.promoCode.trim() || !form.customerId || form.serviceIds.length === 0) return;
    setPromoChecking(true);
    try {
      const r = await previewAdminBookingPromo(form.customerId, form.promoCode.trim(), form.serviceIds);
      setPromo(r);
    } catch {
      setPromo(null);
      toast("Không kiểm tra được mã khuyến mãi.");
    } finally {
      setPromoChecking(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerId) {
      setErr("Vui lòng chọn khách hàng.");
      return;
    }
    if (!form.vehicleId) {
      setErr("Khách này chưa có xe.");
      return;
    }
    if (form.serviceIds.length === 0) {
      setErr("Vui lòng chọn ít nhất một dịch vụ.");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      await createAdminBooking({
        customerId: form.customerId,
        vehicleId: form.vehicleId,
        serviceIds: form.serviceIds,
        scheduledTime: form.scheduledTime,
        note: form.note || undefined,
        promoCode: promo?.valid ? form.promoCode.trim() : undefined,
      });
      setCreateOpen(false);
      reload();
      toast("Đã tạo lịch đặt.", "success");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Tạo lịch thất bại.");
    } finally {
      setSaving(false);
    }
  }

  const shown = filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);
  const selectedCustomer = customers.find((c) => c.id === form.customerId);
  const vehicles = selectedCustomer?.vehicles ?? [];
  const baseTotal = services.filter((s) => form.serviceIds.includes(s.id)).reduce((sum, s) => sum + s.price, 0);
  const finalTotal = promo?.valid ? promo.finalPrice : baseTotal;
  const now = new Date();

  const q = custQuery.trim().toLowerCase();
  const custMatches = q
    ? customers
        .filter((c) => {
          const hay = [c.fullName, c.phone, c.email ?? "", ...c.vehicles.map((v) => v.licensePlate)]
            .join(" ")
            .toLowerCase();
          return hay.includes(q);
        })
        .slice(0, 6)
    : [];

  return (
    <AdminShell active="bookings" title="Quản lý lịch đặt">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-sm rounded-full px-3.5 py-1.5 transition ${
                filter === f.key
                  ? "bg-cyan-500 text-white"
                  : "bg-slate-900 border border-white/10 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 text-white font-semibold px-4 py-2 hover:bg-cyan-400 transition"
        >
          <Plus size={18} /> Tạo lịch
        </button>
      </div>

      <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="p-5 text-slate-500">Đang tải...</p>
        ) : shown.length === 0 ? (
          <p className="p-5 text-slate-500">Không có đơn hàng nào đang hoạt động.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-white/10">
                  <th className="px-5 py-3 font-medium">Khách hàng</th>
                  <th className="px-3 py-3 font-medium">Dịch vụ</th>
                  <th className="px-3 py-3 font-medium">Thời gian</th>
                  <th className="px-3 py-3 font-medium">Giá</th>
                  <th className="px-3 py-3 font-medium">Trạng thái</th>
                  <th className="px-5 py-3 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((b) => (
                  <tr key={b.id} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-3.5">
                      <p className="text-white font-medium flex items-center gap-1.5">
                        {b.customerName}
                        {b.walkIn && (
                          <span className="text-[10px] bg-amber-500/15 text-amber-300 rounded px-1.5 py-0.5">
                            Vãng lai
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">{b.vehiclePlate}</p>
                    </td>
                    <td className="px-3 py-3.5 text-slate-300">{b.serviceName}</td>
                    <td className="px-3 py-3.5 text-slate-400">{fmtTime(b.scheduledTime)}</td>
                    <td className="px-3 py-3.5 text-cyan-400 font-semibold">{fmtPrice(b.price)}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex gap-3 justify-end items-center">
                        {b.status === "PENDING" && (
                          <button onClick={() => doConfirm(b)} className="text-xs text-blue-300 hover:underline">
                            Xác nhận
                          </button>
                        )}
                        {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                          <button onClick={() => doCancel(b)} className="text-xs text-red-400 hover:underline">
                            Huỷ
                          </button>
                        )}
                        <button
                          onClick={() => setDetail(b)}
                          className="text-slate-500 hover:text-cyan-400 transition"
                          title="Chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500 mt-3">
        Đây là các đơn <b className="text-slate-400">đang chờ / đang rửa</b>. Đơn đã hoàn tất hoặc huỷ xem ở{" "}
        <b className="text-slate-400">Lịch sử đơn hàng</b>. Để xếp xe vào bãi, vào mục{" "}
        <b className="text-slate-400">Bãi rửa</b>.
      </p>

      {/* Modal chi tiet lich dat */}
      {detail && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setDetail(null)}
        >
          <div
            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Chi tiết lịch đặt #{detail.id}</h2>
              <button onClick={() => setDetail(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <Row label="Khách hàng">
                <span className="text-white font-medium">{detail.customerName}</span>
                {detail.walkIn && (
                  <span className="ml-2 text-[10px] bg-amber-500/15 text-amber-300 rounded px-1.5 py-0.5">
                    Khách vãng lai
                  </span>
                )}
              </Row>
              <Row label="Số điện thoại">{detail.customerPhone || "—"}</Row>
              <Row label="Biển số xe">{detail.vehiclePlate || "—"}</Row>
              <Row label="Thông tin xe">{detail.vehicleInfo || "—"}</Row>
              <Row label="Thời gian">{fmtTime(detail.scheduledTime)}</Row>
              <Row label="Trạng thái">
                <StatusBadge status={detail.status} />
              </Row>
              <Row label="Ghi chú">{detail.note || "—"}</Row>
            </div>

            <div className="mt-3 rounded-lg bg-slate-800/60 border border-white/10 px-4 py-3">
              <p className="text-xs font-medium text-slate-400 mb-2">Dịch vụ</p>
              <div className="space-y-1.5">
                {(detail.services ?? []).map((s, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-200">{s.name}</span>
                    <span className="text-slate-400">{fmtPrice(s.price)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-white/5 space-y-1">
                {detail.originalPrice != null && detail.originalPrice > detail.price && (
                  <>
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Tạm tính</span>
                      <span className="line-through">{fmtPrice(detail.originalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Giảm{detail.promoCode ? ` (${detail.promoCode})` : ""}</span>
                      <span>-{fmtPrice(detail.originalPrice - detail.price)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between font-bold text-white">
                  <span>Tổng tiền</span>
                  <span className="text-cyan-300">{fmtPrice(detail.price)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal tao lich cho khach */}
      {createOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setCreateOpen(false)}
        >
          <div
            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Tạo lịch cho khách</h2>
              <button onClick={() => setCreateOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              {err && (
                <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">
                  {err}
                </div>
              )}

              {/* Chon khach */}
              <div className="mb-4">
                <span className="block text-sm font-medium text-slate-300 mb-1.5">Khách hàng</span>
                {selectedCustomer ? (
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{selectedCustomer.fullName}</p>
                      <p className="text-xs text-slate-400 truncate">{selectedCustomer.phone}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, customerId: 0, vehicleId: 0 }))}
                      className="text-slate-400 hover:text-white shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        value={custQuery}
                        onChange={(e) => setCustQuery(e.target.value)}
                        placeholder="Tìm theo SĐT / biển số / email / tên"
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                    {custMatches.length > 0 && (
                      <div className="mt-1 border border-white/10 rounded-lg bg-slate-800 divide-y divide-white/5 overflow-hidden">
                        {custMatches.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => pickCustomer(c)}
                            className="w-full text-left px-3 py-2 hover:bg-slate-700 transition"
                          >
                            <p className="text-sm text-white">
                              {c.fullName} · <span className="text-slate-400">{c.phone}</span>
                            </p>
                            <p className="text-xs text-slate-500">
                              {c.email || "—"}
                              {c.vehicles.length > 0 ? ` · ${c.vehicles.map((v) => v.licensePlate).join(", ")}` : ""}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                    {q && custMatches.length === 0 && (
                      <p className="text-xs text-slate-500 mt-1">Không tìm thấy khách phù hợp.</p>
                    )}
                  </>
                )}
              </div>

              {/* Xe */}
              {selectedCustomer && (
                <label className="block mb-4">
                  <span className="block text-sm font-medium text-slate-300 mb-1.5">Xe</span>
                  {vehicles.length === 0 ? (
                    <p className="text-sm text-amber-300">Khách này chưa có xe.</p>
                  ) : (
                    <select
                      value={form.vehicleId}
                      onChange={(e) => setForm({ ...form, vehicleId: Number(e.target.value) })}
                      className={inputCls}
                    >
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id} className="bg-slate-800">
                          {v.licensePlate}
                          {v.brand ? ` · ${v.brand}` : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </label>
              )}

              {/* Dich vu */}
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

              {/* Thoi gian */}
              <label className="block mb-4">
                <span className="block text-sm font-medium text-slate-300 mb-1.5">Thời gian</span>
                <input
                  type="datetime-local"
                  value={form.scheduledTime}
                  min={toLocalInput(now)}
                  onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
                  required
                  className={`${inputCls} [color-scheme:dark]`}
                />
              </label>

              {/* Ma khuyen mai */}
              <div className="mb-4">
                <span className="block text-sm font-medium text-slate-300 mb-1.5">Mã khuyến mãi (tuỳ chọn)</span>
                <div className="flex gap-2">
                  <input
                    value={form.promoCode}
                    onChange={(e) => {
                      setForm({ ...form, promoCode: e.target.value.toUpperCase() });
                      setPromo(null);
                    }}
                    placeholder="VD: WELCOME10"
                    className={`${inputCls} font-mono`}
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoChecking || !form.promoCode.trim() || !form.customerId}
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

              {/* Ghi chu */}
              <label className="block mb-4">
                <span className="block text-sm font-medium text-slate-300 mb-1.5">Ghi chú (tuỳ chọn)</span>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
              </label>

              {/* Tong tien */}
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
                  <span>Tổng tiền</span>
                  <span className="text-cyan-300">{fmtPrice(finalTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-cyan-500 text-white font-semibold py-2.5 hover:bg-cyan-400 transition disabled:opacity-60"
              >
                {saving ? "Đang tạo..." : "Tạo lịch đặt"}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400 shrink-0">{label}</span>
      <span className="text-right text-slate-200">{children}</span>
    </div>
  );
}
