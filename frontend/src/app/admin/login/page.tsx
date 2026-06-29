"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock } from "lucide-react";
import { login } from "@/services/auth";
import { saveAuth } from "@/lib/auth";
import Logo from "@/components/Logo";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 placeholder:text-slate-500";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login({ phone: username, password });
      if (res.role !== "ADMIN" && res.role !== "STAFF") {
        setError("Tài khoản này không có quyền quản trị.");
        return;
      }
      saveAuth(res.token, { fullName: res.fullName, phone: res.phone, role: res.role });
      router.push("/admin");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <ShieldCheck size={28} className="text-cyan-400" />
          </div>
          <div className="flex justify-center mt-4 text-white">
            <Logo className="text-xl" size={20} />
          </div>
          <p className="text-xs text-slate-400 mt-2 tracking-[0.25em] uppercase">Khu vực quản trị</p>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-8">
          <h1 className="text-2xl font-bold text-white">Đăng nhập quản trị</h1>
          <p className="text-slate-400 mt-1 mb-6">Dành cho quản trị viên &amp; nhân viên.</p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">
                {error}
              </div>
            )}

            <label className="block mb-4">
              <span className="block text-sm font-medium text-slate-300 mb-1.5">Tên đăng nhập</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="admin"
                className={inputCls}
              />
            </label>

            <label className="block mb-4">
              <span className="block text-sm font-medium text-slate-300 mb-1.5">Mật khẩu</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={inputCls}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 text-white font-semibold py-2.5 mt-2 hover:bg-cyan-400 transition disabled:opacity-60"
            >
              <Lock size={16} /> {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>
        </div>

        <div className="text-center text-sm text-slate-500 mt-6">
          Bạn là khách hàng?{" "}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Đăng nhập tại đây
          </Link>
        </div>
      </div>
    </div>
  );
}
