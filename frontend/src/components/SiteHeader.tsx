import Link from "next/link";
import Logo from "@/components/Logo";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-cyan-600">
          <Logo className="text-xl" size={22} />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#services" className="hover:text-cyan-600 transition">Dịch vụ</a>
          <a href="#tiers" className="hover:text-cyan-600 transition">Thành viên</a>
          <a href="#how" className="hover:text-cyan-600 transition">Cách hoạt động</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 text-white px-4 py-2 hover:opacity-95 transition"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </header>
  );
}
