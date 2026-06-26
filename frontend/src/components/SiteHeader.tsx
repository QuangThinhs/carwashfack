import Link from "next/link";
import Logo from "@/components/Logo";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-white">
          <Logo className="text-xl" size={22} />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#services" className="hover:text-white transition">Dịch vụ</a>
          <a href="#tiers" className="hover:text-white transition">Thành viên</a>
          <a href="#how" className="hover:text-white transition">Cách hoạt động</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-300 hover:text-white transition"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold rounded-lg bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-400 transition"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </header>
  );
}
