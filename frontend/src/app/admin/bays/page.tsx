"use client";

import { useEffect, useState } from "react";
import { Car, CheckCircle, Play, X, Clock, Settings, Plus, Trash2, Check } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import {
  getBays,
  getAdminBookings,
  assignBay,
  createBayOrder,
  completeBay,
  createBay,
  renameBay,
  deleteBay,
  type WashBay,
  type AdminBooking,
} from "@/services/adminOps";
import { getServices, fmtPrice, fmtTime, type ServiceItem } from "@/services/booking";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30";

const EMPTY_ORDER = { customerName: "", customerPhone: "", vehiclePlate: "", serviceId: "" };

export default function AdminBaysPage() {
  const [bays, setBays] = useState<WashBay[]>([]);
  const [waiting, setWaiting] = useState<AdminBooking[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [start, setStart] = useState<WashBay | null>(null);
  const [tab, setTab] = useState<"order" | "online">("order");
  const [order, setOrder] = useState(EMPTY_ORDER);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [manageOpen, setManageOpen] = useState(false);
  const [newBayName, setNewBayName] = useState("");
  const [edits, setEdits] = useState<Record<number, string>>({});

  useEffect(() => {
    reload();
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
    setOrder({ ...EMPTY_ORDER, serviceId: services[0] ? String(services[0].id) : "" });
    setStart(bay);
  }

  async function handleOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!start) return;
    setSaving(true);
    setErr("");
    try {
      await createBayOrder(start.id, {
        customerName: order.customerName,
        customerPhone: order.customerPhone || undefined,
        vehiclePlate: order.vehiclePlate,
        serviceId: Number(order.serviceId),
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
      alert(e?.response?.data?.message || "Xếp xe thất bại.");
    }
  }

  async function assignToFirstFree(booking: AdminBooking) {
    const free = bays.find((b) => b.status === "FREE");
    if (!free) {
      alert("Không còn bãi trống. Vui lòng chờ một bãi hoàn tất.");
      return;
    }
    try {
      await assignBay(free.id, booking.id);
      reload();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Xếp xe thất bại.");
    }
  }

  async function doComplete(bay: WashBay) {
    if (!confirm(`Hoàn tất rửa xe tại ${bay.name}?`)) return;
    try {
      await completeBay(bay.id);
      reload();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Thao tác thất bại.");
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
      alert(e?.response?.data?.message || "Thêm bãi thất bại.");
    }
  }

  async function handleRename(bay: WashBay) {
    const name = (edits[bay.id] ?? bay.name).trim();
    if (!name || name === bay.name) return;
    try {
      await renameBay(bay.id, name);
      reload();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Đổi tên thất bại.");
    }
  }

  async function handleDeleteBay(bay: WashBay) {
    if (!confirm(`Xoá ${bay.name}?`)) return;
    try {
      await deleteBay(bay.id);
      reload();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Xoá thất bại.");
    }
  }

  const occupied = bays.filter((b) => b.status === "OCCUPIED").length;
  const total = services.find((s) => String(s.id) === order.serviceId)?.price ?? 0;

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
                  isFree ? "border-white/10 bg-slate-900" : "border-cyan-500/30 bg-cyan-500/[0.06]"
                }`}
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
                      {bay.serviceName} · {bay.vehiclePlate}
                    </p>
                    <p className="text-sm font-semibold text-cyan-400 mt-1">{fmtPrice(bay.price)}</p>
                    <button
                      onClick={() => doComplete(bay)}
                      className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-green-500/15 text-green-300 hover:bg-green-500 hover:text-white font-medium py-2 text-sm transition"
                    >
                      <CheckCircle size={15} /> Hoàn tất
                    </button>
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
            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6"
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
                <label className="block mb-4">
                  <span className="block text-sm font-medium text-slate-300 mb-1.5">Dịch vụ</span>
                  <select
                    value={order.serviceId}
                    onChange={(e) => setOrder({ ...order, serviceId: e.target.value })}
                    required
                    className={inputCls}
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id} className="bg-slate-800">
                        {s.name} — {fmtPrice(s.price)}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Tong tien */}
                <div className="flex items-center justify-between rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-4 py-3 mb-5">
                  <span className="text-sm text-slate-300">Tổng tiền</span>
                  <span className="text-xl font-bold text-cyan-300">{fmtPrice(total)}</span>
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
