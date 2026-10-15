/**
 * Domain entities for Devotion.
 * Pure TypeScript — no React, Next.js or third-party dependencies.
 */

export enum WhisperVibeId {
  ForbiddenDevotion = "forbidden-devotion",
  MidnightConfession = "midnight-confession",
  VelvetObsession = "velvet-obsession",
  GothicVows = "gothic-vows",
}

export interface WhisperVibe {
  readonly id: WhisperVibeId;
  readonly label: string;
  readonly tagline: string;
  /** Creative direction appended to the generation prompt for this vibe. */
  readonly promptDirective: string;
}

export interface DevotionCard {
  readonly recipientName: string;
  readonly senderName: string;
  readonly whisper: string;
  readonly vibeId: WhisperVibeId;
  readonly spotifyTrackId?: string;
}

export const DEVOTION_CARD_LIMITS = {
  maxNameLength: 40,
  maxInspirationLength: 800,
  maxWhisperLength: 1200,
} as const;

/** Input required to generate a whisper. */
export interface GenerateWhisperRequestDto {
  readonly vibe: WhisperVibe;
  readonly recipientName: string;
  readonly senderName: string;
  readonly inspiration?: string;
}

/** Output of a whisper generation. */
export interface GenerateWhisperResponseDto {
  readonly whisper: string;
}

const isNonEmptyStringWithin = (value: unknown, maxLength: number): value is string =>
  typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;

const isWhisperVibeId = (value: unknown): value is WhisperVibeId =>
  Object.values(WhisperVibeId).includes(value as WhisperVibeId);

const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || typeof value === "string";

/** Type guard used to validate untrusted payloads (e.g. decoded from a URL). */
export const isDevotionCard = (value: unknown): value is DevotionCard => {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;

  return (
    isNonEmptyStringWithin(candidate.recipientName, DEVOTION_CARD_LIMITS.maxNameLength) &&
    isNonEmptyStringWithin(candidate.senderName, DEVOTION_CARD_LIMITS.maxNameLength) &&
    isNonEmptyStringWithin(candidate.whisper, DEVOTION_CARD_LIMITS.maxWhisperLength) &&
    isWhisperVibeId(candidate.vibeId) &&
    isOptionalString(candidate.spotifyTrackId)
  );
};
