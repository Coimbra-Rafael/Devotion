import { Heart } from "lucide-react";

export function OrnamentDivider() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-4 text-gold/60">
      <span className="h-px w-16 bg-linear-to-r from-transparent to-gold/50 sm:w-24" />
      <Heart className="size-3.5 fill-blood text-gold/70" strokeWidth={1.25} />
      <span className="h-px w-16 bg-linear-to-l from-transparent to-gold/50 sm:w-24" />
    </div>
  );
}
