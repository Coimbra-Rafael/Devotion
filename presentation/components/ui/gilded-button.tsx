import type { ButtonHTMLAttributes } from "react";

export enum GildedButtonVariant {
  Primary = "primary",
  Ghost = "ghost",
}

const VARIANT_CLASSES: Record<GildedButtonVariant, string> = {
  [GildedButtonVariant.Primary]:
    "border-gold/70 bg-linear-to-b from-bordeaux to-wine text-gold-soft shadow-[0_0_30px_-8px] shadow-blood hover:from-blood hover:to-bordeaux",
  [GildedButtonVariant.Ghost]: "border-gold/25 bg-transparent text-gold/90 hover:border-gold/60 hover:bg-wine/30",
};

interface GildedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: GildedButtonVariant;
}

export function GildedButton({
  variant = GildedButtonVariant.Primary,
  className = "",
  type = "button",
  ...buttonProps
}: GildedButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-sm border px-5 py-3 font-display text-xs tracking-[0.25em] uppercase transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${className}`}
      {...buttonProps}
    />
  );
}
