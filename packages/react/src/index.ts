// Public API for @stream.ui/react

import { StreamRoot } from "./stream-root";
import { StreamField } from "./stream-field";
import { StreamList } from "./stream-list";
import { StreamWhen } from "./stream-when";

/**
 * Stream primitives for building streaming UI.
 * 
 * @example
 * ```tsx
 * import { Stream } from "@stream.ui/react";
 * 
 * function MyComponent() {
 *   const { object, isLoading, error } = useObject({ ... });
 * 
 *   return (
 *     <Stream.Root data={object} isLoading={isLoading} error={error}>
 *       <Stream.Field path="title" fallback={<Skeleton />}>
 *         {(title) => <h1>{title}</h1>}
 *       </Stream.Field>
 *       
 *       <Stream.List path="items" fallback={<ItemsSkeleton />}>
 *         {(items) => items.map(item => <Item key={item.id} {...item} />)}
 *       </Stream.List>
 *       
 *       <Stream.When loading>
 *         <Spinner />
 *       </Stream.When>
 *       
 *       <Stream.When error>
 *         {(err) => <ErrorMessage error={err} />}
 *       </Stream.When>
 *     </Stream.Root>
 *   );
 * }
 * ```
 */
export const Stream = {
  Root: StreamRoot,
  Field: StreamField,
  List: StreamList,
  When: StreamWhen,
} as const;

// Also export individual components for tree-shaking
export { StreamRoot, StreamField, StreamList, StreamWhen };

// Export types for consumers
export type {
  DeepPartial,
  StreamState,
  StreamContextValue,
  StreamRootProps,
  StreamFieldProps,
  StreamListProps,
  StreamWhenProps,
} from "./types";

