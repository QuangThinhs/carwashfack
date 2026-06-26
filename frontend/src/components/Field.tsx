import { InputHTMLAttributes } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Field({ label, ...props }: FieldProps) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-slate-300 mb-1.5">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-white/10 bg-slate-800 px-4 py-2.5 text-white outline-none
                   transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30
                   placeholder:text-slate-500"
      />
    </label>
  );
}
