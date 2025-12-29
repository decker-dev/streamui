"use client";

import { Stream } from "@stream.ui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { Cloud, CloudRain, CloudSnow, Droplets, Sun, Wind } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  type WeatherCardData,
  type WeatherCondition,
  weatherCardSchema,
  weatherConditions,
} from "./weather-card-schema";

// Re-export schema and types for convenience
export { weatherCardSchema, weatherConditions };
export type { WeatherCardData, WeatherCondition };

const weatherCardVariants = cva(
  "relative min-w-[280px] overflow-hidden rounded-2xl border bg-card text-card-foreground",
  {
    variants: {
      variant: {
        default: "border-border",
        elevated: "border-border shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

function WeatherIcon({
  condition,
  className,
}: {
  condition: WeatherCondition;
  className?: string;
}) {
  const iconProps = { className: cn("h-8 w-8", className) };

  switch (condition) {
    case "sunny":
      return (
        <Sun
          {...iconProps}
          className={cn(iconProps.className, "text-amber-500")}
        />
      );
    case "cloudy":
      return (
        <Cloud
          {...iconProps}
          className={cn(iconProps.className, "text-slate-400")}
        />
      );
    case "rainy":
      return (
        <CloudRain
          {...iconProps}
          className={cn(iconProps.className, "text-blue-500")}
        />
      );
    case "snowy":
      return (
        <CloudSnow
          {...iconProps}
          className={cn(iconProps.className, "text-sky-300")}
        />
      );
    case "windy":
      return (
        <Wind
          {...iconProps}
          className={cn(iconProps.className, "text-teal-500")}
        />
      );
  }
}

function SmallWeatherIcon({
  condition,
  className,
}: {
  condition: WeatherCondition;
  className?: string;
}) {
  const iconProps = { className: cn("h-5 w-5", className) };

  switch (condition) {
    case "sunny":
      return (
        <Sun
          {...iconProps}
          className={cn(iconProps.className, "text-amber-500")}
        />
      );
    case "cloudy":
      return (
        <Cloud
          {...iconProps}
          className={cn(iconProps.className, "text-slate-400")}
        />
      );
    case "rainy":
      return (
        <CloudRain
          {...iconProps}
          className={cn(iconProps.className, "text-blue-500")}
        />
      );
    case "snowy":
      return (
        <CloudSnow
          {...iconProps}
          className={cn(iconProps.className, "text-sky-300")}
        />
      );
    case "windy":
      return (
        <Wind
          {...iconProps}
          className={cn(iconProps.className, "text-teal-500")}
        />
      );
  }
}

// DeepPartial type to match AI SDK's PartialObject
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

interface WeatherCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof weatherCardVariants> {
  data?: DeepPartial<WeatherCardData>;
  isLoading?: boolean;
}

/**
 * WeatherCard - A streaming-aware weather card component.
 * 
 * Built with Stream primitives from @stream.ui/react.
 * Handles partial data gracefully with automatic skeleton fallbacks.
 * 
 * @example
 * ```tsx
 * const { object, isLoading } = useObject({
 *   api: "/api/stream/weather",
 *   schema: weatherCardSchema,
 * });
 * 
 * <WeatherCard data={object} isLoading={isLoading} />
 * ```
 */
const WeatherCard = React.forwardRef<HTMLDivElement, WeatherCardProps>(
  ({ className, variant, data, isLoading, ...props }, ref) => {
    return (
      <Stream.Root data={data} isLoading={isLoading}>
        <div
          ref={ref}
          className={cn(weatherCardVariants({ variant, className }))}
          {...props}
        >
          <div className="p-6">
            {/* Location */}
            <div className="mb-4">
              <Stream.Field path="location" fallback={<Skeleton className="h-6 w-32" />}>
                {(location) => (
                  <h3 className="text-lg font-semibold text-foreground">
                    {location as string}
                  </h3>
                )}
              </Stream.Field>
            </div>

            {/* Main temperature and condition */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-baseline gap-2">
                <Stream.Field path="temperature" fallback={<Skeleton className="h-12 w-20" />}>
                  {(temp) => (
                    <span className="text-5xl font-bold tabular-nums text-foreground">
                      {Math.round(temp as number)}°
                    </span>
                  )}
                </Stream.Field>
              </div>

              <Stream.Field path="condition" fallback={<Skeleton className="h-12 w-12 rounded-full" />}>
                {(condition) => (
                  <WeatherIcon condition={condition as WeatherCondition} className="h-12 w-12" />
                )}
              </Stream.Field>
            </div>

            {/* Humidity and Wind */}
            <div className="mt-4 flex gap-4">
              <Stream.Field path="humidity" fallback={<Skeleton className="h-5 w-14" />}>
                {(humidity) => (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Droplets className="h-4 w-4" />
                    <span className="tabular-nums">{humidity as number}%</span>
                  </div>
                )}
              </Stream.Field>

              <Stream.Field path="windSpeed" fallback={<Skeleton className="h-5 w-16" />}>
                {(windSpeed) => (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Wind className="h-4 w-4" />
                    <span className="tabular-nums">{windSpeed as number} km/h</span>
                  </div>
                )}
              </Stream.Field>
            </div>
          </div>

          {/* Forecast */}
          <div className="border-t border-border bg-muted/30 px-6 py-4">
            <Stream.List
              path="forecast"
              fallback={
                <div className="grid grid-cols-3 gap-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <Skeleton className="h-3 w-8" />
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-3 w-10" />
                    </div>
                  ))}
                </div>
              }
            >
              {(days) => (
                <div className="grid grid-cols-3 gap-4">
                  {(days as Array<{ day: string; condition: WeatherCondition; high: number; low: number }>).map((day, index) => (
                    <div
                      key={day.day ?? index}
                      className="flex flex-col items-center gap-1"
                    >
                      <span className="text-xs font-medium text-muted-foreground">
                        {day.day}
                      </span>
                      <SmallWeatherIcon condition={day.condition} />
                      <div className="flex gap-1 text-xs tabular-nums">
                        <span className="font-medium">
                          {Math.round(day.high)}°
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round(day.low)}°
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Stream.List>
          </div>

          {/* Streaming indicator */}
          <Stream.When streaming>
            <div className="absolute top-3 right-3">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
          </Stream.When>
        </div>
      </Stream.Root>
    );
  },
);
WeatherCard.displayName = "WeatherCard";

export { WeatherCard, WeatherIcon, weatherCardVariants };
export type { WeatherCardProps };
