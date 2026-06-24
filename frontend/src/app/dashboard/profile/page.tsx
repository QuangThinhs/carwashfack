"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { getUser, saveAuth, getToken, type AuthUser } from "@/lib/auth";
import { getProfile, updateProfile } from "@/services/customer";
import CustomerTopbar from "@/components/CustomerTopbar";
import Field from "@/components/Field";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "" });
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
      .then((p) => setForm({ fullName: p.fullName, phone: p.phone, email: p.email ?? "" }))
      .catch(() => setForm({ fullName: u.fullName, phone: u.phone, email: "" }))
      .finally(() => setLoading(false));
  }, [router]);

  function update(key: "fullName" | "email", value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const p = await updateProfile({ fullName: form.fullName, email: form.email });
      // Cap nhat localStorage de ten hien thi tren topbar/dashboard doi theo
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
    <div className="min-h-screen bg-slate-50">
      <CustomerTopbar user={user} />

      <main className="max-w-3xl mx-auto px-6 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-cyan-600 transition mb-5"
        >
          <ArrowLeft size={16} /> Quay lại
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-800">Hồ sơ cá nhân</h1>
          <p className="text-slate-500 mt-1 mb-6">Xem và cập nhật thông tin của bạn.</p>

          {loading ? (
            <p className="text-slate-400">Đang tải...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              {message && (
                <div
                  className={`mb-4 rounded-lg text-sm px-4 py-3 border ${
                    message.type === "ok"
                      ? "bg-green-50 border-green-200 text-green-600"
                      : "bg-red-50 border-red-200 text-red-600"
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

              <label className="block mb-4">
                <span className="block text-sm font-medium text-slate-700 mb-1.5">Số điện thoại</span>
                <input
                  value={form.phone}
                  disabled
                  className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-slate-500 cursor-not-allowed"
                />
                <span className="text-xs text-slate-400 mt-1 block">
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

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-semibold px-6 py-2.5 mt-2 hover:opacity-95 transition disabled:opacity-60"
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
