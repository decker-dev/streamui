"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

interface StreamingTextProps {
  /** The text content to display */
  children: string;
  /** Whether the text is currently streaming */
  streaming?: boolean;
  /** Cursor character to show while streaming */
  cursor?: string;
  /** Enable smooth character-by-character rendering */
  smooth?: boolean;
  /** Characters per tick when smooth is enabled (default: 2) */
  speed?: number;
  /** Additional class name for the container */
  className?: string;
  /** Additional class name for the cursor */
  cursorClassName?: string;
}

/**
 * Hook that smoothly reveals text character by character
 */
function useSmoothText(
  text: string,
  enabled: boolean,
  charsPerTick = 2,
  tickMs = 16
) {
  const [displayedLength, setDisplayedLength] = React.useState(0);
  const targetLengthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const lastTickRef = React.useRef(0);

  React.useEffect(() => {
    targetLengthRef.current = text.length;

    if (!enabled) {
      setDisplayedLength(text.length);
      return;
    }

    const animate = (timestamp: number) => {
      if (timestamp - lastTickRef.current >= tickMs) {
        lastTickRef.current = timestamp;
        setDisplayedLength((prev) => {
          const next = Math.min(prev + charsPerTick, targetLengthRef.current);
          return next;
        });
      }

      if (displayedLength < targetLengthRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [text, enabled, charsPerTick, tickMs, displayedLength]);

  // Reset when text changes significantly (new response)
  React.useEffect(() => {
    if (text.length < displayedLength) {
      setDisplayedLength(0);
    }
  }, [text, displayedLength]);

  return enabled ? text.slice(0, displayedLength) : text;
}

/**
 * StreamingText - Display text with an animated cursor while streaming.
 *
 * A simple component that shows a blinking cursor at the end of text
 * while content is being streamed from an AI model.
 *
 * @example
 * ```tsx
 * const { object, isLoading } = useObject({ ... });
 *
 * <StreamingText streaming={isLoading} smooth>
 *   {object?.text ?? ""}
 * </StreamingText>
 * ```
 */
export function StreamingText({
  children,
  streaming = false,
  cursor = "▌",
  smooth = false,
  speed = 2,
  className,
  cursorClassName,
}: StreamingTextProps) {
  const displayedText = useSmoothText(children, smooth, speed);
  const isAnimating = smooth && displayedText.length < children.length;

  return (
    <span className={cn("whitespace-pre-wrap", className)}>
      {displayedText}
      {(streaming || isAnimating) && (
        <span
          className={cn(
            "ml-0.5 inline-block animate-pulse",
            cursorClassName
          )}
          aria-hidden="true"
        >
          {cursor}
        </span>
      )}
    </span>
  );
}

