"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, Bike, X } from "lucide-react";
import { getUser, type AuthUser } from "@/lib/auth";
import {
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  type Vehicle,
} from "@/services/vehicle";
import CustomerTopbar from "@/components/CustomerTopbar";
import Field from "@/components/Field";

const EMPTY = { licensePlate: "", type: "", brand: "" };

export default function VehiclesPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ id: number | null; data: typeof EMPTY } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
    reload();
  }, [router]);

  function reload() {
    setLoading(true);
    getVehicles()
      .then(setVehicles)
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  }

  function openAdd() {
    setError("");
    setModal({ id: null, data: { ...EMPTY } });
  }

  function openEdit(v: Vehicle) {
    setError("");
    setModal({ id: v.id, data: { licensePlate: v.licensePlate, type: v.type ?? "", brand: v.brand ?? "" } });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!modal) return;
    setSaving(true);
    setError("");
    try {
      if (modal.id == null) await addVehicle(modal.data);
      else await updateVehicle(modal.id, modal.data);
      setModal(null);
      reload();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Lưu thất bại, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(v: Vehicle) {
    if (!confirm(`Xoá xe "${v.licensePlate}"?`)) return;
    try {
      await deleteVehicle(v.id);
      reload();
    } catch {
      alert("Xoá thất bại, vui lòng thử lại.");
    }
  }

  if (!user) return null;

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
            <h1 className="text-2xl font-bold text-slate-800">Xe của tôi</h1>
            <p className="text-slate-500 mt-1">Quản lý danh sách xe máy của bạn.</p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-semibold px-4 py-2.5 hover:opacity-95 transition"
          >
            <Plus size={18} /> Thêm xe
          </button>
        </div>

        {loading ? (
          <p className="text-slate-400">Đang tải...</p>
        ) : vehicles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <Bike size={40} strokeWidth={1.5} className="mx-auto text-slate-300" />
            <p className="mt-3 text-slate-500">Bạn chưa có xe nào.</p>
            <button
              onClick={openAdd}
              className="mt-4 inline-flex items-center gap-2 text-cyan-600 font-medium hover:underline"
            >
              <Plus size={16} /> Thêm xe đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start justify-between"
              >
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                    <Bike size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-lg">{v.licensePlate}</p>
                    <p className="text-sm text-slate-500">
                      {[v.brand, v.type].filter(Boolean).join(" · ") || "Chưa có thông tin"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(v)}
                    className="p-2 text-slate-400 hover:text-cyan-600 transition"
                    title="Sửa"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(v)}
                    className="p-2 text-slate-400 hover:text-red-500 transition"
                    title="Xoá"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal them / sua xe */}
      {modal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">
                {modal.id == null ? "Thêm xe" : "Sửa xe"}
              </h2>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
                  {error}
                </div>
              )}
              <Field
                label="Biển số xe"
                placeholder="59A1-234.56"
                value={modal.data.licensePlate}
                onChange={(e) => setModal({ ...modal, data: { ...modal.data, licensePlate: e.target.value } })}
                required
              />
              <Field
                label="Hãng xe (tuỳ chọn)"
                placeholder="Honda, Yamaha..."
                value={modal.data.brand}
                onChange={(e) => setModal({ ...modal, data: { ...modal.data, brand: e.target.value } })}
              />
              <Field
                label="Loại / dòng xe (tuỳ chọn)"
                placeholder="Wave, Vision, SH..."
                value={modal.data.type}
                onChange={(e) => setModal({ ...modal, data: { ...modal.data, type: e.target.value } })}
              />
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="flex-1 rounded-lg border border-slate-300 text-slate-600 font-medium py-2.5 hover:bg-slate-50 transition"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-semibold py-2.5 hover:opacity-95 transition disabled:opacity-60"
                >
                  {saving ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
