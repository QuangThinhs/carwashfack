"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, History, Clock, Droplets, Wallet } from "lucide-react";
import { getUser, type AuthUser } from "@/lib/auth";
import { getBookings, BOOKING_STATUS, fmtPrice, fmtTime, type Booking } from "@/services/booking";
import CustomerTopbar from "@/components/CustomerTopbar";

export default function HistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [history, setHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
    getBookings()
      .then((all) => setHistory(all.filter((b) => b.status === "DONE" || b.status === "CANCELLED")))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [router]);

  if (!user) return null;

  const done = history.filter((b) => b.status === "DONE");
  const washCount = done.length;
  const totalSpent = done.reduce((sum, b) => sum + b.price, 0);

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

        <h1 className="text-2xl font-bold text-white">Lịch sử rửa xe</h1>
        <p className="text-slate-400 mt-1 mb-6">Các lần rửa đã hoàn tất và lịch đã huỷ.</p>

        {/* Thong ke */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Droplets size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Số lần đã rửa</p>
              <p className="text-2xl font-bold text-white">{washCount}</p>
            </div>
          </div>
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Tổng chi tiêu</p>
              <p className="text-2xl font-bold text-white">{fmtPrice(totalSpent)}</p>
            </div>
          </div>
        </div>

        {/* Danh sach lich su */}
        {loading ? (
          <p className="text-slate-500">Đang tải...</p>
        ) : history.length === 0 ? (
          <div className="bg-slate-900/50 rounded-2xl border border-dashed border-white/15 p-12 text-center">
            <History size={40} strokeWidth={1.5} className="mx-auto text-slate-600" />
            <p className="mt-3 text-slate-400">Chưa có lịch sử nào.</p>
            <Link
              href="/dashboard/bookings"
              className="mt-3 inline-block text-cyan-400 font-medium hover:underline"
            >
              → Đặt lịch rửa xe
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((b) => {
              const st = BOOKING_STATUS[b.status] ?? { label: b.status, cls: "bg-slate-500/15 text-slate-400" };
              return (
                <div
                  key={b.id}
                  className="bg-slate-900 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white">{b.serviceName}</h3>
                      <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${st.cls}`}>
                        {st.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                      <Clock size={14} /> {fmtTime(b.scheduledTime)} · {b.vehiclePlate}
                    </p>
                  </div>
                  <p
                    className={`font-bold shrink-0 ${
                      b.status === "DONE" ? "text-cyan-400" : "text-slate-500 line-through"
                    }`}
                  >
                    {fmtPrice(b.price)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
