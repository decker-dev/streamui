import { isValidElement, type ReactNode } from "react";
import type { StreamFieldProps } from "./types";

/**
 * Recursively checks if a React node tree contains undefined or null values.
 * This allows detecting when a streamed field hasn't arrived yet.
 */
function containsUndefined(node: ReactNode): boolean {
  // Direct undefined/null check
  if (node === undefined || node === null) {
    return true;
  }

  // Check arrays (e.g., fragment children)
  if (Array.isArray(node)) {
    return node.some(containsUndefined);
  }

  // Check React element children
  if (isValidElement(node)) {
    const { children } = node.props as { children?: ReactNode };
    if (children !== undefined) {
      return containsUndefined(children);
    }
  }

  return false;
}

/**
 * Stream.Field - Renders children or fallback based on undefined detection.
 *
 * Inspects the children tree for undefined values. If any undefined is found
 * (indicating a streamed field hasn't arrived), shows the fallback.
 * Otherwise renders the children as-is.
 *
 * @example
 * ```tsx
 * const { object } = useObject({ schema: weatherSchema });
 *
 * <Stream.Field fallback={<Skeleton className="h-8 w-32" />}>
 *   <h1>{object?.location}</h1>
 * </Stream.Field>
 *
 * <Stream.Field fallback={<Skeleton className="h-12 w-20" />}>
 *   <span className="text-4xl">{object?.temperature}°C</span>
 * </Stream.Field>
 *
 * // Also works with just the value
 * <Stream.Field fallback={<Skeleton />}>
 *   {object?.humidity}%
 * </Stream.Field>
 * ```
 */
export function StreamField({
  fallback = null,
  children,
}: StreamFieldProps): ReactNode {
  if (containsUndefined(children)) {
    return fallback;
  }

  return children;
}
