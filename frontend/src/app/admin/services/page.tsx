"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import {
  getAdminServices,
  createService,
  updateService,
  deleteService,
  type AdminService,
} from "@/services/adminServices";
import { fmtPrice } from "@/services/booking";
import { useToast } from "@/components/Toast";
import { useConfirm } from "@/components/ConfirmDialog";

const CATEGORY_LABEL: Record<string, string> = {
  WASH_PACKAGE: "Gói rửa",
  ADD_ON: "Dịch vụ thêm",
};

const inputCls =
  "w-full rounded-lg border border-white/10 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30";

const EMPTY = { name: "", category: "WASH_PACKAGE", price: "", durationMin: "", active: true };

export default function AdminServicesPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ id: number | null; data: typeof EMPTY } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    reload();
  }, []);

  function reload() {
    setLoading(true);
    getAdminServices()
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }

  function openAdd() {
    setError("");
    setModal({ id: null, data: { ...EMPTY } });
  }

  function openEdit(s: AdminService) {
    setError("");
    setModal({
      id: s.id,
      data: {
        name: s.name,
        category: s.category,
        price: String(s.price),
        durationMin: String(s.durationMin),
        active: s.active,
      },
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!modal) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: modal.data.name,
        category: modal.data.category,
        price: Number(modal.data.price),
        durationMin: Number(modal.data.durationMin),
        active: modal.data.active,
      };
      if (modal.id == null) await createService(payload);
      else await updateService(modal.id, payload);
      setModal(null);
      reload();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Lưu thất bại, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(s: AdminService) {
    if (!(await confirm({ message: `Xoá dịch vụ "${s.name}"?`, danger: true, confirmText: "Xoá" }))) return;
    try {
      await deleteService(s.id);
      reload();
    } catch (err: any) {
      toast(err?.response?.data?.message || "Xoá thất bại.");
    }
  }

  return (
    <AdminShell active="services" title="Quản lý dịch vụ">
      <div className="flex items-center justify-between mb-6">
        <p className="text-slate-400">Quản lý các gói rửa &amp; dịch vụ thêm.</p>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 text-white font-semibold px-4 py-2.5 hover:bg-cyan-400 transition"
        >
          <Plus size={18} /> Thêm dịch vụ
        </button>
      </div>

      <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="p-5 text-slate-500">Đang tải...</p>
        ) : services.length === 0 ? (
          <p className="p-5 text-slate-500">Chưa có dịch vụ nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-white/10">
                  <th className="px-5 py-3 font-medium">Tên dịch vụ</th>
                  <th className="px-3 py-3 font-medium">Loại</th>
                  <th className="px-3 py-3 font-medium">Giá</th>
                  <th className="px-3 py-3 font-medium">Thời lượng</th>
                  <th className="px-3 py-3 font-medium">Trạng thái</th>
                  <th className="px-5 py-3 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-3.5 text-white font-medium">{s.name}</td>
                    <td className="px-3 py-3.5 text-slate-400">{CATEGORY_LABEL[s.category] ?? s.category}</td>
                    <td className="px-3 py-3.5 text-cyan-400 font-semibold">{fmtPrice(s.price)}</td>
                    <td className="px-3 py-3.5 text-slate-400">{s.durationMin} phút</td>
                    <td className="px-3 py-3.5">
                      {s.active ? (
                        <span className="text-xs font-semibold rounded-full px-2.5 py-0.5 bg-green-500/15 text-green-300">
                          Đang hiển thị
                        </span>
                      ) : (
                        <span className="text-xs font-semibold rounded-full px-2.5 py-0.5 bg-slate-500/15 text-slate-400">
                          Đã ẩn
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-2 text-slate-500 hover:text-cyan-400 transition"
                          title="Sửa"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
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

      {/* Modal them / sua dich vu */}
      {modal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">
                {modal.id == null ? "Thêm dịch vụ" : "Sửa dịch vụ"}
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

              <label className="block mb-4">
                <span className="block text-sm font-medium text-slate-300 mb-1.5">Tên dịch vụ</span>
                <input
                  value={modal.data.name}
                  onChange={(e) => setModal({ ...modal, data: { ...modal.data, name: e.target.value } })}
                  required
                  placeholder="Rửa xe cơ bản"
                  className={inputCls}
                />
              </label>

              <label className="block mb-4">
                <span className="block text-sm font-medium text-slate-300 mb-1.5">Loại dịch vụ</span>
                <select
                  value={modal.data.category}
                  onChange={(e) => setModal({ ...modal, data: { ...modal.data, category: e.target.value } })}
                  className={inputCls}
                >
                  <option value="WASH_PACKAGE" className="bg-slate-800">Gói rửa</option>
                  <option value="ADD_ON" className="bg-slate-800">Dịch vụ thêm</option>
                </select>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block mb-4">
                  <span className="block text-sm font-medium text-slate-300 mb-1.5">Giá (đ)</span>
                  <input
                    type="number"
                    min="0"
                    value={modal.data.price}
                    onChange={(e) => setModal({ ...modal, data: { ...modal.data, price: e.target.value } })}
                    required
                    placeholder="30000"
                    className={inputCls}
                  />
                </label>
                <label className="block mb-4">
                  <span className="block text-sm font-medium text-slate-300 mb-1.5">Thời lượng (phút)</span>
                  <input
                    type="number"
                    min="1"
                    value={modal.data.durationMin}
                    onChange={(e) => setModal({ ...modal, data: { ...modal.data, durationMin: e.target.value } })}
                    required
                    placeholder="20"
                    className={inputCls}
                  />
                </label>
              </div>

              <label className="flex items-center gap-3 mb-5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={modal.data.active}
                  onChange={(e) => setModal({ ...modal, data: { ...modal.data, active: e.target.checked } })}
                  className="w-4 h-4 accent-cyan-500"
                />
                <span className="text-sm text-slate-300">Hiển thị cho khách hàng (đang kích hoạt)</span>
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
