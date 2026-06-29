"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "error" | "success" | "info";
interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const ToastCtx = createContext<(message: string, type?: ToastType) => void>(() => {});

export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const remove = useCallback((id: number) => setItems((cur) => cur.filter((t) => t.id !== id)), []);

  const push = useCallback(
    (message: string, type: ToastType = "error") => {
      const id = ++counter.current;
      setItems((cur) => [...cur, { id, message, type }]);
      setTimeout(() => remove(id), 3800);
    },
    [remove],
  );

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-[min(92vw,360px)]">
        {items.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 shadow-lg backdrop-blur animate-in ${
              t.type === "success"
                ? "bg-green-500/15 border-green-500/30 text-green-200"
                : t.type === "info"
                  ? "bg-slate-700/90 border-white/10 text-slate-100"
                  : "bg-red-500/15 border-red-500/30 text-red-200"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle size={18} className="mt-0.5 shrink-0" />
            ) : t.type === "info" ? (
              <Info size={18} className="mt-0.5 shrink-0" />
            ) : (
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
            )}
            <span className="text-sm flex-1">{t.message}</span>
            <button onClick={() => remove(t.id)} className="opacity-60 hover:opacity-100 transition">
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
