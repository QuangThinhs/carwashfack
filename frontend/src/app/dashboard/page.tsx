"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, clearAuth, type AuthUser } from "@/lib/auth";
import Logo from "@/components/Logo";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
  }, [router]);

  function handleLogout() {
    clearAuth();
    router.push("/login");
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo className="text-xl text-cyan-600" size={22} />
          <button
            onClick={handleLogout}
            className="text-sm text-slate-600 hover:text-red-500 transition"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8">
          <h1 className="text-3xl font-bold text-slate-800">Xin chào, {user.fullName} 👋</h1>
          <p className="text-slate-500 mt-2">Bạn đã đăng nhập thành công.</p>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">Số điện thoại</p>
              <p className="text-lg font-semibold text-slate-800">{user.phone}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">Vai trò</p>
              <p className="text-lg font-semibold text-slate-800">{user.role}</p>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-400">
            (Các chức năng đặt lịch, tích điểm... sẽ được phát triển ở bước tiếp theo.)
          </p>
        </div>
      </main>
    </div>
  );
}
