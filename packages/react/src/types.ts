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
  data: DeepPartial<T> | undefined;
  state: StreamState;
  isLoading: boolean;
  isStreaming: boolean;
  isComplete: boolean;
  error: Error | undefined;
}

/**
 * Props for Stream.Root component.
 */
export interface StreamRootProps<T = unknown> {
  data: DeepPartial<T> | undefined;
  isLoading?: boolean;
  error?: Error | undefined;
  children: ReactNode;
}

/**
 * Props for Stream.Field component.
 * Shows fallback if children contains undefined, otherwise renders children.
 */
export interface StreamFieldProps {
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Props for Stream.List component.
 * Shows fallback if children is undefined or contains only incomplete items.
 */
export interface StreamListProps {
  fallback?: ReactNode;
  children?: ReactNode;
}

/**
 * Props for Stream.When component.
 */
export interface StreamWhenProps {
  loading?: boolean;
  streaming?: boolean;
  complete?: boolean;
  error?: boolean;
  children: ReactNode | ((error: Error) => ReactNode);
}
