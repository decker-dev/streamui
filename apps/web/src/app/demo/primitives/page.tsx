"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Stream } from "@stream.ui/react";
import { Cloud, CloudRain, CloudSnow, Droplets, Send, Sun, Wind } from "lucide-react";
import * as React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Schema for weather data
const weatherSchema = z.object({
  location: z.string(),
  temperature: z.number(),
  condition: z.enum(["sunny", "cloudy", "rainy", "snowy", "windy"]),
  humidity: z.number(),
  windSpeed: z.number(),
  forecast: z.array(
    z.object({
      day: z.string(),
      condition: z.enum(["sunny", "cloudy", "rainy", "snowy", "windy"]),
      high: z.number(),
      low: z.number(),
    })
  ),
});

type WeatherCondition = "sunny" | "cloudy" | "rainy" | "snowy" | "windy";

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />
  );
}

function WeatherIcon({ condition, className }: { condition: WeatherCondition; className?: string }) {
  const iconClass = `h-8 w-8 ${className ?? ""}`;
  switch (condition) {
    case "sunny":
      return <Sun className={`${iconClass} text-amber-500`} />;
    case "cloudy":
      return <Cloud className={`${iconClass} text-slate-400`} />;
    case "rainy":
      return <CloudRain className={`${iconClass} text-blue-500`} />;
    case "snowy":
      return <CloudSnow className={`${iconClass} text-sky-300`} />;
    case "windy":
      return <Wind className={`${iconClass} text-teal-500`} />;
  }
}

/**
 * Weather Card built with Stream primitives.
 * 
 * This demonstrates how the primitives abstract away
 * the repetitive pattern of checking for undefined values.
 */
function WeatherCardWithPrimitives() {
  const [inputValue, setInputValue] = React.useState("");

  const { object, submit, isLoading, error } = useObject({
    api: "/api/stream/weather",
    schema: weatherSchema,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    submit({ prompt: inputValue });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full max-w-sm mx-auto">
        <Stream.Root data={object} isLoading={isLoading} error={error}>
          <div className="relative min-w-[280px] overflow-hidden rounded-2xl border bg-card text-card-foreground">
            <div className="p-6">
              {/* Location - using Stream.Field */}
              <div className="mb-4">
                <Stream.Field path="location" fallback={<Skeleton className="h-6 w-32" />}>
                  {(location) => (
                    <h3 className="text-lg font-semibold text-foreground">
                      {location as string}
                    </h3>
                  )}
                </Stream.Field>
              </div>

              {/* Temperature and condition */}
              <div className="flex items-center justify-between gap-4">
                <Stream.Field path="temperature" fallback={<Skeleton className="h-12 w-20" />}>
                  {(temp) => (
                    <span className="text-5xl font-bold tabular-nums text-foreground">
                      {Math.round(temp as number)}°
                    </span>
                  )}
                </Stream.Field>

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

            {/* Forecast - using Stream.List */}
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
                    {(days as Array<{ day: string; condition: WeatherCondition; high: number; low: number }>).map((day, i) => (
                      <div key={day.day ?? i} className="flex flex-col items-center gap-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {day.day}
                        </span>
                        <WeatherIcon condition={day.condition} className="h-5 w-5" />
                        <div className="flex gap-1 text-xs tabular-nums">
                          <span className="font-medium">{Math.round(day.high)}°</span>
                          <span className="text-muted-foreground">{Math.round(day.low)}°</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Stream.List>
            </div>

            {/* Streaming indicator - using Stream.When */}
            <Stream.When streaming>
              <div className="absolute top-3 right-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              </div>
            </Stream.When>
          </div>

          {/* Error handling - using Stream.When */}
          <Stream.When error>
            {(err) => (
              <p className="text-sm text-destructive text-center mt-4">
                Error: {err.message}
              </p>
            )}
          </Stream.When>
        </Stream.Root>
      </div>

      <form onSubmit={onSubmit} className="flex gap-2 max-w-sm mx-auto w-full">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a city name…"
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Get weather</span>
        </Button>
      </form>

      <div className="flex flex-wrap justify-center gap-2">
        {["Tokyo", "New York", "London", "Sydney", "Buenos Aires"].map((city) => (
          <Button
            key={city}
            variant="outline"
            size="sm"
            onClick={() => {
              setInputValue(city);
              submit({ prompt: city });
            }}
            disabled={isLoading}
          >
            {city}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function PrimitivesDemo() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">
          Stream Primitives Demo
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Weather card built with <code className="text-sm bg-muted px-1.5 py-0.5 rounded">@stream.ui/react</code> primitives
        </p>

        <WeatherCardWithPrimitives />

        <div className="mt-12 p-6 bg-muted/50 rounded-xl">
          <h2 className="font-semibold mb-4">How it works</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <code className="bg-muted px-1.5 py-0.5 rounded">Stream.Root</code> - Provides context with streaming data and state
            </p>
            <p>
              <code className="bg-muted px-1.5 py-0.5 rounded">Stream.Field</code> - Accesses a field by path, shows fallback while undefined
            </p>
            <p>
              <code className="bg-muted px-1.5 py-0.5 rounded">Stream.List</code> - Renders arrays that grow as data streams in
            </p>
            <p>
              <code className="bg-muted px-1.5 py-0.5 rounded">Stream.When</code> - Conditionally renders based on stream state
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

