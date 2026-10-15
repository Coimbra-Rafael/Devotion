export enum WhisperGenerationFailureReason {
  MissingApiKey = "missing-api-key",
  InvalidApiKey = "invalid-api-key",
  RateLimited = "rate-limited",
  QuotaExhausted = "quota-exhausted",
  ServiceUnavailable = "service-unavailable",
  BlockedBySafety = "blocked-by-safety",
  EmptyResponse = "empty-response",
  Unknown = "unknown",
}

/** Provider-agnostic error so the UI never handles SDK-specific errors. */
export class WhisperGenerationError extends Error {
  constructor(
    readonly reason: WhisperGenerationFailureReason,
    message: string,
  ) {
    super(message);
    this.name = "WhisperGenerationError";
  }
}
