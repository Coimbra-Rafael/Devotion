import type {
  GenerateWhisperRequestDto,
  GenerateWhisperResponseDto,
} from "@/domain/entities/devotion-card";

/**
 * Contract for whisper generation. The UI depends on this abstraction only,
 * so any implementation (Gemini, mock, server proxy) can be swapped in.
 */
export interface IGeminiService {
  generateWhisper(request: GenerateWhisperRequestDto): Promise<GenerateWhisperResponseDto>;
}

/** Builds an IGeminiService bound to a user-provided API key. */
export type GeminiServiceFactory = (apiKey: string) => IGeminiService;
