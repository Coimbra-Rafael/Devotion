import type { WhisperVibe, WhisperVibeId } from "@/domain/entities/devotion-card";
import { VibeIcon } from "./vibe-icon";

interface VibeSelectorProps {
  readonly vibes: readonly WhisperVibe[];
  readonly selectedVibeId: WhisperVibeId;
  readonly onSelect: (vibeId: WhisperVibeId) => void;
}

/** Purely presentational radio group of vibes. */
export function VibeSelector({ vibes, selectedVibeId, onSelect }: VibeSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-3 font-display text-xs tracking-[0.3em] text-gold/80 uppercase">Vibe do sussurro</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {vibes.map((vibe) => (
          <VibeOption key={vibe.id} vibe={vibe} isSelected={vibe.id === selectedVibeId} onSelect={onSelect} />
        ))}
      </div>
    </fieldset>
  );
}

interface VibeOptionProps {
  readonly vibe: WhisperVibe;
  readonly isSelected: boolean;
  readonly onSelect: (vibeId: WhisperVibeId) => void;
}

function VibeOption({ vibe, isSelected, onSelect }: VibeOptionProps) {
  return (
    <label
      className={`group flex cursor-pointer gap-3 rounded-sm border p-4 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-gold ${
        isSelected
          ? "border-gold/70 bg-wine/60 shadow-[inset_0_0_30px] shadow-blood/40"
          : "border-gold/15 bg-abyss/40 hover:border-gold/40 hover:bg-wine/25"
      }`}
    >
      <input
        type="radio"
        name="whisper-vibe"
        value={vibe.id}
        checked={isSelected}
        onChange={() => onSelect(vibe.id)}
        className="sr-only"
      />
      <VibeIcon
        vibeId={vibe.id}
        className={`mt-0.5 size-5 shrink-0 ${isSelected ? "text-gold" : "text-gold/50"}`}
        strokeWidth={1.5}
      />
      <span>
        <span className="block font-display text-sm tracking-wider text-parchment">{vibe.label}</span>
        <span className="mt-1 block text-base leading-snug text-ash italic">{vibe.tagline}</span>
      </span>
    </label>
  );
}
