"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { getUser, saveAuth, getToken, type AuthUser } from "@/lib/auth";
import { getProfile, updateProfile } from "@/services/customer";
import CustomerTopbar from "@/components/CustomerTopbar";
import Field from "@/components/Field";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30";

type FormKey = "fullName" | "email" | "dateOfBirth" | "gender" | "address";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
    getProfile()
      .then((p) =>
        setForm({
          fullName: p.fullName,
          phone: p.phone,
          email: p.email ?? "",
          dateOfBirth: p.dateOfBirth ?? "",
          gender: p.gender ?? "",
          address: p.address ?? "",
        }),
      )
      .catch(() => setForm((f) => ({ ...f, fullName: u.fullName, phone: u.phone })))
      .finally(() => setLoading(false));
  }, [router]);

  function update(key: FormKey, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const p = await updateProfile({
        fullName: form.fullName,
        email: form.email || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
        address: form.address || undefined,
      });
      const token = getToken();
      if (token && user) saveAuth(token, { ...user, fullName: p.fullName });
      setUser((u) => (u ? { ...u, fullName: p.fullName } : u));
      setMessage({ type: "ok", text: "Cập nhật hồ sơ thành công!" });
    } catch (err: any) {
      setMessage({ type: "err", text: err?.response?.data?.message || "Cập nhật thất bại, vui lòng thử lại." });
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <CustomerTopbar user={user} />

      <main className="max-w-3xl mx-auto px-6 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-cyan-400 transition mb-5"
        >
          <ArrowLeft size={16} /> Quay lại
        </Link>

        <div className="bg-slate-900 border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white">Hồ sơ cá nhân</h1>
          <p className="text-slate-400 mt-1 mb-6">Xem và cập nhật thông tin của bạn.</p>

          {loading ? (
            <p className="text-slate-500">Đang tải...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              {message && (
                <div
                  className={`mb-4 rounded-lg text-sm px-4 py-3 border ${
                    message.type === "ok"
                      ? "bg-green-500/10 border-green-500/30 text-green-300"
                      : "bg-red-500/10 border-red-500/30 text-red-300"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <Field
                label="Họ và tên"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                required
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block mb-4">
                  <span className="block text-sm font-medium text-slate-300 mb-1.5">Ngày sinh</span>
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => update("dateOfBirth", e.target.value)}
                    className={`${inputCls} [color-scheme:dark]`}
                  />
                </label>
                <label className="block mb-4">
                  <span className="block text-sm font-medium text-slate-300 mb-1.5">Giới tính</span>
                  <select
                    value={form.gender}
                    onChange={(e) => update("gender", e.target.value)}
                    className={inputCls}
                  >
                    <option value="" className="bg-slate-800">-- Chọn --</option>
                    <option value="Nam" className="bg-slate-800">Nam</option>
                    <option value="Nữ" className="bg-slate-800">Nữ</option>
                    <option value="Khác" className="bg-slate-800">Khác</option>
                  </select>
                </label>
              </div>

              <label className="block mb-4">
                <span className="block text-sm font-medium text-slate-300 mb-1.5">Số điện thoại</span>
                <input
                  value={form.phone}
                  disabled
                  className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-4 py-2.5 text-slate-500 cursor-not-allowed"
                />
                <span className="text-xs text-slate-500 mt-1 block">
                  Số điện thoại là tài khoản đăng nhập, không thể thay đổi.
                </span>
              </label>

              <Field
                label="Email"
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />

              <Field
                label="Địa chỉ"
                placeholder="Số nhà, đường, phường/xã, quận/huyện..."
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 text-white font-semibold px-6 py-2.5 mt-2 hover:bg-cyan-400 transition disabled:opacity-60"
              >
                <Save size={16} /> {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
