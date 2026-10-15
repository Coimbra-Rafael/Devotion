"use client";

import {
  type KeyboardEvent,
  type PointerEvent,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export const DEFAULT_HOLD_TO_REVEAL_MS = 450;
const REVEAL_KEYS: ReadonlySet<string> = new Set([" ", "Enter"]);

interface UseBurnAfterReadingOptions {
  /** How long the press must be held before the content is revealed. */
  readonly holdDurationMs?: number;
  /** Fired once, on the very first reveal (e.g. to start the soundtrack). */
  readonly onFirstReveal?: () => void;
}

export interface BurnAfterReadingBindings {
  onPointerDown(event: PointerEvent<HTMLElement>): void;
  onPointerUp(): void;
  onPointerCancel(): void;
  onLostPointerCapture(): void;
  onKeyDown(event: KeyboardEvent<HTMLElement>): void;
  onKeyUp(event: KeyboardEvent<HTMLElement>): void;
  onBlur(): void;
  onContextMenu(event: SyntheticEvent): void;
}

/**
 * Press-and-hold interaction: the content stays veiled and is only revealed
 * while the user keeps holding (pointer, touch or keyboard). Releasing veils it again.
 */
export const useBurnAfterReading = ({
  holdDurationMs = DEFAULT_HOLD_TO_REVEAL_MS,
  onFirstReveal,
}: UseBurnAfterReadingOptions = {}) => {
  const [isHolding, setIsHolding] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasBeenRevealed, setHasBeenRevealed] = useState(false);

  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasBeenRevealedRef = useRef(false);
  const onFirstRevealRef = useRef(onFirstReveal);

  useEffect(() => {
    onFirstRevealRef.current = onFirstReveal;
  }, [onFirstReveal]);

  const clearRevealTimer = useCallback(() => {
    if (revealTimerRef.current === null) return;
    clearTimeout(revealTimerRef.current);
    revealTimerRef.current = null;
  }, []);

  useEffect(() => clearRevealTimer, [clearRevealTimer]);

  const reveal = useCallback(() => {
    setIsRevealed(true);
    if (hasBeenRevealedRef.current) return;
    hasBeenRevealedRef.current = true;
    setHasBeenRevealed(true);
    onFirstRevealRef.current?.();
  }, []);

  const startHolding = useCallback(() => {
    clearRevealTimer();
    setIsHolding(true);
    revealTimerRef.current = setTimeout(reveal, holdDurationMs);
  }, [clearRevealTimer, holdDurationMs, reveal]);

  const stopHolding = useCallback(() => {
    clearRevealTimer();
    setIsHolding(false);
    setIsRevealed(false);
  }, [clearRevealTimer]);

  const bindings: BurnAfterReadingBindings = {
    onPointerDown: (event) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      startHolding();
    },
    onPointerUp: stopHolding,
    onPointerCancel: stopHolding,
    onLostPointerCapture: stopHolding,
    onKeyDown: (event) => {
      if (!REVEAL_KEYS.has(event.key) || event.repeat) return;
      event.preventDefault();
      startHolding();
    },
    onKeyUp: (event) => {
      if (REVEAL_KEYS.has(event.key)) stopHolding();
    },
    onBlur: stopHolding,
    // Prevents the long-press context menu on mobile from interrupting the hold.
    onContextMenu: (event) => event.preventDefault(),
  };

  return { isHolding, isRevealed, hasBeenRevealed, holdDurationMs, bindings };
};
