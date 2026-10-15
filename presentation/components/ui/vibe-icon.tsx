import { Church, Feather, type LucideIcon, type LucideProps, Moon, Wine } from "lucide-react";
import { createElement } from "react";

import { WhisperVibeId } from "@/domain/entities/devotion-card";

const VIBE_ICONS: Partial<Record<WhisperVibeId, LucideIcon>> = {
  [WhisperVibeId.ForbiddenDevotion]: Wine,
  [WhisperVibeId.MidnightConfession]: Moon,
  [WhisperVibeId.VelvetObsession]: Feather,
  [WhisperVibeId.GothicVows]: Church,
};

const FALLBACK_VIBE_ICON: LucideIcon = Feather;

interface VibeIconProps extends LucideProps {
  readonly vibeId: WhisperVibeId;
}

/** New vibes render without an icon mapping thanks to the fallback (OCP). */
export function VibeIcon({ vibeId, ...iconProps }: VibeIconProps) {
  return createElement(VIBE_ICONS[vibeId] ?? FALLBACK_VIBE_ICON, iconProps);
}
