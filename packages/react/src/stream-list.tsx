import type { ReactNode } from "react";
import type { StreamListProps } from "./types";

/**
 * Check if an item is empty/incomplete during streaming.
 */
function isEmptyItem(item: unknown): boolean {
  if (item === undefined || item === null) {
    return true;
  }

  // Empty object (partial item during streaming)
  if (typeof item === "object" && !Array.isArray(item)) {
    return Object.keys(item).length === 0;
  }

  return false;
}

/**
 * Stream.List - Renders an array with automatic fallback and filtering.
 *
 * Shows the fallback while items is undefined or empty. Once items arrive,
 * filters out incomplete items and renders children with the valid ones.
 *
 * @example
 * ```tsx
 * const { object } = useObject({ schema: articleSchema });
 *
 * <Stream.List items={object?.sections} fallback={<SectionsSkeleton />}>
 *   {(sections) => (
 *     <div className="space-y-4">
 *       {sections.map((section) => (
 *         <Section key={section.heading} {...section} />
 *       ))}
 *     </div>
 *   )}
 * </Stream.List>
 *
 * // With inline skeleton
 * <Stream.List
 *   items={object?.results}
 *   fallback={
 *     <div className="space-y-2">
 *       {[0, 1, 2].map((i) => <Skeleton key={i} className="h-20" />)}
 *     </div>
 *   }
 * >
 *   {(results) => results.map((r) => <ResultCard key={r.id} {...r} />)}
 * </Stream.List>
 * ```
 */
export function StreamList<T>({
  items,
  fallback = null,
  children,
}: StreamListProps<T>): ReactNode {
  // Show fallback if items is undefined or null
  if (items === undefined || items === null) {
    return fallback;
  }

  // Filter out undefined and empty items (partial array during streaming)
  const validItems = items.filter(
    (item): item is NonNullable<T> => !isEmptyItem(item)
  );

  // Show fallback if no valid items yet
  if (validItems.length === 0) {
    return fallback;
  }

  return children(validItems);
}
