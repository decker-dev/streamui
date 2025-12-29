import { useMemo } from "react";
import { StreamContext } from "./context";
import type { DeepPartial, StreamContextValue, StreamRootProps, StreamState } from "./types";

/**
 * Derives the stream state from the current data and loading status.
 */
function deriveStreamState<T>(
  data: DeepPartial<T> | undefined,
  isLoading: boolean,
  error: Error | undefined
): StreamState {
  if (error) {
    return "error";
  }
  if (isLoading && !data) {
    return "loading";
  }
  if (isLoading && data) {
    return "streaming";
  }
  if (data) {
    return "complete";
  }
  return "idle";
}

/**
 * Stream.Root - The root component that provides streaming context.
 * 
 * Wrap your streaming UI with this component and pass the data from
 * useObject or similar streaming hooks.
 * 
 * @example
 * ```tsx
 * const { object, isLoading, error } = useObject({ ... });
 * 
 * <Stream.Root data={object} isLoading={isLoading} error={error}>
 *   <Stream.Field path="title">
 *     {(title) => <h1>{title}</h1>}
 *   </Stream.Field>
 * </Stream.Root>
 * ```
 */
export function StreamRoot<T = unknown>({
  data,
  isLoading = false,
  error,
  children,
}: StreamRootProps<T>) {
  const state = deriveStreamState(data, isLoading, error);

  const contextValue = useMemo<StreamContextValue<T>>(
    () => ({
      data,
      state,
      isLoading: state === "loading",
      isStreaming: state === "streaming",
      isComplete: state === "complete",
      error,
    }),
    [data, state, error]
  );

  return (
    <StreamContext.Provider value={contextValue as StreamContextValue}>
      {children}
    </StreamContext.Provider>
  );
}

