import type { ReactNode } from 'react';

const inputCls =
  'w-full rounded-md border border-line bg-bg px-3 py-2 text-[14px] text-[#E7EEF0] outline-none focus:border-tech';

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-500 text-tech">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[11px] text-tech/70">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ''}`} />;
}

export function NumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input inputMode="decimal" {...props} className={`num ${inputCls} ${props.className ?? ''}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputCls} ${props.className ?? ''}`} />;
}

export function Button({
  variant = 'ghost',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  const base = 'rounded-md px-3 py-1.5 text-[13px] font-500 transition-colors disabled:opacity-40';
  const styles = {
    primary: 'bg-tech text-bg hover:bg-tech/90',
    ghost: 'border border-line text-tech hover:bg-line hover:text-[#E7EEF0]',
    danger: 'border border-deviation/50 text-deviation hover:bg-deviation/10',
  } as const;
  return <button {...props} className={`${base} ${styles[variant]} ${props.className ?? ''}`} />;
}
