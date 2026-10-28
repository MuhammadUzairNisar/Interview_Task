import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

// text-base on mobile prevents iOS zoom-on-focus; text-sm from sm: up.
export const controlClass =
  "w-full rounded-lg border border-border-strong bg-card px-3 text-base text-foreground placeholder:text-subtle transition-[border-color,box-shadow] duration-200 focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15 aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:ring-destructive/15 sm:text-sm";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function Field({ id, label, error, hint, required, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive" aria-hidden>*</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-subtle">{hint}</p>
      )}
    </div>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${controlClass} h-10 ${props.className ?? ""}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${controlClass} min-h-24 resize-y py-2 ${props.className ?? ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${controlClass} h-10 cursor-pointer ${props.className ?? ""}`} />;
}
