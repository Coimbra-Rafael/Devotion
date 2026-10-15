const SPOTIFY_TRACK_ID_PATTERN = /^[A-Za-z0-9]{22}$/;
const SPOTIFY_TRACK_URL_PATTERN = /open\.spotify\.com\/(?:intl-[a-z-]+\/)?track\/([A-Za-z0-9]{22})/;
const SPOTIFY_TRACK_URI_PATTERN = /^spotify:track:([A-Za-z0-9]{22})$/;

export const isSpotifyTrackId = (value: string): boolean => SPOTIFY_TRACK_ID_PATTERN.test(value);

/**
 * Accepts a share link (https://open.spotify.com/track/...), a URI
 * (spotify:track:...) or a raw id. Returns undefined when nothing matches.
 */
export const extractSpotifyTrackId = (input: string): string | undefined => {
  const trimmedInput = input.trim();
  if (isSpotifyTrackId(trimmedInput)) return trimmedInput;

  const match =
    trimmedInput.match(SPOTIFY_TRACK_URL_PATTERN) ?? trimmedInput.match(SPOTIFY_TRACK_URI_PATTERN);
  return match?.[1];
};
