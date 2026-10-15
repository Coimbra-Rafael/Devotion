"use client";

import type { ReactNode } from "react";

import { isDevotionCard } from "@/domain/entities/devotion-card";
import { Base64UrlEncoderService } from "@/infrastructure/services/base64-url-encoder.service";
import { GeminiApiService } from "@/infrastructure/services/gemini-api.service";
import {
  type DevotionServices,
  DevotionServicesProvider,
} from "@/presentation/providers/devotion-services-context";

/** Composition root: the only place that knows the concrete implementations. */
const devotionServices: DevotionServices = {
  createWhisperService: (apiKey) => new GeminiApiService(apiKey),
  cardEncoder: new Base64UrlEncoderService(isDevotionCard),
  defaultApiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "",
};

export function Providers({ children }: { readonly children: ReactNode }) {
  return <DevotionServicesProvider services={devotionServices}>{children}</DevotionServicesProvider>;
}
