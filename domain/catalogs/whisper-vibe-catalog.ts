import { type WhisperVibe, WhisperVibeId } from "@/domain/entities/devotion-card";

/**
 * Open/Closed: new vibes are added by appending an entry here (and its id to
 * WhisperVibeId). Services and UI iterate over the catalog and never change.
 */
export const WHISPER_VIBE_CATALOG: readonly WhisperVibe[] = [
  {
    id: WhisperVibeId.ForbiddenDevotion,
    label: "Devoção Proibida",
    tagline: "Um amor que desafia regras e sobrevive em segredo.",
    promptDirective:
      "Explore a tensão de um amor proibido: olhares roubados, promessas sussurradas no escuro, a culpa doce de desejar o que não se deve.",
  },
  {
    id: WhisperVibeId.MidnightConfession,
    label: "Confissão à Meia-Noite",
    tagline: "Palavras que só têm coragem depois que as velas se apagam.",
    promptDirective:
      "Escreva como uma confissão íntima feita à meia-noite, à luz de velas, com vulnerabilidade, saudade e entrega silenciosa.",
  },
  {
    id: WhisperVibeId.VelvetObsession,
    label: "Obsessão de Veludo",
    tagline: "Desejo intenso, envolvente e perigosamente terno.",
    promptDirective:
      "Transmita uma devoção intensa e quase obsessiva, envolta em veludo, perfume e calor da pele — sempre sugerida, nunca explícita.",
  },
  {
    id: WhisperVibeId.GothicVows,
    label: "Votos Góticos",
    tagline: "Juramentos eternos sob catedrais de sombra.",
    promptDirective:
      "Construa votos eternos com imagens góticas: catedrais, rosas negras, luar, eternidade e almas entrelaçadas além da morte.",
  },
];

export const DEFAULT_WHISPER_VIBE_ID = WhisperVibeId.MidnightConfession;

export const findWhisperVibeById = (vibeId: WhisperVibeId): WhisperVibe | undefined =>
  WHISPER_VIBE_CATALOG.find((vibe) => vibe.id === vibeId);
