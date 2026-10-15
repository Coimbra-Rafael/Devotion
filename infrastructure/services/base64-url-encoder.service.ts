import type { IUrlEncoderService } from "@/domain/services/url-encoder-service.interface";

const BASE64_PADDING_PATTERN = /=+$/;
const BASE64_BLOCK_SIZE = 4;
const BASE64_PADDING_CHAR = "=";

/** Standard → URL-safe alphabet (RFC 4648 §5). */
const toBase64Url = (base64: string): string =>
  base64.replaceAll("+", "-").replaceAll("/", "_").replace(BASE64_PADDING_PATTERN, "");

const fromBase64Url = (base64Url: string): string => {
  const base64 = base64Url.replaceAll("-", "+").replaceAll("_", "/");
  const paddingLength = (BASE64_BLOCK_SIZE - (base64.length % BASE64_BLOCK_SIZE)) % BASE64_BLOCK_SIZE;
  return base64 + BASE64_PADDING_CHAR.repeat(paddingLength);
};

/** UTF-8 safe (accents, emojis) and runtime-agnostic (browser and Node). */
const utf8ToBase64 = (text: string): string => {
  const bytes = new TextEncoder().encode(text);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary);
};

const base64ToUtf8 = (base64: string): string => {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
};

/**
 * Ephemeral, stateless encoding: the whole payload lives in the URL, so no
 * database or backend is needed. NOTE: Base64 is encoding, not encryption —
 * anyone holding the link can read its content.
 */
export class Base64UrlEncoderService<TPayload> implements IUrlEncoderService<TPayload> {
  constructor(private readonly isValidPayload: (value: unknown) => value is TPayload) {}

  encode(payload: TPayload): string {
    return toBase64Url(utf8ToBase64(JSON.stringify(payload)));
  }

  decode(token: string): TPayload | null {
    try {
      const parsed: unknown = JSON.parse(base64ToUtf8(fromBase64Url(token)));
      return this.isValidPayload(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
}
