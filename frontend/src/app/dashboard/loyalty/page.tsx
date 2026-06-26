"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Crown } from "lucide-react";
import { getUser, type AuthUser } from "@/lib/auth";
import { getLoyalty, getPointHistory, type LoyaltySummary, type PointHistory } from "@/services/loyalty";
import { fmtPrice, fmtTime } from "@/services/booking";
import CustomerTopbar from "@/components/CustomerTopbar";

export default function LoyaltyPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [summary, setSummary] = useState<LoyaltySummary | null>(null);
  const [history, setHistory] = useState<PointHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
    Promise.all([getLoyalty(), getPointHistory()])
      .then(([s, h]) => {
        setSummary(s);
        setHistory(h);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <CustomerTopbar user={user} />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-cyan-400 transition mb-5"
        >
          <ArrowLeft size={16} /> Quay lại
        </Link>

        <h1 className="text-2xl font-bold text-white">Điểm thưởng</h1>
        <p className="text-slate-400 mt-1 mb-6">Tích điểm sau mỗi lần rửa và lên hạng để nhận ưu đãi.</p>

        {loading || !summary ? (
          <p className="text-slate-500">Đang tải...</p>
        ) : (
          <>
            {/* The hang + diem */}
            <div className="bg-gradient-to-br from-cyan-500 to-sky-600 text-white rounded-2xl p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Crown size={18} />
                    <span className="text-sm uppercase tracking-wide">Hạng thành viên</span>
                  </div>
                  <div className="text-3xl font-bold mt-1">{summary.tierLabel}</div>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-sm">Điểm tích lũy</p>
                  <p className="text-4xl font-bold">{summary.pointsBalance}</p>
                </div>
              </div>

              {summary.nextTierLabel ? (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-white/85 mb-1.5">
                    <span>Tiến độ lên hạng {summary.nextTierLabel}</span>
                    <span>{summary.progressPercent}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/25 overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${summary.progressPercent}%` }}
                    />
                  </div>
                  <p className="text-white/80 text-sm mt-2">
                    Còn <b>{fmtPrice(summary.spendToNextTier)}</b> chi tiêu để lên hạng {summary.nextTierLabel}
                  </p>
                </div>
              ) : (
                <p className="mt-6 text-white/85 text-sm">Bạn đang ở hạng cao nhất 🎉</p>
              )}
            </div>

            {/* Thong ke */}
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
                <p className="text-sm text-slate-400">Tổng chi tiêu</p>
                <p className="text-xl font-bold text-white mt-1">{fmtPrice(summary.lifetimeSpend)}</p>
              </div>
              <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
                <p className="text-sm text-slate-400">Số lần rửa</p>
                <p className="text-xl font-bold text-white mt-1">{summary.visitCount}</p>
              </div>
              <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
                <p className="text-sm text-slate-400">Ưu đãi hạng</p>
                <p className="text-xl font-bold text-white mt-1">Giảm {summary.discountPercent}%</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 mt-4">
              Đặc quyền hạng <b className="text-slate-200">{summary.tierLabel}</b>: đặt lịch trước tối đa{" "}
              <b className="text-slate-200">{summary.bookingWindowDays} ngày</b>, giảm{" "}
              <b className="text-slate-200">{summary.discountPercent}%</b> dịch vụ.
            </p>

            {/* Lich su diem */}
            <h2 className="text-lg font-bold text-white mt-8 mb-3">Lịch sử điểm</h2>
            {history.length === 0 ? (
              <div className="bg-slate-900/50 rounded-2xl border border-dashed border-white/15 p-10 text-center text-slate-400">
                Chưa có giao dịch điểm nào. Hoàn tất một lần rửa để bắt đầu tích điểm!
              </div>
            ) : (
              <div className="bg-slate-900 border border-white/10 rounded-2xl divide-y divide-white/10">
                {history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between p-4">
                    <div className="min-w-0">
                      <p className="text-white truncate">{h.description || h.type}</p>
                      <p className="text-xs text-slate-500">{fmtTime(h.createdAt)}</p>
                    </div>
                    <span
                      className={`font-bold shrink-0 ${h.points >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {h.points >= 0 ? "+" : ""}
                      {h.points} điểm
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
