"use client";

import { cn } from "@/lib/cn";

interface StreamingTextProps {
  /** The text content to display */
  children: string;
  /** Whether the text is currently streaming */
  streaming?: boolean;
  /** Cursor character to show while streaming */
  cursor?: string;
  /** Additional class name for the container */
  className?: string;
  /** Additional class name for the cursor */
  cursorClassName?: string;
}

/**
 * StreamingText - Display text with an animated cursor while streaming.
 *
 * A simple component that shows a blinking cursor at the end of text
 * while content is being streamed from an AI model.
 *
 * @example
 * ```tsx
 * const { text, isLoading } = useCompletion({ ... });
 *
 * <StreamingText streaming={isLoading}>
 *   {text}
 * </StreamingText>
 * ```
 */
export function StreamingText({
  children,
  streaming = false,
  cursor = "▌",
  className,
  cursorClassName,
}: StreamingTextProps) {
  return (
    <span className={cn("whitespace-pre-wrap", className)}>
      {children}
      {streaming && (
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

