"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, Bike, Car, X } from "lucide-react";
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
import { useToast } from "@/components/Toast";
import { useConfirm } from "@/components/ConfirmDialog";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30";

const MOTO_BRANDS = ["Honda", "Yamaha", "Suzuki", "Piaggio", "SYM", "Vespa", "VinFast"];
const CAR_BRANDS = ["Toyota", "Honda", "Mazda", "Hyundai", "Kia", "Ford", "Mitsubishi", "Mercedes-Benz", "BMW", "VinFast"];
const MOTO_MODELS = ["Wave", "Vision", "Air Blade", "SH", "Lead", "Exciter", "Sirius", "Winner", "Grande", "Vario"];
const CAR_MODELS = ["Vios", "City", "CX-5", "Accent", "Morning", "Ranger", "Camry", "Civic", "Xpander", "Santa Fe"];

const EMPTY = { licensePlate: "", category: "Xe máy", brand: "", type: "" };

export default function VehiclesPage() {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
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
    setModal({
      id: v.id,
      data: {
        licensePlate: v.licensePlate,
        category: v.category ?? "Xe máy",
        brand: v.brand ?? "",
        type: v.type ?? "",
      },
    });
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
    if (!(await confirm({ message: `Xoá xe "${v.licensePlate}"?`, danger: true, confirmText: "Xoá" }))) return;
    try {
      await deleteVehicle(v.id);
      reload();
    } catch {
      toast("Xoá thất bại, vui lòng thử lại.");
    }
  }

  if (!user) return null;

  const isCar = modal?.data.category === "Ô tô";
  const brandList = isCar ? CAR_BRANDS : MOTO_BRANDS;
  const modelList = isCar ? CAR_MODELS : MOTO_MODELS;

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
            <h1 className="text-2xl font-bold text-white">Xe của tôi</h1>
            <p className="text-slate-400 mt-1">Quản lý danh sách xe của bạn.</p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 text-white font-semibold px-4 py-2.5 hover:bg-cyan-400 transition"
          >
            <Plus size={18} /> Thêm xe
          </button>
        </div>

        {loading ? (
          <p className="text-slate-500">Đang tải...</p>
        ) : vehicles.length === 0 ? (
          <div className="bg-slate-900/50 rounded-2xl border border-dashed border-white/15 p-12 text-center">
            <Bike size={40} strokeWidth={1.5} className="mx-auto text-slate-600" />
            <p className="mt-3 text-slate-400">Bạn chưa có xe nào.</p>
            <button
              onClick={openAdd}
              className="mt-4 inline-flex items-center gap-2 text-cyan-400 font-medium hover:underline"
            >
              <Plus size={16} /> Thêm xe đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-slate-900 border border-white/10 rounded-2xl p-5 flex items-start justify-between"
              >
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                    {v.category === "Ô tô" ? <Car size={22} /> : <Bike size={22} />}
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{v.licensePlate}</p>
                    <p className="text-sm text-slate-400">
                      {[v.category, v.brand, v.type].filter(Boolean).join(" · ") || "Chưa có thông tin"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(v)}
                    className="p-2 text-slate-500 hover:text-cyan-400 transition"
                    title="Sửa"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(v)}
                    className="p-2 text-slate-500 hover:text-red-400 transition"
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
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">
                {modal.id == null ? "Thêm xe" : "Sửa xe"}
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

              <Field
                label="Biển số xe"
                placeholder="59A1-234.56"
                value={modal.data.licensePlate}
                onChange={(e) => setModal({ ...modal, data: { ...modal.data, licensePlate: e.target.value } })}
                required
              />

              <label className="block mb-4">
                <span className="block text-sm font-medium text-slate-300 mb-1.5">Loại xe</span>
                <select
                  value={modal.data.category}
                  onChange={(e) => setModal({ ...modal, data: { ...modal.data, category: e.target.value } })}
                  className={inputCls}
                >
                  <option value="Xe máy" className="bg-slate-800">Xe máy</option>
                  <option value="Ô tô" className="bg-slate-800">Ô tô</option>
                </select>
              </label>

              <label className="block mb-4">
                <span className="block text-sm font-medium text-slate-300 mb-1.5">
                  Hãng xe <span className="text-slate-500">(chọn hoặc tự nhập)</span>
                </span>
                <input
                  list="brandOptions"
                  placeholder={isCar ? "Toyota, Honda, Mazda..." : "Honda, Yamaha, Suzuki..."}
                  value={modal.data.brand}
                  onChange={(e) => setModal({ ...modal, data: { ...modal.data, brand: e.target.value } })}
                  className={inputCls}
                />
                <datalist id="brandOptions">
                  {brandList.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </label>

              <label className="block mb-4">
                <span className="block text-sm font-medium text-slate-300 mb-1.5">
                  Dòng xe <span className="text-slate-500">(chọn hoặc tự nhập)</span>
                </span>
                <input
                  list="modelOptions"
                  placeholder={isCar ? "Vios, City, CX-5..." : "Wave, Vision, SH..."}
                  value={modal.data.type}
                  onChange={(e) => setModal({ ...modal, data: { ...modal.data, type: e.target.value } })}
                  className={inputCls}
                />
                <datalist id="modelOptions">
                  {modelList.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </label>

              <div className="flex gap-3 mt-2">
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
    </div>
  );
}
