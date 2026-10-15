"use client";

import { KeyRound, LoaderCircle, Sparkles } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";

import { findWhisperVibeById, WHISPER_VIBE_CATALOG } from "@/domain/catalogs/whisper-vibe-catalog";
import {
  DEVOTION_CARD_LIMITS,
  type DevotionCard,
  type GenerateWhisperRequestDto,
} from "@/domain/entities/devotion-card";
import type { IGeminiService } from "@/domain/services/gemini-service.interface";
import { TextAreaField, TextField } from "@/presentation/components/ui/form-fields";
import { GildedButton } from "@/presentation/components/ui/gilded-button";
import { SecretLinkPanel } from "@/presentation/components/ui/secret-link-panel";
import { VibeSelector } from "@/presentation/components/ui/vibe-selector";
import { WhisperPreview } from "@/presentation/components/ui/whisper-preview";
import { type DevotionCardDraft, useDevotionCardDraft } from "@/presentation/hooks/use-devotion-card-draft";
import { useGenerateWhisper } from "@/presentation/hooks/use-generate-whisper";
import { useSecretLink } from "@/presentation/hooks/use-secret-link";
import { useDevotionServices } from "@/presentation/providers/devotion-services-context";

const toGenerateWhisperRequest = (draft: DevotionCardDraft): GenerateWhisperRequestDto | null => {
  const vibe = findWhisperVibeById(draft.vibeId);
  if (!vibe) return null;
  return {
    vibe,
    recipientName: draft.recipientName.trim(),
    senderName: draft.senderName.trim(),
    inspiration: draft.inspiration.trim() || undefined,
  };
};

const composeDevotionCard = (
  draft: DevotionCardDraft,
  whisper: string,
  spotifyTrackId: string | undefined,
): DevotionCard => ({
  recipientName: draft.recipientName.trim(),
  senderName: draft.senderName.trim(),
  whisper,
  vibeId: draft.vibeId,
  spotifyTrackId,
});

/** Container: owns creation-flow state and orchestrates services via hooks. */
export function DevotionGeneratorContainer() {
  const { createWhisperService, cardEncoder, defaultApiKey } = useDevotionServices();
  const [apiKey, setApiKey] = useState(defaultApiKey);

  const whisperService = useMemo<IGeminiService | null>(
    () => (apiKey.trim() ? createWhisperService(apiKey.trim()) : null),
    [apiKey, createWhisperService],
  );

  const { draft, updateField, selectVibe, spotifyTrackId, hasInvalidSpotifyLink, hasRequiredNames } =
    useDevotionCardDraft();
  const { data: whisper, error, isLoading, generateWhisper } = useGenerateWhisper(whisperService);
  const { secretLink, hasCopied, sealCard, copySecretLink, discardSecretLink } = useSecretLink(cardEncoder);

  const canGenerate = hasRequiredNames && !hasInvalidSpotifyLink && !isLoading;

  const handleGenerate = () => {
    const request = toGenerateWhisperRequest(draft);
    if (!request) return;
    discardSecretLink();
    void generateWhisper(request);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canGenerate) handleGenerate();
  };

  const handleSeal = () => {
    if (whisper) sealCard(composeDevotionCard(draft, whisper, spotifyTrackId));
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <form onSubmit={handleSubmit} className="ornate-panel flex flex-col gap-6 p-6 sm:p-8" noValidate>
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            id="recipient-name"
            label="Para"
            placeholder="Nome de quem receberá"
            value={draft.recipientName}
            maxLength={DEVOTION_CARD_LIMITS.maxNameLength}
            onChange={(event) => updateField("recipientName", event.target.value)}
            required
          />
          <TextField
            id="sender-name"
            label="De"
            placeholder="Sua assinatura"
            value={draft.senderName}
            maxLength={DEVOTION_CARD_LIMITS.maxNameLength}
            onChange={(event) => updateField("senderName", event.target.value)}
            required
          />
        </div>

        <VibeSelector vibes={WHISPER_VIBE_CATALOG} selectedVibeId={draft.vibeId} onSelect={selectVibe} />

        <TextAreaField
          id="inspiration"
          label="Inspiração (opcional)"
          placeholder="Uma lembrança, um lugar, um detalhe que só vocês conhecem…"
          value={draft.inspiration}
          maxLength={DEVOTION_CARD_LIMITS.maxInspirationLength}
          onChange={(event) => updateField("inspiration", event.target.value)}
          hint={`${draft.inspiration.length}/${DEVOTION_CARD_LIMITS.maxInspirationLength}`}
        />

        <TextField
          id="spotify-link"
          label="Trilha sonora (opcional)"
          placeholder="https://open.spotify.com/track/…"
          inputMode="url"
          value={draft.spotifyLink}
          onChange={(event) => updateField("spotifyLink", event.target.value)}
          aria-invalid={hasInvalidSpotifyLink}
          hint={hasInvalidSpotifyLink ? "Cole o link de uma faixa do Spotify (Compartilhar → Copiar link)." : undefined}
        />

        <ApiKeyField apiKey={apiKey} hasDefaultApiKey={Boolean(defaultApiKey)} onChange={setApiKey} />

        {error && (
          <p role="alert" className="rounded-sm border border-blood/60 bg-wine/40 px-4 py-3 text-base text-parchment">
            {error}
          </p>
        )}

        <GildedButton type="submit" disabled={!canGenerate} className="self-stretch sm:self-end">
          {isLoading ? (
            <LoaderCircle className="size-4 animate-spin" strokeWidth={1.5} />
          ) : (
            <Sparkles className="size-4" strokeWidth={1.5} />
          )}
          {isLoading ? "Invocando…" : "Invocar sussurro"}
        </GildedButton>
      </form>

      {whisper && (
        <WhisperPreview whisper={whisper} isRegenerating={isLoading} onRegenerate={handleGenerate} onSeal={handleSeal} />
      )}

      {secretLink && <SecretLinkPanel secretLink={secretLink} hasCopied={hasCopied} onCopy={copySecretLink} />}
    </div>
  );
}

interface ApiKeyFieldProps {
  readonly apiKey: string;
  readonly hasDefaultApiKey: boolean;
  readonly onChange: (apiKey: string) => void;
}

function ApiKeyField({ apiKey, hasDefaultApiKey, onChange }: ApiKeyFieldProps) {
  return (
    <details className="group rounded-sm border border-gold/15 bg-abyss/40 px-4 py-3" open={!hasDefaultApiKey}>
      <summary className="flex cursor-pointer list-none items-center gap-2 font-display text-xs tracking-[0.3em] text-gold/70 uppercase">
        <KeyRound className="size-4" strokeWidth={1.5} />
        Chave do Gemini
        <span className="ml-auto text-[0.65rem] tracking-widest text-ash normal-case italic">
          {hasDefaultApiKey ? "configurada no ambiente" : "obrigatória"}
        </span>
      </summary>
      <div className="mt-4">
        <TextField
          id="gemini-api-key"
          label="API Key"
          type="password"
          autoComplete="off"
          spellCheck={false}
          placeholder="Cole sua chave do Google AI Studio"
          value={apiKey}
          onChange={(event) => onChange(event.target.value)}
          hint="A chave fica apenas na memória desta aba e é enviada somente ao Gemini."
        />
      </div>
    </details>
  );
}
