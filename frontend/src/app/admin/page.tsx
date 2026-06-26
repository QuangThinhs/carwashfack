"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import { getUser, clearAuth, type AuthUser } from "@/lib/auth";
import Logo from "@/components/Logo";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u || (u.role !== "ADMIN" && u.role !== "STAFF")) {
      router.replace("/admin/login");
      return;
    }
    setUser(u);
  }, [router]);

  function handleLogout() {
    if (!confirm("Đăng xuất khỏi trang quản trị?")) return;
    clearAuth();
    router.push("/admin/login");
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Logo className="text-xl" size={22} />
            <span className="text-[11px] font-semibold tracking-widest uppercase text-cyan-400 border border-cyan-500/20 bg-cyan-500/10 rounded-full px-2.5 py-0.5">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 hidden sm:inline">
              Xin chào, <b className="text-white">{user.fullName}</b>
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition"
            >
              <LogOut size={16} /> Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-10 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
            <ShieldCheck size={32} className="text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mt-4">Trang quản trị AutoWash Pro</h1>
          <p className="text-slate-400 mt-2 max-w-md mx-auto">
            Đăng nhập quản trị thành công. Các chức năng quản lý (lịch đặt, dịch vụ, khuyến mãi,
            thống kê...) sẽ được phát triển ở bước tiếp theo.
          </p>
        </div>
      </main>
    </div>
  );
}
