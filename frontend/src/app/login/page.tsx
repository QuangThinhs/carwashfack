"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import Field from "@/components/Field";
import { login } from "@/services/auth";
import { saveAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login({ phone, password });
      saveAuth(res.token, { fullName: res.fullName, phone: res.phone, role: res.role });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Đăng nhập"
      subtitle="Chào mừng bạn quay lại"
      footer={
        <>
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-cyan-400 font-medium hover:underline">
            Đăng ký ngay
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
          label="Số điện thoại"
          type="tel"
          placeholder="0901234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <Field
          label="Mật khẩu"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-semibold
                     py-2.5 mt-2 hover:opacity-95 active:scale-[.99] transition disabled:opacity-60"
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>
    </AuthShell>
  );
}
