// Minimal, styling-only helpers shared across admin pages. No business logic.
import type { InputHTMLAttributes, TextareaHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-400">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-neutral-500">{hint}</span>}
    </label>
  );
}

const inputBase =
  "w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none transition focus:border-teal-400 focus:ring-1 focus:ring-teal-400";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={3} {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function Button({
  variant = "primary",
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  const styles =
    variant === "primary"
      ? "bg-teal-500 text-neutral-950 hover:bg-teal-400"
      : variant === "danger"
      ? "border border-red-500/40 text-red-300 hover:bg-red-500/10"
      : "border border-neutral-700 text-neutral-200 hover:border-neutral-500 hover:text-white";
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
    />
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-lg border border-neutral-800 bg-neutral-900/60 ${className}`}
    >
      {children}
    </div>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="mb-4 flex flex-wrap items-center gap-2">{children}</div>;
}
