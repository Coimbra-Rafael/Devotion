"use client";

import { useCallback, useRef, useState } from "react";

import type { GenerateWhisperRequestDto } from "@/domain/entities/devotion-card";
import { WhisperGenerationError } from "@/domain/entities/whisper-generation-error";
import type { IGeminiService } from "@/domain/services/gemini-service.interface";

export interface GenerateWhisperState {
  readonly data: string | null;
  readonly error: string | null;
  readonly isLoading: boolean;
}

const INITIAL_STATE: GenerateWhisperState = { data: null, error: null, isLoading: false };

const MISSING_SERVICE_MESSAGE = "Informe uma API Key do Gemini para invocar os sussurros.";
const UNEXPECTED_ERROR_MESSAGE = "Algo se perdeu nas sombras. Tente novamente.";

const toErrorMessage = (error: unknown): string =>
  error instanceof WhisperGenerationError ? error.message : UNEXPECTED_ERROR_MESSAGE;

/**
 * Orchestrates whisper generation through the IGeminiService abstraction.
 * Responses from superseded requests are discarded to avoid race conditions.
 */
export const useGenerateWhisper = (whisperService: IGeminiService | null) => {
  const [state, setState] = useState<GenerateWhisperState>(INITIAL_STATE);
  const latestRequestIdRef = useRef(0);

  const generateWhisper = useCallback(
    async (request: GenerateWhisperRequestDto): Promise<void> => {
      if (!whisperService) {
        setState({ data: null, isLoading: false, error: MISSING_SERVICE_MESSAGE });
        return;
      }

      const requestId = ++latestRequestIdRef.current;
      const isLatestRequest = () => requestId === latestRequestIdRef.current;
      setState((previous) => ({ ...previous, isLoading: true, error: null }));

      try {
        const { whisper } = await whisperService.generateWhisper(request);
        if (isLatestRequest()) setState({ data: whisper, error: null, isLoading: false });
      } catch (error) {
        if (isLatestRequest()) {
          setState((previous) => ({ ...previous, isLoading: false, error: toErrorMessage(error) }));
        }
      }
    },
    [whisperService],
  );

  const reset = useCallback(() => {
    latestRequestIdRef.current += 1;
    setState(INITIAL_STATE);
  }, []);

  return { ...state, generateWhisper, reset };
};
