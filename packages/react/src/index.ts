import { StreamField } from "./stream-field";
import { StreamList } from "./stream-list";
import { StreamRoot } from "./stream-root";
import { StreamWhen } from "./stream-when";

/**
 * Stream primitives for building streaming UI.
 *
 * @example
 * ```tsx
 * import { Stream } from "@stream.ui/react";
 *
 * function ArticleCard() {
 *   const { object, isLoading, error } = useObject({
 *     api: "/api/article",
 *     schema: articleSchema,
 *   });
 *
 *   return (
 *     <Stream.Root data={object} isLoading={isLoading} error={error}>
 *       <Stream.Field fallback={<Skeleton className="h-8 w-32" />}>
 *         <h1>{object?.title}</h1>
 *       </Stream.Field>
 *
 *       <Stream.Field fallback={<Skeleton className="h-12 w-20" />}>
 *         <p className="text-lg">{object?.summary}</p>
 *       </Stream.Field>
 *
 *       <Stream.List fallback={<SectionsSkeleton />}>
 *         {object?.sections?.map((s) => <Section key={s.heading} {...s} />)}
 *       </Stream.List>
 *
 *       <Stream.When streaming>
 *         <PulsingDot />
 *       </Stream.When>
 *
 *       <Stream.When error>
 *         {(err) => <ErrorMessage message={err.message} />}
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

export { StreamRoot, StreamField, StreamList, StreamWhen };

export type {
  DeepPartial,
  StreamContextValue,
  StreamFieldProps,
  StreamListProps,
  StreamRootProps,
  StreamState,
  StreamWhenProps,
} from "./types";
