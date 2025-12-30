import { isValidElement, type ReactNode, Children } from "react";
import type { StreamListProps } from "./types";

/**
 * Recursively checks if a React node tree contains undefined or null values.
 * This allows detecting when a streamed item hasn't arrived yet.
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
 * Stream.List - Renders array children with automatic fallback.
 *
 * Filters out children that contain undefined values (incomplete items during
 * streaming) and shows fallback when no valid children exist.
 *
 * @example
 * ```tsx
 * const { object } = useObject({ schema: articleSchema });
 *
 * <Stream.List fallback={<SectionsSkeleton />}>
 *   {object?.sections?.map((section) => (
 *     <Section key={section.heading} {...section} />
 *   ))}
 * </Stream.List>
 *
 * // With inline skeleton
 * <Stream.List
 *   fallback={
 *     <div className="space-y-2">
 *       {[0, 1, 2].map((i) => <Skeleton key={i} className="h-20" />)}
 *     </div>
 *   }
 * >
 *   {object?.results?.map((r) => <ResultCard key={r.id} {...r} />)}
 * </Stream.List>
 * ```
 */
export function StreamList({
  fallback = null,
  children,
}: StreamListProps): ReactNode {
  // If children is undefined or null (array hasn't arrived yet)
  if (children === undefined || children === null) {
    return fallback;
  }

  // Convert to array and filter out incomplete elements
  const childArray = Children.toArray(children);
  const validChildren = childArray.filter((child) => !containsUndefined(child));

  // Show fallback if no valid items yet
  if (validChildren.length === 0) {
    return fallback;
  }

  return <>{validChildren}</>;
}
