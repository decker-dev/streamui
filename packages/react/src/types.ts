import type { ReactNode } from "react";

/**
 * Makes all properties of T optional recursively.
 * Matches the shape of partial objects returned by AI SDK's useObject.
 */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

/**
 * Possible states of a streaming data flow.
 */
export type StreamState = "idle" | "loading" | "streaming" | "complete" | "error";

/**
 * Context value provided by Stream.Root to all children.
 */
export interface StreamContextValue<T = unknown> {
  /** The partial data object being streamed */
  data: DeepPartial<T> | undefined;
  /** Current state of the stream */
  state: StreamState;
  /** Whether the stream is currently loading (no data yet) */
  isLoading: boolean;
  /** Whether data is actively streaming (partial data exists) */
  isStreaming: boolean;
  /** Whether streaming is complete */
  isComplete: boolean;
  /** Error if any occurred */
  error: Error | undefined;
}

/**
 * Props for Stream.Root component.
 */
export interface StreamRootProps<T = unknown> {
  /** The partial data object from useObject or similar */
  data: DeepPartial<T> | undefined;
  /** Whether the stream is actively loading */
  isLoading?: boolean;
  /** Error if any occurred */
  error?: Error | undefined;
  /** Children to render */
  children: ReactNode;
}

/**
 * Props for Stream.Field component.
 */
export interface StreamFieldProps<T = unknown> {
  /** Path to the field using dot notation (e.g., "user.name" or "items.0.title") */
  path: string;
  /** Fallback to render while the field is undefined */
  fallback?: ReactNode;
  /** Render function that receives the field value when available */
  children: (value: T) => ReactNode;
}

/**
 * Props for Stream.List component.
 */
export interface StreamListProps<T = unknown> {
  /** Path to the array field using dot notation */
  path: string;
  /** Fallback to render while the array is undefined */
  fallback?: ReactNode;
  /** Render function that receives the array items */
  children: (items: T[]) => ReactNode;
}

/**
 * Props for Stream.When component.
 */
export interface StreamWhenProps {
  /** Render when in loading state (no data yet) */
  loading?: boolean;
  /** Render when actively streaming (partial data exists) */
  streaming?: boolean;
  /** Render when streaming is complete */
  complete?: boolean;
  /** Render when an error occurred */
  error?: boolean;
  /** Children to render - can be ReactNode or function for error state */
  children: ReactNode | ((error: Error) => ReactNode);
}

