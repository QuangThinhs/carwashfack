"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import {
  getAdminPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  type AdminPromotion,
  type PromoTargetCustomer,
} from "@/services/adminPromotions";
import { getAdminCustomers, type AdminCustomer } from "@/services/adminOps";
import { useToast } from "@/components/Toast";
import { useConfirm } from "@/components/ConfirmDialog";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30";

const TARGET_OPTIONS = [
  { value: "ALL", label: "Tất cả khách hàng" },
  { value: "TIER", label: "Theo hạng thành viên" },
  { value: "USER", label: "Khách hàng cụ thể" },
];

const TIER_OPTIONS = [
  { value: "MEMBER", label: "Member trở lên" },
  { value: "SILVER", label: "Silver trở lên" },
  { value: "GOLD", label: "Gold trở lên" },
  { value: "PLATINUM", label: "Platinum" },
];

const TIER_LABEL: Record<string, string> = {
  MEMBER: "Member+",
  SILVER: "Silver+",
  GOLD: "Gold+",
  PLATINUM: "Platinum+",
};

const EMPTY = {
  code: "",
  name: "",
  description: "",
  discountPercent: "",
  targetType: "ALL",
  minTier: "SILVER",
  usageLimit: "",
  startDate: "",
  endDate: "",
  active: true,
};

type ModalState = { id: number | null; data: typeof EMPTY; targets: PromoTargetCustomer[] };

function targetText(p: AdminPromotion) {
  if (p.targetType === "TIER") return p.minTier ? TIER_LABEL[p.minTier] ?? p.minTier : "Theo hạng";
  if (p.targetType === "USER") return `${p.targetCustomers.length} khách`;
  return "Mọi khách";
}

export default function AdminPromotionsPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [promos, setPromos] = useState<AdminPromotion[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [custQuery, setCustQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    reload();
    getAdminCustomers().then(setCustomers).catch(() => setCustomers([]));
  }, []);

  function reload() {
    setLoading(true);
    getAdminPromotions()
      .then(setPromos)
      .catch(() => setPromos([]))
      .finally(() => setLoading(false));
  }

  function openAdd() {
    setError("");
    setCustQuery("");
    setModal({ id: null, data: { ...EMPTY }, targets: [] });
  }

  function openEdit(p: AdminPromotion) {
    setError("");
    setCustQuery("");
    setModal({
      id: p.id,
      data: {
        code: p.code,
        name: p.name,
        description: p.description ?? "",
        discountPercent: String(p.discountPercent),
        targetType: p.targetType || "ALL",
        minTier: p.minTier ?? "SILVER",
        usageLimit: p.usageLimit != null ? String(p.usageLimit) : "",
        startDate: p.startDate,
        endDate: p.endDate,
        active: p.active,
      },
      targets: [...p.targetCustomers],
    });
  }

  function setData(patch: Partial<typeof EMPTY>) {
    if (!modal) return;
    setModal({ ...modal, data: { ...modal.data, ...patch } });
  }

  function addTarget(c: AdminCustomer) {
    if (!modal) return;
    if (modal.targets.some((t) => t.id === c.id)) return;
    setModal({ ...modal, targets: [...modal.targets, { id: c.id, fullName: c.fullName, phone: c.phone }] });
    setCustQuery("");
  }

  function removeTarget(id: number) {
    if (!modal) return;
    setModal({ ...modal, targets: modal.targets.filter((t) => t.id !== id) });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!modal) return;
    setSaving(true);
    setError("");
    try {
      const d = modal.data;
      const payload = {
        code: d.code,
        name: d.name,
        description: d.description || undefined,
        discountPercent: Number(d.discountPercent),
        targetType: d.targetType,
        minTier: d.targetType === "TIER" ? d.minTier || undefined : undefined,
        targetCustomerIds: d.targetType === "USER" ? modal.targets.map((t) => t.id) : undefined,
        usageLimit: d.usageLimit ? Number(d.usageLimit) : null,
        startDate: d.startDate,
        endDate: d.endDate,
        active: d.active,
      };
      if (d.targetType === "USER" && modal.targets.length === 0) {
        setError("Vui lòng chọn ít nhất một khách hàng.");
        setSaving(false);
        return;
      }
      if (modal.id == null) await createPromotion(payload);
      else await updatePromotion(modal.id, payload);
      setModal(null);
      reload();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Lưu thất bại, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: AdminPromotion) {
    if (!(await confirm({ message: `Xoá khuyến mãi "${p.name}"?`, danger: true, confirmText: "Xoá" }))) return;
    try {
      await deletePromotion(p.id);
      reload();
    } catch (err: any) {
      toast(err?.response?.data?.message || "Xoá thất bại.");
    }
  }

  const q = custQuery.trim().toLowerCase();
  const matches =
    modal && q
      ? customers
          .filter((c) => !modal.targets.some((t) => t.id === c.id))
          .filter((c) => {
            const hay = [c.fullName, c.phone, c.email ?? "", ...c.vehicles.map((v) => v.licensePlate)]
              .join(" ")
              .toLowerCase();
            return hay.includes(q);
          })
          .slice(0, 6)
      : [];

  return (
    <AdminShell active="promotions" title="Quản lý khuyến mãi">
      <div className="flex items-center justify-between mb-6">
        <p className="text-slate-400">Tạo &amp; quản lý khuyến mãi theo hạng hoặc khách hàng cụ thể.</p>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 text-white font-semibold px-4 py-2.5 hover:bg-cyan-400 transition"
        >
          <Plus size={18} /> Thêm khuyến mãi
        </button>
      </div>

      <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="p-5 text-slate-500">Đang tải...</p>
        ) : promos.length === 0 ? (
          <p className="p-5 text-slate-500">Chưa có khuyến mãi nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-white/10">
                  <th className="px-5 py-3 font-medium">Mã</th>
                  <th className="px-3 py-3 font-medium">Tên</th>
                  <th className="px-3 py-3 font-medium">Giảm</th>
                  <th className="px-3 py-3 font-medium">Đối tượng</th>
                  <th className="px-3 py-3 font-medium">Lượt</th>
                  <th className="px-3 py-3 font-medium">Trạng thái</th>
                  <th className="px-5 py-3 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {promos.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-slate-300">
                        {p.code}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <p className="text-white font-medium">{p.name}</p>
                      {p.description && (
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{p.description}</p>
                      )}
                    </td>
                    <td className="px-3 py-3.5 text-cyan-400 font-semibold">-{p.discountPercent}%</td>
                    <td className="px-3 py-3.5 text-slate-400">{targetText(p)}</td>
                    <td className="px-3 py-3.5 text-slate-400">
                      {p.usageCount}
                      {p.usageLimit != null ? `/${p.usageLimit}` : ""}
                    </td>
                    <td className="px-3 py-3.5">
                      {p.active ? (
                        <span className="text-xs font-semibold rounded-full px-2.5 py-0.5 bg-green-500/15 text-green-300">
                          Đang chạy
                        </span>
                      ) : (
                        <span className="text-xs font-semibold rounded-full px-2.5 py-0.5 bg-slate-500/15 text-slate-400">
                          Đã tắt
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 text-slate-500 hover:text-cyan-400 transition"
                          title="Sửa"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="p-2 text-slate-500 hover:text-red-400 transition"
                          title="Xoá"
                        >
                          <Trash2 size={16} />
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

      {/* Modal them / sua khuyen mai */}
      {modal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">
                {modal.id == null ? "Thêm khuyến mãi" : "Sửa khuyến mãi"}
              </h2>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <label className="block mb-4">
                  <span className="block text-sm font-medium text-slate-300 mb-1.5">Mã</span>
                  <input
                    value={modal.data.code}
                    onChange={(e) => setData({ code: e.target.value.toUpperCase() })}
                    required
                    placeholder="WELCOME10"
                    className={inputCls}
                  />
                </label>
                <label className="block mb-4">
                  <span className="block text-sm font-medium text-slate-300 mb-1.5">Giảm (%)</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={modal.data.discountPercent}
                    onChange={(e) => setData({ discountPercent: e.target.value })}
                    required
                    placeholder="10"
                    className={inputCls}
                  />
                </label>
              </div>

              <label className="block mb-4">
                <span className="block text-sm font-medium text-slate-300 mb-1.5">Tên khuyến mãi</span>
                <input
                  value={modal.data.name}
                  onChange={(e) => setData({ name: e.target.value })}
                  required
                  placeholder="Chào mừng thành viên mới"
                  className={inputCls}
                />
              </label>

              <label className="block mb-4">
                <span className="block text-sm font-medium text-slate-300 mb-1.5">Mô tả</span>
                <textarea
                  value={modal.data.description}
                  onChange={(e) => setData({ description: e.target.value })}
                  rows={2}
                  placeholder="Giảm 10% cho lần rửa đầu tiên."
                  className={`${inputCls} resize-none`}
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block mb-4">
                  <span className="block text-sm font-medium text-slate-300 mb-1.5">Đối tượng áp dụng</span>
                  <select
                    value={modal.data.targetType}
                    onChange={(e) => {
                      const v = e.target.value;
                      setModal((m) =>
                        m ? { ...m, data: { ...m.data, targetType: v }, targets: v === "USER" ? m.targets : [] } : m,
                      );
                    }}
                    className={inputCls}
                  >
                    {TARGET_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value} className="bg-slate-800">
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block mb-4">
                  <span className="block text-sm font-medium text-slate-300 mb-1.5">Giới hạn lượt</span>
                  <input
                    type="number"
                    min="1"
                    value={modal.data.usageLimit}
                    onChange={(e) => setData({ usageLimit: e.target.value })}
                    placeholder="Trống = không giới hạn"
                    className={inputCls}
                  />
                </label>
              </div>

              {modal.data.targetType === "TIER" && (
                <label className="block mb-4">
                  <span className="block text-sm font-medium text-slate-300 mb-1.5">Hạng áp dụng</span>
                  <select
                    value={modal.data.minTier}
                    onChange={(e) => setData({ minTier: e.target.value })}
                    className={inputCls}
                  >
                    {TIER_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value} className="bg-slate-800">
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {modal.data.targetType === "USER" && (
                <div className="mb-4">
                  <span className="block text-sm font-medium text-slate-300 mb-1.5">Khách hàng áp dụng</span>
                  {modal.targets.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {modal.targets.map((t) => (
                        <span
                          key={t.id}
                          className="inline-flex items-center gap-1 text-xs bg-cyan-500/15 text-cyan-200 rounded-full pl-2.5 pr-1 py-1"
                        >
                          {t.fullName} · {t.phone}
                          <button
                            type="button"
                            onClick={() => removeTarget(t.id)}
                            className="hover:text-white"
                          >
                            <X size={13} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      value={custQuery}
                      onChange={(e) => setCustQuery(e.target.value)}
                      placeholder="Tìm theo tên / SĐT / biển số / email"
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                  {matches.length > 0 && (
                    <div className="mt-1 border border-white/10 rounded-lg bg-slate-800 divide-y divide-white/5 overflow-hidden">
                      {matches.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => addTarget(c)}
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
                  {q && matches.length === 0 && (
                    <p className="text-xs text-slate-500 mt-1">Không tìm thấy khách phù hợp.</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <label className="block mb-4">
                  <span className="block text-sm font-medium text-slate-300 mb-1.5">Từ ngày</span>
                  <input
                    type="date"
                    value={modal.data.startDate}
                    onChange={(e) => setData({ startDate: e.target.value })}
                    required
                    className={`${inputCls} [color-scheme:dark]`}
                  />
                </label>
                <label className="block mb-4">
                  <span className="block text-sm font-medium text-slate-300 mb-1.5">Đến ngày</span>
                  <input
                    type="date"
                    value={modal.data.endDate}
                    onChange={(e) => setData({ endDate: e.target.value })}
                    required
                    className={`${inputCls} [color-scheme:dark]`}
                  />
                </label>
              </div>

              <label className="flex items-center gap-3 mb-5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={modal.data.active}
                  onChange={(e) => setData({ active: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500"
                />
                <span className="text-sm text-slate-300">Đang chạy (hiển thị cho khách hàng)</span>
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="flex-1 rounded-lg border border-white/15 text-slate-300 font-medium py-2.5 hover:bg-white/5 transition"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-cyan-500 text-white font-semibold py-2.5 hover:bg-cyan-400 transition disabled:opacity-60"
                >
                  {saving ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
