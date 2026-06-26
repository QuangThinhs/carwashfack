"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import Field from "@/components/Field";
import { register } from "@/services/auth";
import { saveAuth } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await register(form);
      saveAuth(res.token, { fullName: res.fullName, phone: res.phone, role: res.role });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Tạo tài khoản"
      subtitle="Đăng ký để bắt đầu tích điểm"
      footer={
        <>
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-cyan-400 font-medium hover:underline">
            Đăng nhập
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">
            {error}
          </div>
        )}
        <Field
          label="Họ và tên"
          placeholder="Nguyễn Văn A"
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          required
        />
        <Field
          label="Số điện thoại"
          type="tel"
          placeholder="0901234567"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          required
        />
        <Field
          label="Email (tuỳ chọn)"
          type="email"
          placeholder="email@example.com"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
        <Field
          label="Mật khẩu"
          type="password"
          placeholder="Tối thiểu 6 ký tự"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-semibold
                     py-2.5 mt-2 hover:opacity-95 active:scale-[.99] transition disabled:opacity-60"
        >
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </form>
    </AuthShell>
  );
}
