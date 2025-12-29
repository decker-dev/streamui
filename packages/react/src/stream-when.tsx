import type { ReactNode } from "react";
import { useStreamContext } from "./context";
import type { StreamWhenProps } from "./types";

/**
 * Stream.When - Conditionally renders content based on stream state.
 * 
 * Use this to show different UI based on whether the stream is
 * loading, streaming, complete, or has errored.
 * 
 * @example
 * ```tsx
 * // Show spinner while loading (no data yet)
 * <Stream.When loading>
 *   <Spinner />
 * </Stream.When>
 * 
 * // Show indicator while actively streaming
 * <Stream.When streaming>
 *   <PulsingDot />
 * </Stream.When>
 * 
 * // Show success indicator when complete
 * <Stream.When complete>
 *   <CheckIcon />
 * </Stream.When>
 * 
 * // Handle errors with render function to access error details
 * <Stream.When error>
 *   {(err) => <ErrorMessage message={err.message} />}
 * </Stream.When>
 * 
 * // Simple error display
 * <Stream.When error>
 *   <p>Something went wrong</p>
 * </Stream.When>
 * ```
 */
export function StreamWhen({
  loading,
  streaming,
  complete,
  error,
  children,
}: StreamWhenProps): ReactNode {
  const context = useStreamContext();

  // Check if the current state matches any of the requested states
  const shouldRender =
    (loading && context.isLoading) ||
    (streaming && context.isStreaming) ||
    (complete && context.isComplete) ||
    (error && context.state === "error");

  if (!shouldRender) {
    return null;
  }

  // For error state with function children, pass the error
  if (error && context.error && typeof children === "function") {
    return children(context.error);
  }

  // For all other cases, render children directly
  return <>{children}</>;
}

