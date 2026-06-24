"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Crown, LogOut } from "lucide-react";
import { clearAuth, type AuthUser } from "@/lib/auth";
import Logo from "@/components/Logo";

export default function CustomerTopbar({ user }: { user: AuthUser }) {
  const router = useRouter();

  function handleLogout() {
    clearAuth();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="text-cyan-600">
          <Logo className="text-xl" size={22} />
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-slate-500">Xin chào,</span>
            <span className="font-semibold text-slate-800">{user.fullName}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold px-2.5 py-1">
              <Crown size={13} /> Member
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-red-500 transition"
          >
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}
