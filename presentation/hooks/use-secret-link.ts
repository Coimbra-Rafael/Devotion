"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { DevotionCard } from "@/domain/entities/devotion-card";
import type { IUrlEncoderService } from "@/domain/services/url-encoder-service.interface";
import { CARD_QUERY_PARAM } from "@/presentation/constants/route-params";

const COPY_FEEDBACK_DURATION_MS = 2000;

const buildSecretLink = (token: string): string => {
  const url = new URL(window.location.pathname, window.location.origin);
  url.searchParams.set(CARD_QUERY_PARAM, token);
  return url.toString();
};

/** Seals a card into a self-contained URL and handles copying it. */
export const useSecretLink = (cardEncoder: IUrlEncoderService<DevotionCard>) => {
  const [secretLink, setSecretLink] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const copyFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (copyFeedbackTimerRef.current) clearTimeout(copyFeedbackTimerRef.current);
    },
    [],
  );

  const sealCard = useCallback(
    (card: DevotionCard) => {
      setHasCopied(false);
      setSecretLink(buildSecretLink(cardEncoder.encode(card)));
    },
    [cardEncoder],
  );

  const copySecretLink = useCallback(async () => {
    if (!secretLink) return;
    await navigator.clipboard.writeText(secretLink);
    setHasCopied(true);
    if (copyFeedbackTimerRef.current) clearTimeout(copyFeedbackTimerRef.current);
    copyFeedbackTimerRef.current = setTimeout(() => setHasCopied(false), COPY_FEEDBACK_DURATION_MS);
  }, [secretLink]);

  const discardSecretLink = useCallback(() => setSecretLink(null), []);

  return { secretLink, hasCopied, sealCard, copySecretLink, discardSecretLink };
};
