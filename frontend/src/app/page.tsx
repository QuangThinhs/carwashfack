import Link from "next/link";
import {
  CalendarClock,
  Gift,
  Crown,
  History,
  Clock,
  Bike,
  Sparkles,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const stats = [
  { n: "7.7M+", l: "Xe máy tại Việt Nam" },
  { n: "4", l: "Hạng thành viên" },
  { n: "12", l: "Tháng tích điểm" },
  { n: "100%", l: "Đặt lịch online" },
];

const features = [
  { Icon: CalendarClock, title: "Đặt lịch trước", desc: "Chọn giờ rửa xe online, không phải xếp hàng chờ đợi." },
  { Icon: Gift, title: "Tích điểm đổi quà", desc: "Mỗi lần rửa được tích điểm, đổi lấy giảm giá hoặc rửa miễn phí." },
  { Icon: Crown, title: "Hạng thành viên", desc: "Lên hạng để mở khóa ưu đãi và quyền đặt lịch sớm hơn." },
  { Icon: History, title: "Lịch sử minh bạch", desc: "Xem lại toàn bộ lịch sử rửa xe và điểm thưởng bất cứ lúc nào." },
];

const services = [
  { name: "Rửa xe cơ bản", price: "30.000đ", time: "20 phút", popular: false },
  { name: "Rửa xe cao cấp", price: "50.000đ", time: "35 phút", popular: true },
  { name: "Vệ sinh động cơ", price: "40.000đ", time: "25 phút", popular: false },
  { name: "Đánh bóng xe", price: "60.000đ", time: "30 phút", popular: false },
];

const tiers = [
  { name: "Member", days: 7, color: "from-slate-400 to-slate-500", perk: "Tích điểm cơ bản" },
  { name: "Silver", days: 10, color: "from-slate-300 to-slate-400", perk: "Giảm 5% dịch vụ thêm" },
  { name: "Gold", days: 12, color: "from-amber-400 to-yellow-500", perk: "Giảm 10%, ưu tiên hàng đợi" },
  { name: "Platinum", days: 14, color: "from-cyan-400 to-sky-500", perk: "Giảm 15%, 1 lần rửa miễn phí/tháng" },
];

const steps = [
  { num: "1", title: "Đăng ký tài khoản", desc: "Tạo tài khoản bằng số điện thoại và biển số xe." },
  { num: "2", title: "Đặt lịch rửa xe", desc: "Chọn dịch vụ và khung giờ phù hợp với bạn." },
  { num: "3", title: "Tích điểm & lên hạng", desc: "Mỗi lần rửa nhận điểm, đổi ưu đãi và thăng hạng." },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
              <Sparkles size={16} /> Rửa xe máy thông minh
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Đặt lịch trước,
              <br /> tích điểm thả ga.
            </h1>
            <p className="mt-5 text-white/85 text-lg max-w-md">
              AutoWash Pro giúp bạn rửa xe nhanh chóng, tích điểm sau mỗi lần ghé và nhận ưu đãi
              theo hạng thành viên.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-lg bg-white text-cyan-600 font-semibold px-6 py-3 hover:bg-white/90 transition"
              >
                Bắt đầu ngay
              </Link>
              <a
                href="#services"
                className="rounded-lg border border-white/70 font-semibold px-6 py-3 hover:bg-white/10 transition"
              >
                Xem dịch vụ
              </a>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <Bike size={200} strokeWidth={1.25} className="text-white/90 drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.l}>
              <div className="text-3xl font-bold text-cyan-600">{s.n}</div>
              <div className="text-sm text-slate-500 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-slate-800">Vì sao chọn AutoWash Pro?</h2>
        <p className="text-center text-slate-500 mt-2">
          Trải nghiệm rửa xe hiện đại, tiện lợi và nhiều ưu đãi.
        </p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <f.Icon size={26} strokeWidth={1.9} />
              </div>
              <h3 className="mt-4 font-semibold text-lg text-slate-800">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center text-slate-800">Bảng dịch vụ</h2>
          <p className="text-center text-slate-500 mt-2">Các gói rửa xe &amp; dịch vụ thêm.</p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <div
                key={s.name}
                className={`relative rounded-2xl bg-white p-6 border ${
                  s.popular ? "border-cyan-500 shadow-lg" : "border-slate-200"
                }`}
              >
                {s.popular && (
                  <span className="absolute -top-3 left-6 bg-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Phổ biến
                  </span>
                )}
                <h3 className="font-semibold text-lg text-slate-800">{s.name}</h3>
                <div className="mt-3 text-2xl font-bold text-cyan-600">{s.price}</div>
                <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-1">
                  <Clock size={15} /> {s.time}
                </div>
                <Link
                  href="/register"
                  className="mt-5 block text-center rounded-lg bg-slate-100 hover:bg-cyan-500 hover:text-white text-slate-700 font-medium py-2 transition"
                >
                  Đặt lịch
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section id="tiers" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-slate-800">Hạng thành viên</h2>
        <p className="text-center text-slate-500 mt-2">
          Hạng càng cao, đặt lịch càng sớm &amp; ưu đãi càng nhiều.
        </p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((t) => (
            <div key={t.name} className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className={`bg-gradient-to-br ${t.color} text-white p-6`}>
                <div className="text-sm uppercase tracking-wide opacity-90">Hạng</div>
                <div className="text-2xl font-bold">{t.name}</div>
              </div>
              <div className="p-6">
                <div className="text-sm text-slate-500">Đặt lịch trước</div>
                <div className="text-3xl font-bold text-slate-800">
                  {t.days} <span className="text-base font-medium text-slate-500">ngày</span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{t.perk}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center text-slate-800">Cách hoạt động</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-sky-600 text-white text-xl font-bold flex items-center justify-center">
                  {s.num}
                </div>
                <h3 className="mt-4 font-semibold text-lg text-slate-800">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-cyan-500 to-sky-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">Sẵn sàng trải nghiệm?</h2>
          <p className="mt-3 text-white/85">
            Đăng ký ngay hôm nay để bắt đầu tích điểm và nhận ưu đãi.
          </p>
          <Link
            href="/register"
            className="inline-block mt-7 rounded-lg bg-white text-cyan-600 font-semibold px-8 py-3 hover:bg-white/90 transition"
          >
            Đăng ký miễn phí
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
