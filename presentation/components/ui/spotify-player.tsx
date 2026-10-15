const SPOTIFY_EMBED_BASE_URL = "https://open.spotify.com/embed/track";
const SPOTIFY_DARK_THEME = "0";
const SPOTIFY_COMPACT_PLAYER_HEIGHT = 152;
const IFRAME_PERMISSIONS = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";

interface SpotifyPlayerProps {
  readonly trackId: string;
  readonly className?: string;
}

const buildEmbedUrl = (trackId: string): string => {
  const url = new URL(`${SPOTIFY_EMBED_BASE_URL}/${encodeURIComponent(trackId)}`);
  url.searchParams.set("theme", SPOTIFY_DARK_THEME);
  return url.toString();
};

/** Purely presentational: renders the styled Spotify embed for a track. */
export function SpotifyPlayer({ trackId, className = "" }: SpotifyPlayerProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-gold/30 bg-abyss shadow-[0_0_40px_-10px] shadow-blood/60 ${className}`}
    >
      <iframe
        title="Trilha sonora da carta"
        src={buildEmbedUrl(trackId)}
        width="100%"
        height={SPOTIFY_COMPACT_PLAYER_HEIGHT}
        allow={IFRAME_PERMISSIONS}
        loading="lazy"
        className="block border-0"
      />
    </div>
  );
}
