"use client";

import { useCallback, useMemo, useState } from "react";

import { DEFAULT_WHISPER_VIBE_ID } from "@/domain/catalogs/whisper-vibe-catalog";
import type { WhisperVibeId } from "@/domain/entities/devotion-card";
import { extractSpotifyTrackId } from "@/domain/entities/spotify-track";

export interface DevotionCardDraft {
  readonly recipientName: string;
  readonly senderName: string;
  readonly inspiration: string;
  readonly spotifyLink: string;
  readonly vibeId: WhisperVibeId;
}

export type DevotionCardDraftField = Exclude<keyof DevotionCardDraft, "vibeId">;

const EMPTY_DRAFT: DevotionCardDraft = {
  recipientName: "",
  senderName: "",
  inspiration: "",
  spotifyLink: "",
  vibeId: DEFAULT_WHISPER_VIBE_ID,
};

/** Holds the form state of the card being composed and its derived values. */
export const useDevotionCardDraft = () => {
  const [draft, setDraft] = useState<DevotionCardDraft>(EMPTY_DRAFT);

  const updateField = useCallback((field: DevotionCardDraftField, value: string) => {
    setDraft((previous) => ({ ...previous, [field]: value }));
  }, []);

  const selectVibe = useCallback((vibeId: WhisperVibeId) => {
    setDraft((previous) => ({ ...previous, vibeId }));
  }, []);

  const spotifyTrackId = useMemo(() => extractSpotifyTrackId(draft.spotifyLink), [draft.spotifyLink]);
  const hasInvalidSpotifyLink = draft.spotifyLink.trim().length > 0 && !spotifyTrackId;
  const hasRequiredNames = draft.recipientName.trim().length > 0 && draft.senderName.trim().length > 0;

  return { draft, updateField, selectVibe, spotifyTrackId, hasInvalidSpotifyLink, hasRequiredNames };
};
