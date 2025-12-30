"use client";

import { Stream } from "@stream.ui/react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudSnow,
  CloudSun,
  Droplets,
  Sun,
  Wind,
} from "lucide-react";
import type { DeepPartial } from "@stream.ui/react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { WeatherCardData, WeatherCondition } from "./weather-card-schema";

const conditionIcons: Record<WeatherCondition, React.ElementType> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudDrizzle,
  snowy: CloudSnow,
  windy: Wind,
  stormy: CloudLightning,
  foggy: CloudFog,
  partly_cloudy: CloudSun,
};

function WeatherIcon({ condition }: { condition?: WeatherCondition }) {
  if (!condition) return <Skeleton className="h-12 w-12 rounded-full" />;
  const Icon = conditionIcons[condition] ?? Cloud;
  return <Icon className="h-12 w-12" />;
}

function ForecastDay({
  day,
}: {
  day: { day: string; high: number; low: number; condition: WeatherCondition };
}) {
  const Icon = conditionIcons[day.condition] ?? Cloud;
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-muted-foreground">{day.day}</span>
      <Icon className="h-5 w-5" />
      <div className="flex gap-1 text-xs">
        <span className="font-medium">{day.high}°</span>
        <span className="text-muted-foreground">{day.low}°</span>
      </div>
    </div>
  );
}

function ForecastSkeleton() {
  return (
    <div className="flex justify-around">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-3 w-10" />
        </div>
      ))}
    </div>
  );
}

interface WeatherCardProps {
  data: DeepPartial<WeatherCardData> | undefined;
  isLoading: boolean;
  error?: Error;
}

export function WeatherCard({ data, isLoading, error }: WeatherCardProps) {
  const isStreaming = isLoading && data !== undefined;
  const isComplete = !isLoading && data !== undefined;
  const currentState = isComplete
    ? "complete"
    : isStreaming
      ? "streaming"
      : isLoading
        ? "loading"
        : "idle";

  const borderColors = {
    idle: "",
    loading: "border-yellow-500/50",
    streaming: "border-blue-500/50",
    complete: "border-green-500/50",
  };

  const condition = data?.condition as WeatherCondition | undefined;
  const forecast = data?.forecast as WeatherCardData["forecast"] | undefined;

  return (
    <Stream.Root data={data} isLoading={isLoading} error={error}>
      <Card className={`py-0 transition-colors ${borderColors[currentState]}`}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div className="space-y-1">
              <div className="min-h-7 text-xl font-semibold">
                <Stream.Field fallback={<Skeleton className="h-7 w-32" />}>
                  {data?.location}
                </Stream.Field>
              </div>
              <div className="min-h-5 text-sm text-muted-foreground">
                <Stream.Field fallback={<Skeleton className="h-4 w-20" />}>
                  {data?.condition}
                </Stream.Field>
              </div>
            </div>
            <WeatherIcon condition={condition} />
          </div>

          {/* Temperature */}
          <div className="mb-4 min-h-16">
            <div className="text-6xl font-bold tabular-nums tracking-tighter">
              <Stream.Field fallback={<Skeleton className="h-16 w-28" />}>
                <span>{data?.temperature}°</span>
              </Stream.Field>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-4 flex gap-4">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Droplets className="h-4 w-4" />
              <span className="min-w-8">
                <Stream.Field fallback={<Skeleton className="inline-block h-4 w-8" />}>
                  <span>{data?.humidity}%</span>
                </Stream.Field>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Wind className="h-4 w-4" />
              <span className="min-w-12">
                <Stream.Field fallback={<Skeleton className="inline-block h-4 w-12" />}>
                  <span>{data?.windSpeed} km/h</span>
                </Stream.Field>
              </span>
            </div>
          </div>

          {/* Forecast */}
          <div className="border-t pt-4">
            <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              3-Day Forecast  
            </div>
            <Stream.List items={forecast} fallback={<ForecastSkeleton />}>
              {(days) => (
                <div className="flex justify-around">
                  {days.map((day, index) => (
                    <ForecastDay key={day.day ?? index} day={day} />
                  ))}
                </div>
              )}
            </Stream.List>
          </div>
        </CardContent>
      </Card>
    </Stream.Root>
  );
}
