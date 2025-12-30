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
 * function WeatherCard() {
 *   const { object, isLoading, error } = useObject({
 *     api: "/api/weather",
 *     schema: weatherSchema,
 *   });
 *
 *   return (
 *     <Stream.Root data={object} isLoading={isLoading} error={error}>
 *       <Stream.Field fallback={<Skeleton className="h-8 w-32" />}>
 *         <h1>{object?.location}</h1>
 *       </Stream.Field>
 *
 *       <Stream.Field fallback={<Skeleton className="h-12 w-20" />}>
 *         <span className="text-4xl">{object?.temperature}°C</span>
 *       </Stream.Field>
 *
 *       <Stream.List items={object?.forecast} fallback={<ForecastSkeleton />}>
 *         {(days) => days.map((day) => <ForecastDay key={day.date} {...day} />)}
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
  StreamState,
  StreamContextValue,
  StreamRootProps,
  StreamFieldProps,
  StreamListProps,
  StreamWhenProps,
} from "./types";
