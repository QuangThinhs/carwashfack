import Link from "next/link";
import { ReactNode } from "react";
import Logo from "@/components/Logo";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen flex bg-slate-950 text-white">
      {/* Ben trai: thuong hieu (chi hien tren man hinh lon) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 border-r border-white/10 p-12 flex-col justify-between">
        <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute bottom-0 -right-10 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl" />

        <Link href="/" className="relative text-white">
          <Logo className="text-2xl" size={26} />
        </Link>
        <div className="relative">
          <h1 className="text-4xl font-bold leading-tight">
            Rửa xe thông minh,
            <br /> tích điểm thả ga.
          </h1>
          <p className="mt-4 text-slate-400 max-w-md">
            Đặt lịch trước, tích điểm sau mỗi lần rửa và tận hưởng ưu đãi theo hạng thành viên
            Member · Silver · Gold · Platinum.
          </p>
        </div>
        <p className="relative text-slate-500 text-sm">© 2026 AutoWash Pro · UTH</p>
      </div>

      {/* Ben phai: form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center text-white">
            <Logo className="text-2xl" size={26} />
          </div>
          <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-8">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="text-slate-400 mt-1 mb-6">{subtitle}</p>
            {children}
          </div>
          <div className="text-center text-sm text-slate-400 mt-6">{footer}</div>
        </div>
      </div>
    </div>
  );
}
