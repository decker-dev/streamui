import type { ReactNode } from "react";
import { getByPath, useStreamContext } from "./context";
import type { StreamListProps } from "./types";

/**
 * Stream.List - Renders an array from the streaming data with automatic fallback.
 * 
 * Accesses an array field from the streaming data using dot notation path.
 * Shows the fallback while the array is undefined, then renders children
 * with the items once available. As items stream in, the list grows.
 * 
 * @example
 * ```tsx
 * // Basic list rendering
 * <Stream.List path="forecast" fallback={<ForecastSkeleton />}>
 *   {(items) => items.map((day, i) => (
 *     <ForecastDay key={i} {...day} />
 *   ))}
 * </Stream.List>
 * 
 * // Nested list access
 * <Stream.List path="user.posts">
 *   {(posts) => posts.map(post => (
 *     <PostCard key={post.id} post={post} />
 *   ))}
 * </Stream.List>
 * 
 * // With skeleton fallback for loading state
 * <Stream.List 
 *   path="results" 
 *   fallback={
 *     <div className="space-y-2">
 *       {[0, 1, 2].map(i => <Skeleton key={i} className="h-20" />)}
 *     </div>
 *   }
 * >
 *   {(results) => results.map(result => (
 *     <ResultCard key={result.id} {...result} />
 *   ))}
 * </Stream.List>
 * ```
 */
/**
 * Check if an item is empty/incomplete
 */
function isEmptyItem(item: unknown): boolean {
  if (item === undefined || item === null) {
    return true;
  }
  
  // Empty object
  if (typeof item === "object" && !Array.isArray(item)) {
    return Object.keys(item).length === 0;
  }
  
  return false;
}

export function StreamList<T = unknown>({
  path,
  fallback = null,
  children,
}: StreamListProps<T>): ReactNode {
  const { data } = useStreamContext();
  const value = getByPath<T[]>(data, path);

  // Show fallback if array is undefined or null
  if (value === undefined || value === null) {
    return fallback;
  }

  // Ensure we have an array (handle edge case of non-array values)
  if (!Array.isArray(value)) {
    console.warn(
      `Stream.List: Expected array at path "${path}", got ${typeof value}. ` +
      "Rendering fallback instead."
    );
    return fallback;
  }

  // Filter out undefined and empty items (partial array during streaming)
  const validItems = value.filter((item): item is T => !isEmptyItem(item));
  
  // Show fallback if no valid items yet
  if (validItems.length === 0) {
    return fallback;
  }

  // Render children with the valid items
  return children(validItems);
}

