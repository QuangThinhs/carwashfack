"use client";

import { useEffect, useState } from "react";
import {
  Car,
  CheckCircle,
  Play,
  X,
  Clock,
  Settings,
  Plus,
  Trash2,
  Check,
  Ticket,
  Search,
  Receipt,
} from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { useToast } from "@/components/Toast";
import { useConfirm } from "@/components/ConfirmDialog";
import {
  getBays,
  getAdminBookings,
  getAdminCustomers,
  assignBay,
  createBayOrder,
  completeBay,
  createBay,
  renameBay,
  deleteBay,
  applyAdminPromo,
  type WashBay,
  type AdminBooking,
  type AdminCustomer,
} from "@/services/adminOps";
import { getServices, fmtPrice, fmtTime, type ServiceItem } from "@/services/booking";
import { type PromoApplyResult } from "@/services/promotion";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30";

const EMPTY_ORDER = { customerName: "", customerPhone: "", vehiclePlate: "", serviceIds: [] as number[], promoCode: "" };

export default function AdminBaysPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [bays, setBays] = useState<WashBay[]>([]);
  const [waiting, setWaiting] = useState<AdminBooking[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  const [start, setStart] = useState<WashBay | null>(null);
  const [tab, setTab] = useState<"order" | "online">("order");
  const [order, setOrder] = useState(EMPTY_ORDER);
  const [custQuery, setCustQuery] = useState("");
  const [promo, setPromo] = useState<PromoApplyResult | null>(null);
  const [promoChecking, setPromoChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [detail, setDetail] = useState<WashBay | null>(null);

  const [manageOpen, setManageOpen] = useState(false);
  const [newBayName, setNewBayName] = useState("");
  const [edits, setEdits] = useState<Record<number, string>>({});

  useEffect(() => {
    reload();
    getAdminCustomers().then(setCustomers).catch(() => setCustomers([]));
  }, []);

  function reload() {
    setLoading(true);
    Promise.all([getBays(), getAdminBookings(), getServices()])
      .then(([b, bk, s]) => {
        setBays(b);
        setWaiting(bk.filter((x) => x.status === "PENDING" || x.status === "CONFIRMED"));
        setServices(s);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  function openStart(bay: WashBay) {
    setErr("");
    setTab("order");
    setPromo(null);
    setCustQuery("");
    setOrder({ ...EMPTY_ORDER, serviceIds: services[0] ? [services[0].id] : [] });
    setStart(bay);
  }

  function toggleService(id: number) {
    setOrder((o) => ({
      ...o,
      serviceIds: o.serviceIds.includes(id) ? o.serviceIds.filter((x) => x !== id) : [...o.serviceIds, id],
    }));
    setPromo(null);
  }

  function pickCustomer(c: AdminCustomer) {
    setOrder((o) => ({
      ...o,
      customerName: c.fullName,
      customerPhone: c.phone,
      vehiclePlate: c.vehicles[0]?.licensePlate ?? o.vehiclePlate,
    }));
    setCustQuery("");
  }

  async function handleApplyPromo() {
    if (!order.promoCode.trim() || order.serviceIds.length === 0) return;
    setPromoChecking(true);
    try {
      const r = await applyAdminPromo(order.promoCode.trim(), order.serviceIds);
      setPromo(r);
    } catch {
      setPromo(null);
      toast("Không kiểm tra được mã khuyến mãi.");
    } finally {
      setPromoChecking(false);
    }
  }

  async function handleOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!start) return;
    if (order.serviceIds.length === 0) {
      setErr("Vui lòng chọn ít nhất một dịch vụ.");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      await createBayOrder(start.id, {
        customerName: order.customerName,
        customerPhone: order.customerPhone || undefined,
        vehiclePlate: order.vehiclePlate,
        serviceIds: order.serviceIds,
        promoCode: promo?.valid ? order.promoCode.trim() : undefined,
      });
      setStart(null);
      reload();
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Tạo order thất bại.");
    } finally {
      setSaving(false);
    }
  }

  async function doAssign(booking: AdminBooking) {
    if (!start) return;
    try {
      await assignBay(start.id, booking.id);
      setStart(null);
      reload();
    } catch (e: any) {
      toast(e?.response?.data?.message || "Xếp xe thất bại.");
    }
  }

  async function assignToFirstFree(booking: AdminBooking) {
    const free = bays.find((b) => b.status === "FREE");
    if (!free) {
      toast("Không còn bãi trống. Vui lòng chờ một bãi hoàn tất.");
      return;
    }
    try {
      await assignBay(free.id, booking.id);
      reload();
    } catch (e: any) {
      toast(e?.response?.data?.message || "Bãi vừa bị chiếm, vui lòng thử lại.");
      reload();
    }
  }

  async function doComplete(bay: WashBay) {
    if (!(await confirm({ message: `Tính tiền & hoàn tất rửa tại ${bay.name}?`, confirmText: "Tính tiền" }))) return;
    try {
      await completeBay(bay.id);
      setDetail(null);
      toast("Đã hoàn tất.", "success");
      reload();
    } catch (e: any) {
      toast(e?.response?.data?.message || "Thao tác thất bại.");
    }
  }

  async function handleAddBay(e: React.FormEvent) {
    e.preventDefault();
    if (!newBayName.trim()) return;
    try {
      await createBay(newBayName.trim());
      setNewBayName("");
      reload();
    } catch (e: any) {
      toast(e?.response?.data?.message || "Thêm bãi thất bại.");
    }
  }

  async function handleRename(bay: WashBay) {
    const name = (edits[bay.id] ?? bay.name).trim();
    if (!name || name === bay.name) return;
    try {
      await renameBay(bay.id, name);
      setEdits((prev) => {
        const next = { ...prev };
        delete next[bay.id];
        return next;
      });
      reload();
    } catch (e: any) {
      toast(e?.response?.data?.message || "Đổi tên thất bại.");
    }
  }

  async function handleDeleteBay(bay: WashBay) {
    if (!(await confirm({ message: `Xoá ${bay.name}?`, danger: true, confirmText: "Xoá" }))) return;
    try {
      await deleteBay(bay.id);
      reload();
    } catch (e: any) {
      toast(e?.response?.data?.message || "Xoá thất bại.");
    }
  }

  const occupied = bays.filter((b) => b.status === "OCCUPIED").length;
  const baseTotal = services.filter((s) => order.serviceIds.includes(s.id)).reduce((sum, s) => sum + s.price, 0);
  const finalTotal = promo?.valid ? promo.finalPrice : baseTotal;

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
    <AdminShell active="bays" title="Quản lý bãi rửa">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <p className="text-slate-400">
          <b className="text-white">{occupied}</b>/{bays.length} bãi đang rửa ·{" "}
          <b className="text-cyan-400">{bays.length - occupied}</b> bãi trống
        </p>
        <button
          onClick={() => setManageOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 text-sm px-3 py-1.5 transition"
        >
          <Settings size={15} /> Quản lý bãi
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500">Đang tải...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {bays.map((bay) => {
            const isFree = bay.status === "FREE";
            return (
              <div
                key={bay.id}
                className={`rounded-2xl border p-4 ${
                  isFree
                    ? "border-white/10 bg-slate-900"
                    : "border-cyan-500/30 bg-cyan-500/[0.06] cursor-pointer hover:border-cyan-400/60"
                }`}
                onClick={isFree ? undefined : () => setDetail(bay)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{bay.name}</span>
                  {isFree ? (
                    <span className="text-xs font-semibold rounded-full px-2 py-0.5 bg-slate-500/15 text-slate-400">
                      Trống
                    </span>
                  ) : (
                    <span className="text-xs font-semibold rounded-full px-2 py-0.5 bg-cyan-500/15 text-cyan-300">
                      Đang rửa
                    </span>
                  )}
                </div>

                {isFree ? (
                  <div className="mt-5 flex flex-col items-center justify-center text-slate-600">
                    <Car size={28} strokeWidth={1.5} />
                    <button
                      onClick={() => openStart(bay)}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 text-white text-sm font-medium px-3 py-1.5 hover:bg-cyan-400 transition"
                    >
                      <Play size={14} /> Bắt đầu
                    </button>
                  </div>
                ) : (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-white truncate">{bay.customerName}</p>
                    <p className="text-xs text-slate-400 truncate">
                      {bay.serviceName} · {bay.vehiclePlate || "—"}
                    </p>
                    <p className="text-sm font-semibold text-cyan-400 mt-1">{fmtPrice(bay.price)}</p>
                    <p className="mt-2 text-xs text-cyan-300/80 flex items-center gap-1">
                      <Receipt size={12} /> Bấm để xem & tính tiền
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Lich dat sap toi */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} className="text-cyan-400" />
          <h2 className="font-semibold text-white">Lịch đặt sắp tới</h2>
          <span className="text-xs text-slate-500">({waiting.length})</span>
        </div>
        <div className="bg-slate-900 border border-white/10 rounded-2xl divide-y divide-white/5">
          {waiting.length === 0 ? (
            <p className="p-5 text-sm text-slate-500">Chưa có lịch đặt online nào đang chờ.</p>
          ) : (
            waiting.map((b) => (
              <div key={b.id} className="flex items-center gap-3 p-3.5">
                <div className="text-center shrink-0 w-16">
                  <p className="text-xs text-slate-500">{fmtTime(b.scheduledTime)}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">
                    {b.customerName} · <span className="text-slate-400">{b.vehiclePlate}</span>
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {b.serviceName} · {fmtPrice(b.price)}
                  </p>
                </div>
                <button
                  onClick={() => assignToFirstFree(b)}
                  className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500 hover:text-white text-xs font-medium px-3 py-1.5 transition"
                >
                  <Play size={12} /> Xếp bãi trống
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal bat dau rua tai bai */}
      {start && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setStart(null)}
        >
          <div
            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Bắt đầu rửa — {start.name}</h2>
              <button onClick={() => setStart(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-5 bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setTab("order")}
                className={`flex-1 text-sm rounded-md py-1.5 transition ${
                  tab === "order" ? "bg-cyan-500 text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                Khách vãng lai
              </button>
              <button
                onClick={() => setTab("online")}
                className={`flex-1 text-sm rounded-md py-1.5 transition ${
                  tab === "online" ? "bg-cyan-500 text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                Xe đặt online ({waiting.length})
              </button>
            </div>

            {tab === "order" ? (
              <form onSubmit={handleOrder}>
                {err && (
                  <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">
                    {err}
                  </div>
                )}

                {/* Tim khach da dang ky */}
                <div className="mb-4">
                  <span className="block text-sm font-medium text-slate-300 mb-1.5">
                    Tìm khách đã đăng ký (tuỳ chọn)
                  </span>
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      value={custQuery}
                      onChange={(e) => setCustQuery(e.target.value)}
                      placeholder="SĐT / biển số / email / tên"
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
                </div>

                <label className="block mb-4">
                  <span className="block text-sm font-medium text-slate-300 mb-1.5">Tên khách</span>
                  <input
                    value={order.customerName}
                    onChange={(e) => setOrder({ ...order, customerName: e.target.value })}
                    required
                    placeholder="Nguyễn Văn A"
                    className={inputCls}
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block mb-4">
                    <span className="block text-sm font-medium text-slate-300 mb-1.5">SĐT (tuỳ chọn)</span>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={order.customerPhone}
                      onChange={(e) => setOrder({ ...order, customerPhone: e.target.value })}
                      placeholder="09xxxxxxxx"
                      className={inputCls}
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="block text-sm font-medium text-slate-300 mb-1.5">Biển số xe</span>
                    <input
                      value={order.vehiclePlate}
                      onChange={(e) => setOrder({ ...order, vehiclePlate: e.target.value })}
                      required
                      placeholder="59A1-234.56"
                      className={inputCls}
                    />
                  </label>
                </div>

                {/* Dich vu (nhieu) */}
                <div className="mb-4">
                  <span className="block text-sm font-medium text-slate-300 mb-1.5">Dịch vụ (chọn 1 hoặc nhiều)</span>
                  <div className="space-y-1.5">
                    {services.map((s) => {
                      const checked = order.serviceIds.includes(s.id);
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

                {/* Ma khuyen mai */}
                <div className="mb-4">
                  <span className="block text-sm font-medium text-slate-300 mb-1.5">Mã khuyến mãi (tuỳ chọn)</span>
                  <div className="flex gap-2">
                    <input
                      value={order.promoCode}
                      onChange={(e) => {
                        setOrder({ ...order, promoCode: e.target.value.toUpperCase() });
                        setPromo(null);
                      }}
                      placeholder="VD: WELCOME10"
                      className={`${inputCls} font-mono`}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={promoChecking || !order.promoCode.trim()}
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
                  {saving ? "Đang xử lý..." : "Bắt đầu rửa"}
                </button>
              </form>
            ) : waiting.length === 0 ? (
              <p className="text-slate-500 py-6 text-center">Không có xe đặt online nào đang chờ.</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {waiting.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => doAssign(b)}
                    className="w-full text-left bg-slate-800 hover:bg-slate-700 rounded-lg p-3 transition"
                  >
                    <p className="font-medium text-white">
                      {b.customerName} · {b.vehiclePlate}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      {b.serviceName} · <Clock size={11} /> {fmtTime(b.scheduledTime)} · {fmtPrice(b.price)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal chi tiet bai + tinh tien */}
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
              <h2 className="text-lg font-bold text-white">{detail.name} — Chi tiết</h2>
              <button onClick={() => setDetail(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Khách hàng</span>
                <span className="text-white font-medium text-right">{detail.customerName || "—"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Số điện thoại</span>
                <span className="text-slate-200 text-right">{detail.customerPhone || "—"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Biển số xe</span>
                <span className="text-slate-200 text-right">{detail.vehiclePlate || "—"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Bắt đầu</span>
                <span className="text-slate-200 text-right">
                  {detail.scheduledTime ? fmtTime(detail.scheduledTime) : "—"}
                </span>
              </div>
            </div>

            {/* Hoa don */}
            <div className="mt-4 rounded-lg bg-slate-800/60 border border-white/10 px-4 py-3">
              <p className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                <Receipt size={13} /> Dịch vụ
              </p>
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

            <button
              onClick={() => doComplete(detail)}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 text-white font-semibold py-2.5 hover:bg-green-400 transition"
            >
              <CheckCircle size={17} /> Tính tiền & hoàn tất
            </button>
          </div>
        </div>
      )}

      {/* Modal quan ly bai */}
      {manageOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setManageOpen(false)}
        >
          <div
            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Quản lý bãi rửa</h2>
              <button onClick={() => setManageOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddBay} className="flex gap-2 mb-4">
              <input
                value={newBayName}
                onChange={(e) => setNewBayName(e.target.value)}
                placeholder="Tên bãi mới (vd: Bãi 11)"
                className={inputCls}
              />
              <button
                type="submit"
                className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-cyan-500 text-white text-sm font-medium px-3 hover:bg-cyan-400 transition"
              >
                <Plus size={16} /> Thêm
              </button>
            </form>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {bays.map((bay) => {
                const busy = bay.status === "OCCUPIED";
                return (
                  <div key={bay.id} className="flex items-center gap-2 bg-slate-800 rounded-lg p-2">
                    <input
                      value={edits[bay.id] ?? bay.name}
                      onChange={(e) => setEdits({ ...edits, [bay.id]: e.target.value })}
                      className="flex-1 min-w-0 rounded-md border border-white/10 bg-slate-900 px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={() => handleRename(bay)}
                      title="Lưu tên"
                      className="shrink-0 p-1.5 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-white/5"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteBay(bay)}
                      disabled={busy}
                      title={busy ? "Bãi đang có xe" : "Xoá bãi"}
                      className="shrink-0 p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-white/5 disabled:opacity-30 disabled:hover:text-slate-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 mt-3">Chỉ xoá được bãi đang trống.</p>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
