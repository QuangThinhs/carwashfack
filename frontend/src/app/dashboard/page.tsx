"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  Bike,
  History,
  Gift,
  Ticket,
  UserRound,
  Crown,
  LogOut,
} from "lucide-react";
import { getUser, clearAuth, type AuthUser } from "@/lib/auth";
import Logo from "@/components/Logo";

const features = [
  { Icon: CalendarClock, title: "Đặt lịch rửa xe", desc: "Chọn dịch vụ & khung giờ phù hợp với bạn." },
  { Icon: Bike, title: "Xe của tôi", desc: "Quản lý danh sách xe máy đã đăng ký." },
  { Icon: History, title: "Lịch sử rửa xe", desc: "Xem lại các lần rửa đã thực hiện." },
  { Icon: Gift, title: "Điểm thưởng", desc: "Theo dõi & đổi điểm lấy ưu đãi." },
  { Icon: Ticket, title: "Ưu đãi", desc: "Khuyến mãi dành riêng cho hạng của bạn." },
  { Icon: UserRound, title: "Hồ sơ", desc: "Cập nhật thông tin cá nhân." },
];

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
    <div className="min-h-screen bg-slate-50">
      {/* Topbar khu vuc khach hang */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo className="text-xl text-cyan-600" size={22} />
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

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Tong quan + the hang thanh vien */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8">
            <h1 className="text-2xl font-bold text-slate-800">Xin chào, {user.fullName}</h1>
            <p className="text-slate-500 mt-2">
              Chào mừng bạn đến với trang quản lý AutoWash Pro — nơi bạn đặt lịch, theo dõi điểm thưởng
              và quản lý xe của mình.
            </p>
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Số điện thoại</p>
                <p className="font-semibold text-slate-800">{user.phone}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Xe đã đăng ký</p>
                <p className="font-semibold text-slate-800">0</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Lượt rửa</p>
                <p className="font-semibold text-slate-800">0</p>
              </div>
            </div>
          </div>

          {/* The hang thanh vien */}
          <div className="bg-gradient-to-br from-cyan-500 to-sky-600 text-white rounded-2xl p-8">
            <div className="flex items-center gap-2 text-white/90">
              <Crown size={18} />
              <span className="text-sm uppercase tracking-wide">Hạng thành viên</span>
            </div>
            <div className="mt-2 text-3xl font-bold">Member</div>
            <div className="mt-6">
              <p className="text-white/80 text-sm">Điểm tích lũy</p>
              <p className="text-4xl font-bold">0</p>
            </div>
            <p className="mt-4 text-white/80 text-sm">
              Cửa sổ đặt lịch trước: <b>7 ngày</b>
            </p>
          </div>
        </section>

        {/* Luoi chuc nang */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-slate-800">Chức năng</h2>
          <p className="text-sm text-slate-500 mt-1">
            Các tính năng đang được phát triển và sẽ sớm ra mắt.
          </p>
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="relative bg-white rounded-2xl border border-slate-200 p-6"
              >
                <span className="absolute top-4 right-4 text-[11px] font-semibold text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
                  Sắp có
                </span>
                <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <f.Icon size={24} strokeWidth={1.9} />
                </div>
                <h3 className="mt-4 font-semibold text-slate-800">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
