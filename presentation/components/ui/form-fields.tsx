import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

const CONTROL_CLASSES =
  "w-full rounded-sm border border-gold/20 bg-abyss/60 px-4 py-3 text-lg text-parchment placeholder:text-ash/60 placeholder:italic transition-colors focus:border-gold/70 focus:bg-wine/20 focus:outline-hidden aria-invalid:border-blood";

interface FieldShellProps {
  readonly id: string;
  readonly label: string;
  readonly hint?: ReactNode;
  readonly children: ReactNode;
}

function FieldShell({ id, label, hint, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-display text-xs tracking-[0.3em] text-gold/80 uppercase">
        {label}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-ash italic">
          {hint}
        </p>
      )}
    </div>
  );
}

type TextFieldProps = Omit<FieldShellProps, "children"> & InputHTMLAttributes<HTMLInputElement>;

export function TextField({ id, label, hint, ...inputProps }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint}>
      <input id={id} aria-describedby={hint ? `${id}-hint` : undefined} className={CONTROL_CLASSES} {...inputProps} />
    </FieldShell>
  );
}

type TextAreaFieldProps = Omit<FieldShellProps, "children"> & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaField({ id, label, hint, ...textAreaProps }: TextAreaFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint}>
      <textarea
        id={id}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={`${CONTROL_CLASSES} min-h-28 resize-y`}
        {...textAreaProps}
      />
    </FieldShell>
  );
}
