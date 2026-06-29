"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Crown, LogOut } from "lucide-react";
import { clearAuth, type AuthUser } from "@/lib/auth";
import { getLoyalty } from "@/services/loyalty";
import Logo from "@/components/Logo";
import { useConfirm } from "@/components/ConfirmDialog";

export default function CustomerTopbar({ user }: { user: AuthUser }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [tier, setTier] = useState("Member");

  useEffect(() => {
    getLoyalty()
      .then((s) => setTier(s.tierLabel))
      .catch(() => {});
  }, []);

  async function handleLogout() {
    if (!(await confirm({ message: "Bạn có chắc muốn đăng xuất?", confirmText: "Đăng xuất" }))) return;
    clearAuth();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="text-white">
          <Logo className="text-xl" size={22} />
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-slate-400">Xin chào,</span>
            <span className="font-semibold text-white">{user.fullName}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-semibold px-2.5 py-1">
              <Crown size={13} /> {tier}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition"
          >
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}
