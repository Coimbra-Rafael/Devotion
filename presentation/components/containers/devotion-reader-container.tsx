"use client";

import { Music2, PenLine } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { findWhisperVibeById } from "@/domain/catalogs/whisper-vibe-catalog";
import type { DevotionCard } from "@/domain/entities/devotion-card";
import { BurnAfterReadingCard } from "@/presentation/components/ui/burn-after-reading-card";
import { SpotifyPlayer } from "@/presentation/components/ui/spotify-player";
import { useBurnAfterReading } from "@/presentation/hooks/use-burn-after-reading";
import { useDevotionServices } from "@/presentation/providers/devotion-services-context";

const UNKNOWN_VIBE_LABEL = "Devotion";

interface DevotionReaderContainerProps {
  readonly encodedCard: string;
}

/** Container: decodes the secret link and drives the burn-after-reading flow. */
export function DevotionReaderContainer({ encodedCard }: DevotionReaderContainerProps) {
  const { cardEncoder } = useDevotionServices();
  const card = useMemo(() => cardEncoder.decode(encodedCard), [cardEncoder, encodedCard]);

  return card ? <RevealableCard card={card} /> : <BrokenSealNotice />;
}

function RevealableCard({ card }: { readonly card: DevotionCard }) {
  const { isRevealed, isHolding, hasBeenRevealed, holdDurationMs, bindings } = useBurnAfterReading();
  const vibeLabel = findWhisperVibeById(card.vibeId)?.label ?? UNKNOWN_VIBE_LABEL;
  const shouldPlaySoundtrack = hasBeenRevealed && Boolean(card.spotifyTrackId);

  return (
    <div className="flex w-full flex-col gap-6">
      <BurnAfterReadingCard
        recipientName={card.recipientName}
        senderName={card.senderName}
        whisper={card.whisper}
        vibeLabel={vibeLabel}
        isRevealed={isRevealed}
        isHolding={isHolding}
        holdDurationMs={holdDurationMs}
        revealBindings={bindings}
      />

      {card.spotifyTrackId && !hasBeenRevealed && (
        <p className="flex items-center justify-center gap-2 text-base text-ash italic">
          <Music2 className="size-4 text-gold/60" strokeWidth={1.5} />
          Há uma trilha sonora esperando ser despertada.
        </p>
      )}

      {shouldPlaySoundtrack && card.spotifyTrackId && (
        <SpotifyPlayer trackId={card.spotifyTrackId} className="animate-ember-rise" />
      )}

      <WriteYourOwnLink />
    </div>
  );
}

function BrokenSealNotice() {
  return (
    <div className="ornate-panel flex flex-col items-center gap-4 p-8 text-center" role="alert">
      <h2 className="font-display text-xl text-gilded">O selo foi rompido</h2>
      <p className="text-lg text-ash italic">Este link está incompleto ou foi alterado. Peça a quem o enviou um novo link.</p>
      <WriteYourOwnLink />
    </div>
  );
}

function WriteYourOwnLink() {
  return (
    <Link
      href="/"
      className="mx-auto inline-flex items-center gap-2 font-display text-xs tracking-[0.3em] text-gold/70 uppercase transition-colors hover:text-gold"
    >
      <PenLine className="size-4" strokeWidth={1.5} />
      Escrever a sua carta
    </Link>
  );
}
