"use client";

import { createContext, type ReactNode, use } from "react";

import type { DevotionCard } from "@/domain/entities/devotion-card";
import type { GeminiServiceFactory } from "@/domain/services/gemini-service.interface";
import type { IUrlEncoderService } from "@/domain/services/url-encoder-service.interface";

/**
 * Dependency Inversion: presentation code only knows these abstractions.
 * Concrete implementations are injected by the composition root (app/providers.tsx),
 * and tests can inject mocks through the same provider.
 */
export interface DevotionServices {
  readonly createWhisperService: GeminiServiceFactory;
  readonly cardEncoder: IUrlEncoderService<DevotionCard>;
  /** Pre-configured key (from env). Empty when the user must provide one. */
  readonly defaultApiKey: string;
}

const DevotionServicesContext = createContext<DevotionServices | null>(null);

interface DevotionServicesProviderProps {
  readonly services: DevotionServices;
  readonly children: ReactNode;
}

export function DevotionServicesProvider({ services, children }: DevotionServicesProviderProps) {
  return <DevotionServicesContext value={services}>{children}</DevotionServicesContext>;
}

export const useDevotionServices = (): DevotionServices => {
  const services = use(DevotionServicesContext);
  if (!services) {
    throw new Error("useDevotionServices must be used within a DevotionServicesProvider.");
  }
  return services;
};
