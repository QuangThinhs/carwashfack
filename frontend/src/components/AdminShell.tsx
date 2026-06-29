"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, LayoutGrid, CalendarClock, History, Droplets, Ticket, Users, LogOut } from "lucide-react";
import { getUser, clearAuth, type AuthUser } from "@/lib/auth";
import Logo from "@/components/Logo";
import { useConfirm } from "@/components/ConfirmDialog";

const navItems = [
  { key: "overview", label: "Tổng quan", Icon: LayoutDashboard, href: "/admin", ready: true },
  { key: "bays", label: "Bãi rửa", Icon: LayoutGrid, href: "/admin/bays", ready: true },
  { key: "bookings", label: "Lịch đặt", Icon: CalendarClock, href: "/admin/bookings", ready: true },
  { key: "history", label: "Lịch sử đơn hàng", Icon: History, href: "/admin/history", ready: true },
  { key: "services", label: "Dịch vụ", Icon: Droplets, href: "/admin/services", ready: true },
  { key: "promotions", label: "Khuyến mãi", Icon: Ticket, href: "/admin/promotions", ready: true },
  { key: "customers", label: "Khách hàng", Icon: Users, href: "/admin/customers", ready: false },
];

export default function AdminShell({
  active,
  title,
  children,
}: {
  active: string;
  title: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const confirm = useConfirm();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u || (u.role !== "ADMIN" && u.role !== "STAFF")) {
      router.replace("/admin/login");
      return;
    }
    setUser(u);
  }, [router]);

  async function handleLogout() {
    if (!(await confirm({ message: "Đăng xuất khỏi trang quản trị?", confirmText: "Đăng xuất" }))) return;
    clearAuth();
    router.push("/admin/login");
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-white/10 bg-slate-900 sticky top-0 h-screen p-4">
        <div className="px-2 py-2 flex items-center gap-2 text-white">
          <Logo className="text-lg" size={20} />
          <span className="text-[10px] font-semibold tracking-widest uppercase text-cyan-400 border border-cyan-500/20 bg-cyan-500/10 rounded-full px-2 py-0.5">
            Admin
          </span>
        </div>

        <nav className="mt-6 flex-1 space-y-1">
          {navItems.map((it) => {
            const isActive = it.key === active;
            if (!it.ready) {
              return (
                <div
                  key={it.key}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 cursor-not-allowed"
                >
                  <span className="flex items-center gap-3">
                    <it.Icon size={18} /> {it.label}
                  </span>
                  <span className="text-[10px] bg-white/5 rounded px-1.5 py-0.5 text-slate-500">Sắp có</span>
                </div>
              );
            }
            return (
              <Link
                key={it.key}
                href={it.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                  isActive ? "bg-cyan-500/10 text-cyan-400 font-medium" : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <it.Icon size={18} /> {it.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-red-400 transition"
        >
          <LogOut size={18} /> Đăng xuất
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur border-b border-white/10 h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="lg:hidden text-white">
              <Logo className="text-base" size={18} />
            </span>
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400 hidden sm:inline">
              Xin chào, <b className="text-white">{user.fullName}</b>
            </span>
            <button
              onClick={handleLogout}
              className="lg:hidden inline-flex items-center text-slate-400 hover:text-red-400"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
