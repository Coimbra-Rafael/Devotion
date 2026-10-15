import { Flame } from "lucide-react";
import { Suspense } from "react";

import { DevotionGeneratorContainer } from "@/presentation/components/containers/devotion-generator-container";
import { DevotionReaderContainer } from "@/presentation/components/containers/devotion-reader-container";
import { OrnamentDivider } from "@/presentation/components/ui/ornament-divider";
import { CARD_QUERY_PARAM } from "@/presentation/constants/route-params";

type SearchParams = Awaited<PageProps<"/">["searchParams"]>;

const readEncodedCard = (searchParams: SearchParams): string | undefined => {
  const value = searchParams[CARD_QUERY_PARAM];
  return typeof value === "string" && value.length > 0 ? value : undefined;
};

/** Static shell: prerendered; only the flow switch depends on the request. */
export default function HomePage({ searchParams }: PageProps<"/">) {
  return (
    <div className="relative isolate flex flex-1 flex-col items-center overflow-hidden px-4 py-12 sm:py-16">
      <AtmosphereBackdrop />
      <main className="flex w-full max-w-2xl flex-col items-center gap-10">
        <BrandHeader />
        <Suspense fallback={<FlowFallback />}>
          <DevotionFlowSwitch searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}

/** Reading flow when the URL carries a sealed card; creation flow otherwise. */
async function DevotionFlowSwitch({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const encodedCard = readEncodedCard(await searchParams);
  return encodedCard ? <DevotionReaderContainer encodedCard={encodedCard} /> : <DevotionGeneratorContainer />;
}

function BrandHeader() {
  return (
    <header className="flex flex-col items-center gap-4 text-center">
      <Flame className="size-7 animate-candle-flicker text-gold" strokeWidth={1.25} aria-hidden />
      <h1 className="font-display text-4xl tracking-[0.2em] text-gilded uppercase sm:text-5xl">Devotion</h1>
      <p className="max-w-md text-lg text-ash italic">Cartas, sussurros e trilhas sonoras para quem ama nas sombras.</p>
      <OrnamentDivider />
    </header>
  );
}

function AtmosphereBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -top-1/3 left-1/2 size-[60rem] -translate-x-1/2 rounded-full bg-wine/40 blur-3xl" />
      <div className="absolute -bottom-1/2 -left-1/4 size-[40rem] rounded-full bg-bordeaux/20 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-abyss)_85%)]" />
    </div>
  );
}

function FlowFallback() {
  return <div className="ornate-panel h-96 w-full animate-pulse" aria-busy aria-label="Carregando" />;
}
