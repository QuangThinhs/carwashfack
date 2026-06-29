"use client";

import { useEffect, useState } from "react";
import { Users, CalendarClock, Droplets, Wallet, Clock } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { getOverview, type AdminOverview } from "@/services/admin";
import { BOOKING_STATUS, fmtPrice, fmtTime } from "@/services/booking";

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOverview()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Tổng khách hàng", value: data?.totalCustomers ?? 0, Icon: Users, color: "text-cyan-400 bg-cyan-500/10" },
    { label: "Tổng lượt đặt", value: data?.totalBookings ?? 0, Icon: CalendarClock, color: "text-indigo-400 bg-indigo-500/10" },
    { label: "Rửa hoàn tất", value: data?.completedWashes ?? 0, Icon: Droplets, color: "text-green-400 bg-green-500/10" },
    { label: "Doanh thu", value: fmtPrice(data?.revenue ?? 0), Icon: Wallet, color: "text-amber-400 bg-amber-500/10" },
  ];

  return (
    <AdminShell active="overview" title="Tổng quan">
      {/* The so lieu */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-900 border border-white/10 rounded-2xl p-5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.Icon size={22} />
            </div>
            <p className="text-2xl font-bold text-white mt-3">{s.value}</p>
            <p className="text-sm text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Lich dat gan day */}
      <div className="mt-6 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-semibold text-white">Lịch đặt gần đây</h2>
          {data && data.pendingBookings > 0 && (
            <span className="text-xs bg-amber-500/15 text-amber-300 rounded-full px-2.5 py-1">
              {data.pendingBookings} chờ xác nhận
            </span>
          )}
        </div>

        {loading ? (
          <p className="p-5 text-slate-500">Đang tải...</p>
        ) : !data || data.recentBookings.length === 0 ? (
          <p className="p-5 text-slate-500">Chưa có lịch đặt nào.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {data.recentBookings.map((b) => {
              const st = BOOKING_STATUS[b.status] ?? { label: b.status, cls: "bg-slate-500/15 text-slate-400" };
              return (
                <div key={b.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-white">{b.customerName}</span>
                      <span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 ${st.cls}`}>
                        {st.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      {b.serviceName} · {b.vehiclePlate}
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <Clock size={12} /> {fmtTime(b.scheduledTime)}
                      </span>
                    </p>
                  </div>
                  <span className="font-semibold text-cyan-400 shrink-0">{fmtPrice(b.price)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
