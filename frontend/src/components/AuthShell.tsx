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
    <div className="min-h-screen flex">
      {/* Ben trai: thuong hieu (chi hien tren man hinh lon) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600
                      text-white p-12 flex-col justify-between">
        <Link href="/">
          <Logo className="text-2xl" size={26} />
        </Link>
        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Rửa xe thông minh,
            <br /> tích điểm thả ga.
          </h1>
          <p className="mt-4 text-white/80 max-w-md">
            Đặt lịch trước, tích điểm sau mỗi lần rửa và tận hưởng ưu đãi theo hạng thành viên
            Member · Silver · Gold · Platinum.
          </p>
        </div>
        <p className="text-white/60 text-sm">© 2026 AutoWash Pro · UTH</p>
      </div>

      {/* Ben phai: form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center text-cyan-600">
            <Logo className="text-2xl" size={26} />
          </div>
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8">
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
            <p className="text-slate-500 mt-1 mb-6">{subtitle}</p>
            {children}
          </div>
          <div className="text-center text-sm text-slate-500 mt-6">{footer}</div>
        </div>
      </div>
    </div>
  );
}
