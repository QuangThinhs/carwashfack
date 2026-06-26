"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Ticket, Tag } from "lucide-react";
import { getUser, type AuthUser } from "@/lib/auth";
import { getPromotions, type Promotion } from "@/services/promotion";
import CustomerTopbar from "@/components/CustomerTopbar";

export default function PromotionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
    getPromotions()
      .then(setPromos)
      .catch(() => setPromos([]))
      .finally(() => setLoading(false));
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <CustomerTopbar user={user} />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-cyan-400 transition mb-5"
        >
          <ArrowLeft size={16} /> Quay lại
        </Link>

        <h1 className="text-2xl font-bold text-white">Ưu đãi</h1>
        <p className="text-slate-400 mt-1 mb-6">Khuyến mãi đang áp dụng cho hạng thành viên của bạn.</p>

        {loading ? (
          <p className="text-slate-500">Đang tải...</p>
        ) : promos.length === 0 ? (
          <div className="bg-slate-900/50 rounded-2xl border border-dashed border-white/15 p-12 text-center">
            <Ticket size={40} strokeWidth={1.5} className="mx-auto text-slate-600" />
            <p className="mt-3 text-slate-400">Hiện chưa có ưu đãi nào cho hạng của bạn.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {promos.map((p) => (
              <div key={p.id} className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-sky-600 text-white p-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag size={20} />
                    <span className="text-2xl font-bold">-{p.discountPercent}%</span>
                  </div>
                  {p.minTierLabel && (
                    <span className="text-xs font-semibold bg-white/20 rounded-full px-2.5 py-1">
                      {p.minTierLabel}+
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-white">{p.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{p.description}</p>
                  <div className="mt-3 inline-block text-xs font-mono bg-white/5 border border-white/10 text-slate-300 rounded px-2 py-1">
                    Mã: {p.code}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
