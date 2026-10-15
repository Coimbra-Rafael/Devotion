/**
 * Contract for turning a payload into a URL-safe token and back.
 * Generic so new payloads or encoding strategies don't touch the core (OCP).
 */
export interface IUrlEncoderService<TPayload> {
  encode(payload: TPayload): string;
  /** Returns null when the token is malformed or fails validation. */
  decode(token: string): TPayload | null;
}
