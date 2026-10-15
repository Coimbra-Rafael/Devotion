import { Check, Copy, ExternalLink, Link2 } from "lucide-react";

import { GildedButton, GildedButtonVariant } from "./gilded-button";

interface SecretLinkPanelProps {
  readonly secretLink: string;
  readonly hasCopied: boolean;
  readonly onCopy: () => void;
}

/** Purely presentational: displays the sealed link and its actions. */
export function SecretLinkPanel({ secretLink, hasCopied, onCopy }: SecretLinkPanelProps) {
  return (
    <section aria-label="Link secreto" className="ornate-panel animate-ember-rise border-gold/50 p-6 sm:p-8">
      <p className="flex items-center gap-2 font-display text-xs tracking-[0.3em] text-gold uppercase">
        <Link2 className="size-4" strokeWidth={1.5} />
        Carta selada
      </p>
      <p className="mt-2 text-base text-ash italic">
        Envie este link a quem você deseja. A carta vive apenas nele — nada é guardado em servidor algum.
      </p>
      <output className="mt-4 block truncate rounded-sm border border-gold/20 bg-abyss/70 px-4 py-3 font-mono text-sm text-gold-soft/80">
        {secretLink}
      </output>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <GildedButton variant={GildedButtonVariant.Ghost} onClick={onCopy} aria-live="polite">
          {hasCopied ? <Check className="size-4" strokeWidth={1.5} /> : <Copy className="size-4" strokeWidth={1.5} />}
          {hasCopied ? "Copiado" : "Copiar link"}
        </GildedButton>
        <a
          href={secretLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-sm border border-gold/70 bg-linear-to-b from-bordeaux to-wine px-5 py-3 font-display text-xs tracking-[0.25em] text-gold-soft uppercase transition-all hover:from-blood hover:to-bordeaux focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <ExternalLink className="size-4" strokeWidth={1.5} />
          Ver como destinatário
        </a>
      </div>
    </section>
  );
}
