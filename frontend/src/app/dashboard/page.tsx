"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarClock,
  Bike,
  History,
  Gift,
  Ticket,
  UserRound,
  Crown,
} from "lucide-react";
import { getUser, type AuthUser } from "@/lib/auth";
import { getVehicles } from "@/services/vehicle";
import { getBookings } from "@/services/booking";
import { getLoyalty, type LoyaltySummary } from "@/services/loyalty";
import CustomerTopbar from "@/components/CustomerTopbar";

const features = [
  { Icon: CalendarClock, title: "Đặt lịch rửa xe", desc: "Chọn dịch vụ & khung giờ phù hợp với bạn.", href: "/dashboard/bookings" },
  { Icon: Bike, title: "Xe của tôi", desc: "Quản lý danh sách xe máy đã đăng ký.", href: "/dashboard/vehicles" },
  { Icon: History, title: "Lịch sử rửa xe", desc: "Xem lại các lần rửa đã thực hiện.", href: "/dashboard/history" },
  { Icon: Gift, title: "Điểm thưởng", desc: "Theo dõi điểm tích lũy & hạng thành viên.", href: "/dashboard/loyalty" },
  { Icon: Ticket, title: "Ưu đãi", desc: "Khuyến mãi dành riêng cho hạng của bạn.", href: "/dashboard/promotions" },
  { Icon: UserRound, title: "Hồ sơ", desc: "Xem & cập nhật thông tin cá nhân.", href: "/dashboard/profile" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [washCount, setWashCount] = useState(0);
  const [loyalty, setLoyalty] = useState<LoyaltySummary | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
    getVehicles()
      .then((list) => setVehicleCount(list.length))
      .catch(() => setVehicleCount(0));
    getBookings()
      .then((list) => setWashCount(list.filter((b) => b.status === "DONE").length))
      .catch(() => setWashCount(0));
    getLoyalty()
      .then(setLoyalty)
      .catch(() => {});
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <CustomerTopbar user={user} />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Tong quan + the hang thanh vien */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-slate-900 border border-white/10 rounded-2xl p-8">
            <h1 className="text-2xl font-bold text-white">Xin chào, {user.fullName}</h1>
            <p className="text-slate-400 mt-2">
              Chào mừng bạn đến với trang quản lý AutoWash Pro — nơi bạn đặt lịch, theo dõi điểm thưởng
              và quản lý xe của mình.
            </p>
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Số điện thoại</p>
                <p className="font-semibold text-white">{user.phone}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Xe đã đăng ký</p>
                <p className="font-semibold text-white">{vehicleCount}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Lượt rửa</p>
                <p className="font-semibold text-white">{washCount}</p>
              </div>
            </div>
          </div>

          {/* The hang thanh vien */}
          <div className="bg-gradient-to-br from-cyan-500 to-sky-600 text-white rounded-2xl p-8">
            <div className="flex items-center gap-2 text-white/90">
              <Crown size={18} />
              <span className="text-sm uppercase tracking-wide">Hạng thành viên</span>
            </div>
            <div className="mt-2 text-3xl font-bold">{loyalty?.tierLabel ?? "Member"}</div>
            <div className="mt-6">
              <p className="text-white/80 text-sm">Điểm tích lũy</p>
              <p className="text-4xl font-bold">{loyalty?.pointsBalance ?? 0}</p>
            </div>
            <p className="mt-4 text-white/80 text-sm">
              Cửa sổ đặt lịch trước: <b>{loyalty?.bookingWindowDays ?? 7} ngày</b>
            </p>
          </div>
        </section>

        {/* Luoi chuc nang */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-white">Chức năng</h2>
          <p className="text-sm text-slate-400 mt-1">Chọn một chức năng để bắt đầu.</p>
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="bg-slate-900 border border-white/10 rounded-2xl p-6 block hover:bg-slate-800 hover:-translate-y-0.5 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <f.Icon size={24} strokeWidth={1.9} />
                </div>
                <h3 className="mt-4 font-semibold text-white">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{f.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
