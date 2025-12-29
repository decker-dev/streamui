import type { ReactNode } from "react";
import { getByPath, useStreamContext } from "./context";
import type { StreamFieldProps } from "./types";

/**
 * Stream.Field - Renders a field value from streaming data with automatic fallback.
 * 
 * Accesses a field from the streaming data using dot notation path.
 * Renders the value directly, or shows the fallback while the field is undefined.
 * 
 * @example
 * ```tsx
 * // Simple field access
 * <h1>
 *   <Stream.Field path="title" fallback={<Skeleton className="h-8 w-32" />} />
 * </h1>
 * 
 * // With formatting (wrap with your own components)
 * <span>
 *   <Stream.Field path="temperature" fallback={<Skeleton />} />°C
 * </span>
 * 
 * // Nested path access
 * <p>
 *   <Stream.Field path="user.profile.name" fallback={<Skeleton />} />
 * </p>
 * ```
 */
function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null) {
    return true;
  }
  
  if (typeof value === "string" && value === "") {
    return true;
  }
  
  if (typeof value === "object" && !Array.isArray(value)) {
    return Object.keys(value).length === 0;
  }
  
  return false;
}

export function StreamField({
  path,
  fallback = null,
}: StreamFieldProps): ReactNode {
  const { data } = useStreamContext();
  const value = getByPath(data, path);

  if (isEmptyValue(value)) {
    return fallback;
  }

  // Render the value directly (primitives become text nodes)
  return <>{value}</>;
}

