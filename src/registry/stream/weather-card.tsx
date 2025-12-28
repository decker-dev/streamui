"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  Wind,
  Droplets,
} from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  weatherCardSchema,
  weatherConditions,
  type WeatherCardData,
  type WeatherCondition,
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

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
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
      return <Sun {...iconProps} className={cn(iconProps.className, "text-amber-500")} />;
    case "cloudy":
      return <Cloud {...iconProps} className={cn(iconProps.className, "text-slate-400")} />;
    case "rainy":
      return <CloudRain {...iconProps} className={cn(iconProps.className, "text-blue-500")} />;
    case "snowy":
      return <CloudSnow {...iconProps} className={cn(iconProps.className, "text-sky-300")} />;
    case "windy":
      return <Wind {...iconProps} className={cn(iconProps.className, "text-teal-500")} />;
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
      return <Sun {...iconProps} className={cn(iconProps.className, "text-amber-500")} />;
    case "cloudy":
      return <Cloud {...iconProps} className={cn(iconProps.className, "text-slate-400")} />;
    case "rainy":
      return <CloudRain {...iconProps} className={cn(iconProps.className, "text-blue-500")} />;
    case "snowy":
      return <CloudSnow {...iconProps} className={cn(iconProps.className, "text-sky-300")} />;
    case "windy":
      return <Wind {...iconProps} className={cn(iconProps.className, "text-teal-500")} />;
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

const WeatherCard = React.forwardRef<HTMLDivElement, WeatherCardProps>(
  ({ className, variant, data, isLoading, ...props }, ref) => {
    const showSkeleton = isLoading || !data;

    return (
      <div
        ref={ref}
        className={cn(weatherCardVariants({ variant, className }))}
        {...props}
      >
        <div className="p-6">
          {/* Location */}
          <div className="mb-4">
            {data?.location ? (
              <h3 className="text-lg font-semibold text-foreground">
                {data.location}
              </h3>
            ) : (
              <Skeleton className="h-6 w-32" />
            )}
          </div>

          {/* Main temperature and condition */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-2">
              {data?.temperature !== undefined ? (
                <span className="text-5xl font-bold tabular-nums text-foreground">
                  {Math.round(data.temperature)}°
                </span>
              ) : (
                <Skeleton className="h-12 w-20" />
              )}
            </div>

            {data?.condition ? (
              <WeatherIcon condition={data.condition} className="h-12 w-12" />
            ) : (
              <Skeleton className="h-12 w-12 rounded-full" />
            )}
          </div>

          {/* Humidity and Wind */}
          {(data?.humidity !== undefined || data?.windSpeed !== undefined || showSkeleton) && (
            <div className="mt-4 flex gap-4">
              {data?.humidity != null ? (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Droplets className="h-4 w-4" />
                  <span className="tabular-nums">{data.humidity}%</span>
                </div>
              ) : showSkeleton ? (
                <Skeleton className="h-5 w-14" />
              ) : null}

              {data?.windSpeed != null ? (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Wind className="h-4 w-4" />
                  <span className="tabular-nums">{data.windSpeed} km/h</span>
                </div>
              ) : showSkeleton ? (
                <Skeleton className="h-5 w-16" />
              ) : null}
            </div>
          )}
        </div>

        {/* Forecast */}
        {(data?.forecast || showSkeleton) && (
          <div className="border-t border-border bg-muted/30 px-6 py-4">
            <div className="grid grid-cols-3 gap-4">
              {data?.forecast ? (
                data.forecast.filter(Boolean).map((day, index) => (
                  <div key={day?.day ?? index} className="flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      {day?.day ?? "..."}
                    </span>
                    {day?.condition ? (
                      <SmallWeatherIcon condition={day.condition} />
                    ) : (
                      <Skeleton className="h-5 w-5 rounded-full" />
                    )}
                    <div className="flex gap-1 text-xs tabular-nums">
                      {day?.high !== undefined ? (
                        <span className="font-medium">{Math.round(day.high)}°</span>
                      ) : (
                        <Skeleton className="h-3 w-4" />
                      )}
                      {day?.low !== undefined ? (
                        <span className="text-muted-foreground">
                          {Math.round(day.low)}°
                        </span>
                      ) : (
                        <Skeleton className="h-3 w-4" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <Skeleton className="h-3 w-8" />
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-3 w-10" />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);
WeatherCard.displayName = "WeatherCard";

export { WeatherCard, WeatherIcon, weatherCardVariants };
export type { WeatherCardProps };

