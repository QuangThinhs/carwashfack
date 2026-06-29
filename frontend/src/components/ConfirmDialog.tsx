"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmCtx = createContext<ConfirmFn>(async () => false);

export const useConfirm = () => useContext(ConfirmCtx);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((v: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((o) => {
    setOpts(o);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  function close(value: boolean) {
    setOpts(null);
    resolver.current?.(value);
    resolver.current = null;
  }

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      {opts && (
        <div
          className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4"
          onClick={() => close(false)}
        >
          <div
            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-1">{opts.title ?? "Xác nhận"}</h3>
            <p className="text-slate-300 text-sm">{opts.message}</p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => close(false)}
                className="flex-1 rounded-lg border border-white/15 text-slate-300 font-medium py-2.5 hover:bg-white/5 transition"
              >
                {opts.cancelText ?? "Huỷ"}
              </button>
              <button
                onClick={() => close(true)}
                className={`flex-1 rounded-lg text-white font-semibold py-2.5 transition ${
                  opts.danger ? "bg-red-500 hover:bg-red-400" : "bg-cyan-500 hover:bg-cyan-400"
                }`}
              >
                {opts.confirmText ?? "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmCtx.Provider>
  );
}
