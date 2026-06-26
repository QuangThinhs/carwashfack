import Link from "next/link";
import Image from "next/image";
import {
  CalendarClock,
  Gift,
  Crown,
  History,
  Clock,
  Sparkles,
  ShieldCheck,
  Star,
  Check,
} from "lucide-react";
import posterOrange from "@/images/poster2.jpg";
import posterGrid from "@/images/poster.webp";
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
  { Icon: Gift, title: "Tích điểm đổi quà", desc: "Mỗi lần rửa được tích điểm, đổi lấy giảm giá & ưu đãi." },
  { Icon: Crown, title: "Hạng thành viên", desc: "Lên hạng để mở khóa ưu đãi và đặt lịch sớm hơn." },
  { Icon: History, title: "Lịch sử minh bạch", desc: "Theo dõi toàn bộ lịch sử rửa xe và điểm thưởng." },
];

const services = [
  { name: "Rửa xe cơ bản", price: "30.000đ", time: "20 phút", popular: false },
  { name: "Rửa xe cao cấp", price: "50.000đ", time: "35 phút", popular: true },
  { name: "Vệ sinh động cơ", price: "40.000đ", time: "25 phút", popular: false },
  { name: "Đánh bóng xe", price: "60.000đ", time: "30 phút", popular: false },
];

const tiers = [
  { name: "Member", days: 7, color: "from-slate-500 to-slate-600", perk: "Tích điểm cơ bản" },
  { name: "Silver", days: 10, color: "from-slate-300 to-slate-400", perk: "Giảm 5% dịch vụ thêm" },
  { name: "Gold", days: 12, color: "from-amber-400 to-yellow-500", perk: "Giảm 10%, ưu tiên hàng đợi" },
  { name: "Platinum", days: 14, color: "from-cyan-400 to-sky-500", perk: "Giảm 15%, 1 lần rửa miễn phí/tháng" },
];

const steps = [
  { num: "1", title: "Đăng ký tài khoản", desc: "Tạo tài khoản bằng số điện thoại và biển số xe." },
  { num: "2", title: "Đặt lịch rửa xe", desc: "Chọn dịch vụ và khung giờ phù hợp với bạn." },
  { num: "3", title: "Tích điểm & lên hạng", desc: "Mỗi lần rửa nhận điểm, đổi ưu đãi và thăng hạng." },
];

function SectionHeading({ eyebrow, title, left = false }: { eyebrow: string; title: string; left?: boolean }) {
  return (
    <div className={left ? "" : "text-center"}>
      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-cyan-400">{eyebrow}</span>
      <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-white">{title}</h2>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-slate-950 text-white">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute top-10 right-0 w-[420px] h-[420px] rounded-full bg-orange-500/10 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5">
              <Sparkles size={14} /> AutoWash Pro
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
              Rửa xe máy,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">
                đẳng cấp chuyên nghiệp.
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-400 max-w-md">
              Đặt lịch trước, tích điểm sau mỗi lần rửa và tận hưởng dịch vụ chăm sóc xe tỉ mỉ —
              chuẩn mực như dành cho siêu xe.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-lg bg-cyan-500 text-white font-semibold px-6 py-3 hover:bg-cyan-400 transition"
              >
                Bắt đầu ngay
              </Link>
              <a
                href="#services"
                className="rounded-lg border border-white/20 text-white font-semibold px-6 py-3 hover:bg-white/10 transition"
              >
                Xem dịch vụ
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-cyan-400" /> Đặt lịch online
              </span>
              <span className="flex items-center gap-2">
                <Star size={16} className="text-cyan-400" /> Tích điểm đổi quà
              </span>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 to-orange-500/20 blur-2xl rounded-3xl -z-10" />
            <Image
              src={posterOrange}
              alt="AutoWash Pro — chăm sóc xe cao cấp"
              placeholder="blur"
              priority
              className="w-full h-auto rounded-2xl shadow-2xl shadow-black/60 ring-1 ring-white/10"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.l}>
              <div className="text-3xl font-bold text-white">{s.n}</div>
              <div className="text-sm text-slate-400 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <SectionHeading eyebrow="Vì sao chọn chúng tôi" title="Trải nghiệm chăm sóc xe khác biệt" />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06] hover:-translate-y-1 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <f.Icon size={24} strokeWidth={1.9} />
              </div>
              <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-4 bg-cyan-500/10 blur-2xl rounded-3xl -z-10" />
            <Image
              src={posterGrid}
              alt="Bộ sưu tập chăm sóc xe"
              placeholder="blur"
              className="w-full h-auto rounded-2xl ring-1 ring-white/10 shadow-2xl shadow-black/60"
            />
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading eyebrow="Chuẩn mực" title="Tỉ mỉ đến từng chi tiết" left />
            <p className="mt-4 text-slate-400">
              Chúng tôi chăm sóc chiếc xe của bạn với sự tỉ mỉ và đam mê như dành cho những mẫu xe
              biểu tượng. Mỗi lần rửa là một lần chiếc xe của bạn được "tân trang".
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Quy trình rửa nhiều bước chuẩn hoá",
                "Sản phẩm chăm sóc cao cấp",
                "Đội ngũ tận tâm, đúng giờ",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="max-w-6xl mx-auto px-6 py-20">
        <SectionHeading eyebrow="Bảng giá" title="Dịch vụ & gói rửa" />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s) => (
            <div
              key={s.name}
              className={`relative rounded-2xl border p-6 ${
                s.popular ? "border-cyan-500/50 bg-cyan-500/[0.06]" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              {s.popular && (
                <span className="absolute -top-3 left-6 bg-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Phổ biến
                </span>
              )}
              <h3 className="font-semibold text-lg">{s.name}</h3>
              <div className="mt-3 text-2xl font-bold text-cyan-400">{s.price}</div>
              <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-1">
                <Clock size={15} /> {s.time}
              </div>
              <Link
                href="/register"
                className="mt-5 block text-center rounded-lg bg-white/5 border border-white/10 hover:bg-cyan-500 hover:border-cyan-500 text-white font-medium py-2 transition"
              >
                Đặt lịch
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section id="tiers" className="max-w-6xl mx-auto px-6 py-20">
        <SectionHeading eyebrow="Khách hàng thân thiết" title="Hạng thành viên" />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((t) => (
            <div key={t.name} className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
              <div className={`bg-gradient-to-br ${t.color} text-white p-6`}>
                <div className="text-xs uppercase tracking-[0.2em] opacity-90">Hạng</div>
                <div className="text-2xl font-bold">{t.name}</div>
              </div>
              <div className="p-6">
                <div className="text-sm text-slate-400">Đặt lịch trước</div>
                <div className="text-3xl font-bold text-white">
                  {t.days}
                  <span className="text-base font-medium text-slate-400"> ngày</span>
                </div>
                <p className="mt-3 text-sm text-slate-400">{t.perk}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <SectionHeading eyebrow="Đơn giản" title="Cách hoạt động" />
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-cyan-500 text-white text-xl font-bold flex items-center justify-center">
                  {s.num}
                </div>
                <h3 className="mt-4 font-semibold text-lg">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-400 max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 to-sky-600 p-12 text-center">
          <div className="absolute -top-16 -right-10 w-60 h-60 rounded-full bg-white/10 blur-2xl" />
          <h2 className="text-3xl md:text-4xl font-bold">Sẵn sàng cho chiếc xe sạch bóng?</h2>
          <p className="mt-3 text-white/85">Đăng ký miễn phí hôm nay để đặt lịch và bắt đầu tích điểm.</p>
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
