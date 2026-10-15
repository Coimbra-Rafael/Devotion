import { Flame, Hand } from "lucide-react";

import type { BurnAfterReadingBindings } from "@/presentation/hooks/use-burn-after-reading";

interface BurnAfterReadingCardProps {
  readonly recipientName: string;
  readonly senderName: string;
  readonly whisper: string;
  readonly vibeLabel: string;
  readonly isRevealed: boolean;
  readonly isHolding: boolean;
  readonly holdDurationMs: number;
  readonly revealBindings: BurnAfterReadingBindings;
}

/** Purely presentational: the veiled letter with blur/mist effect. */
export function BurnAfterReadingCard({
  recipientName,
  senderName,
  whisper,
  vibeLabel,
  isRevealed,
  isHolding,
  holdDurationMs,
  revealBindings,
}: BurnAfterReadingCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      aria-pressed={isRevealed}
      aria-label={isRevealed ? "Carta revelada. Solte para velar novamente." : "Mantenha pressionado para revelar a carta."}
      className="ornate-panel relative w-full cursor-pointer touch-none overflow-hidden select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      {...revealBindings}
    >
      <CardHeader recipientName={recipientName} vibeLabel={vibeLabel} />

      <div
        className={`px-6 pb-8 transition-[filter,opacity] duration-700 ease-out sm:px-10 ${
          isRevealed ? "opacity-100 blur-none" : "opacity-60 blur-lg"
        }`}
      >
        <p className="text-lg leading-relaxed whitespace-pre-line text-parchment/95 italic sm:text-xl">{whisper}</p>
        <p className="mt-6 text-right font-display text-sm tracking-[0.25em] text-gold uppercase">— {senderName}</p>
      </div>

      <MistVeil isRevealed={isRevealed} isHolding={isHolding} holdDurationMs={holdDurationMs} />
    </article>
  );
}

function CardHeader({ recipientName, vibeLabel }: { recipientName: string; vibeLabel: string }) {
  return (
    <header className="px-6 pt-8 pb-6 text-center sm:px-10">
      <p className="font-display text-xs tracking-[0.35em] text-gold/70 uppercase">{vibeLabel}</p>
      <h2 className="mt-3 font-display text-2xl text-gilded sm:text-3xl">Para {recipientName}</h2>
      <div className="mx-auto mt-4 h-px w-24 bg-linear-to-r from-transparent via-gold/60 to-transparent" />
    </header>
  );
}

interface MistVeilProps {
  readonly isRevealed: boolean;
  readonly isHolding: boolean;
  readonly holdDurationMs: number;
}

function MistVeil({ isRevealed, isHolding, holdDurationMs }: MistVeilProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 transition-opacity duration-700 ${
        isRevealed ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute -inset-1/4 animate-mist-drift bg-[radial-gradient(ellipse_at_center,--theme(--color-wine/55%),transparent_65%)]" />
      <div className="absolute inset-0 bg-linear-to-b from-abyss/30 via-transparent to-abyss/50" />

      <Flame className="relative size-8 animate-candle-flicker text-gold" strokeWidth={1.25} />
      <p className="relative flex items-center gap-2 font-display text-xs tracking-[0.3em] text-gold-soft uppercase">
        <Hand className="size-4" strokeWidth={1.5} />
        Mantenha pressionado para revelar
      </p>

      <div className="relative h-px w-40 overflow-hidden bg-gold/15">
        <div
          className={`h-full bg-gold ease-linear ${isHolding ? "w-full transition-[width]" : "w-0"}`}
          style={{ transitionDuration: `${holdDurationMs}ms` }}
        />
      </div>
    </div>
  );
}
