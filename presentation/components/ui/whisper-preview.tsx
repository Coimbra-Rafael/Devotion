import { Lock, RefreshCw } from "lucide-react";

import { GildedButton, GildedButtonVariant } from "./gilded-button";

interface WhisperPreviewProps {
  readonly whisper: string;
  readonly isRegenerating: boolean;
  readonly onRegenerate: () => void;
  readonly onSeal: () => void;
}

/** Purely presentational preview of the generated whisper. */
export function WhisperPreview({ whisper, isRegenerating, onRegenerate, onSeal }: WhisperPreviewProps) {
  return (
    <section aria-label="Prévia do sussurro" className="ornate-panel animate-ember-rise p-6 sm:p-8">
      <p className="font-display text-xs tracking-[0.3em] text-gold/70 uppercase">O sussurro invocado</p>
      <p className="mt-4 text-lg leading-relaxed whitespace-pre-line text-parchment/95 italic sm:text-xl">{whisper}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <GildedButton variant={GildedButtonVariant.Ghost} onClick={onRegenerate} disabled={isRegenerating}>
          <RefreshCw className={`size-4 ${isRegenerating ? "animate-spin" : ""}`} strokeWidth={1.5} />
          Reescrever
        </GildedButton>
        <GildedButton onClick={onSeal} disabled={isRegenerating}>
          <Lock className="size-4" strokeWidth={1.5} />
          Selar e gerar link secreto
        </GildedButton>
      </div>
    </section>
  );
}
