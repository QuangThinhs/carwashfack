import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import Logo from "@/components/Logo";

export default function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <Logo className="text-xl text-white" size={22} />
          <p className="mt-3 text-sm text-slate-400 max-w-xs">
            Hệ thống rửa xe máy thông minh — đặt lịch trước &amp; tích điểm thành viên.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Liên kết</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#services" className="hover:text-cyan-400 transition">Dịch vụ</a></li>
            <li><a href="#tiers" className="hover:text-cyan-400 transition">Hạng thành viên</a></li>
            <li><Link href="/register" className="hover:text-cyan-400 transition">Đăng ký</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Liên hệ</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li className="flex items-center gap-2"><MapPin size={16} /> UTH</li>
            <li className="flex items-center gap-2"><Phone size={16} /> 0900 000 000</li>
            <li className="flex items-center gap-2"><Mail size={16} /> support@autowashpro.vn</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-5 text-center text-sm text-slate-500">
        © 2026 AutoWash Pro · SU26SWP01 · UTH
      </div>
    </footer>
  );
}
